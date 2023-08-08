import { Injectable } from '@nestjs/common';
import { get_help_card, get_set_card } from 'src/utils/get_kook_card';
import { message_queue } from 'src/cache_data';
import { i_message_data } from 'src/types/kook_message';
import { KOOK_SEND_MSG_TYPE } from 'src/consts/kook';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async help(message: i_message_data) {
    const { user_id, is_private, channel_id, msg_id } = message;

    const content = get_help_card(user_id);

    is_private
      ? message_queue.reply_private_message_queue.push({
          user_id,
          content,
          type: KOOK_SEND_MSG_TYPE.card,
        })
      : message_queue.reply_group_message_queue.push({
          content,
          channel_id,
          quote: msg_id,
          type: KOOK_SEND_MSG_TYPE.card,
        });
  }

  async info(message: i_message_data) {
    //
  }

  async set(message: i_message_data) {
    const { user_id, is_private, channel_id, msg_id } = message;

    const content = get_set_card({ user_id });

    is_private
      ? message_queue.reply_private_message_queue.push({
          user_id,
          content,
          type: KOOK_SEND_MSG_TYPE.card,
        })
      : message_queue.reply_group_message_queue.push({
          content,
          channel_id,
          quote: msg_id,
          type: KOOK_SEND_MSG_TYPE.card,
        });
  }

  async private_chat(message: i_message_data) {
    const { user_id } = message;
    message_queue.reply_private_message_queue.push({
      user_id,
      content: '你好',
      type: KOOK_SEND_MSG_TYPE.text,
    });
  }

  async button_click(message: i_message_data) {
    const {
      is_private,
      user_id,
      channel_id,
      button_data = {},
      is_target,
    } = message;

    // 如果不是目标用户点击的按钮，不处理
    // 可根据个人需求处理 如有些按钮允许所有人点击 请将是否允许点击的参数放在按钮value中 然后从button_data中取出
    if (is_target === false) {
      return;
    }

    // case 可以再拆出去单独函数处理
    switch (button_data.type) {
      case 'set_a':
        is_private
          ? message_queue.reply_private_message_queue.push({
              user_id,
              content: '设置a成功',
              type: KOOK_SEND_MSG_TYPE.kmd,
            })
          : message_queue.reply_group_message_queue.push({
              channel_id,
              type: KOOK_SEND_MSG_TYPE.kmd,
              content: `(met)${user_id}(met)设置a成功`,
            });
        break;
      case 'set_b':
        break;
      default:
        break;
    }
  }
}
