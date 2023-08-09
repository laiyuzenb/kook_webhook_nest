import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { get } from 'lodash';
import { AppService } from './app.service';
import { handle_decrypt_data } from 'src/utils/kook_message_decrypt';
import { get_kook_instruct_type } from 'src/utils/get_kook_instruct_type';
import { message_queue, bot_current_status } from 'src/cache_data';
import { KOOK_MSG_TYPE, KOOK_SEND_MSG_TYPE } from 'src/consts/kook';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get()
  getHello(): string {
    return this.app.getHello();
  }

  /**
   * description: kook webhook 消息入口
   */
  @Post('challenge')
  @HttpCode(200)
  async challenge(@Body() body): Promise<any> {
    const encrypt: string = get(body, 'encrypt', '');

    // 消息解码
    const data = handle_decrypt_data(encrypt);

    const message_data = get(data, 'd', {
      challenge: '',
    });

    const { challenge, msg_id } = message_data;

    // 文字频道屏蔽机器人消息防止互相回复
    const is_bot = get(message_data, 'extra.author.bot');
    if (is_bot === true) {
      return { challenge };
    }

    // 解析消息类型 及处理和过滤数据 然后根据不同指令类型调用不同服务
    const filter_message_data = get_kook_instruct_type(message_data);

    // 防止收到重复的webhook消息
    const has_msg = message_queue.msg_id_queue.includes(msg_id);
    if (filter_message_data?.instruct_type && has_msg) {
      return { challenge };
    }

    // 将消息id push进任务队列 在 queue serveice中定时清除
    if (filter_message_data?.instruct_type) {
      message_queue.msg_id_queue.push(msg_id);
    }

    // 服务器维护中(对指令消息 回复反馈文本)
    if (
      KOOK_MSG_TYPE[filter_message_data?.instruct_type] &&
      bot_current_status.open === false
    ) {
      // 判断是否是私聊
      filter_message_data.is_private
        ? message_queue.reply_private_message_queue.push({
            type: KOOK_SEND_MSG_TYPE.text,
            user_id: filter_message_data.user_id,
            content: bot_current_status.feedback_text,
          })
        : message_queue.reply_group_message_queue.push({
            type: KOOK_SEND_MSG_TYPE.text,
            channel_id: filter_message_data.channel_id,
            content: bot_current_status.feedback_text,
          });
      return {
        challenge,
      };
    }

    // 指令类型和对应的服务
    const instruct_map = new Map([
      // 帮助
      [KOOK_MSG_TYPE.help, this.app.help],
      // 个人信息
      [KOOK_MSG_TYPE.info, this.app.info],
      // 设置
      [KOOK_MSG_TYPE.set, this.app.set],
      // 点击卡片按钮
      [KOOK_MSG_TYPE.click_card_button, this.app.button_click],
      // 文字私聊
      [KOOK_MSG_TYPE.private_chat, this.app.private_chat],
    ]);

    // 没有指令类型 直接返回
    if (instruct_map.has(filter_message_data?.instruct_type) === false) {
      return {
        challenge,
      };
    }

    instruct_map.get(filter_message_data.instruct_type)(filter_message_data);

    return {
      challenge,
    };
  }

  /**
   * description: 机器人开关控制
   */
  @Post('switch')
  switch(@Body() body): any {
    const { master = 0, open = true, feedback_text = '' } = body;
    // TODO: 权限判断（自己修改自定义字段）
    if (master === 1) {
      bot_current_status.open = open;

      if (feedback_text) {
        bot_current_status.feedback_text = feedback_text;
      }

      return {
        open: bot_current_status.open,
        feedback_text: bot_current_status.feedback_text,
      };
    }

    return '你无权限操作';
  }

  /**
   * description: 查询所有任务队列长度
   */
  @Post('query_queue')
  query_queue(@Body() body): any {
    const { master = 0 } = body;
    // TODO: 权限判断（自己修改自定义字段）
    if (master === 1) {
      return {
        机器人开关: bot_current_status.open,
        回复文字频道消息任务数量:
          message_queue.reply_group_message_queue.length,
        回复私信消息任务数量: message_queue.reply_private_message_queue.length,
        更新文字频道消息任务数量: message_queue.update_group_message_queue.size,
        更新私聊消息任务队列数量:
          message_queue.update_private_message_queue.size,
      };
    }

    return '你无权限操作';
  }
}
