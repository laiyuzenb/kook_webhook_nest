import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { message_queue } from 'src/cache_data';
import to from 'src/utils/to';
import {
  fetch_update_message,
  fetch_reaction_message,
  fetch_send_group_message,
  fetch_send_private_message,
} from 'src/utils/fetch_kook_api';
import {
  i_update_message,
  i_reply_private_message,
} from 'src/types/kook_message';

@Injectable()
export class Queue_Service {
  /**
   * description: kook 发送（回复）文字频道消息
   */
  @Interval(600)
  async kook_send_group_message() {
    if (message_queue.reply_group_message_queue.length === 0) {
      return;
    }

    const message = message_queue.reply_group_message_queue.shift();

    const [error, result]: any = await to(fetch_send_group_message(message));

    if (error || result?.code !== 0) {
      console.log('发送文字频道消息失败', error, result);
      return;
    }

    console.log('发送文字频道消息成功:', result);
  }

  /**
   * description: kook 发送（回复）私聊消息
   */
  @Interval(600)
  async kook_send_private_message() {
    if (message_queue.reply_private_message_queue.length === 0) {
      return;
    }
    const message: i_reply_private_message =
      message_queue.reply_private_message_queue.shift();

    const [error, result]: any = await to(fetch_send_private_message(message));

    if (error || result?.code !== 0) {
      console.log('发送私信失败', error, result);
      return;
    }

    console.log('发送私信成功:', result);
  }

  /**
   * description: kook 更新 文字频道消息
   */
  @Interval(600)
  async kook_update_group_message() {
    if (message_queue.update_group_message_queue.size === 0) {
      return;
    }

    const msg_id_list = [];

    const map_keys = message_queue.update_group_message_queue.keys();

    // 考虑性能问题 所以不使用 [...map.keys()]
    for (const task_id of map_keys) {
      msg_id_list.push(task_id);
    }

    const msg_id = msg_id_list[0];

    const message: i_update_message =
      message_queue.update_group_message_queue.get(msg_id);

    await to(fetch_update_message(message));

    // 删除队列中的消息
    message_queue.update_group_message_queue.delete(msg_id);
  }

  /**
   * description: kook 更新 私聊消息
   */
  @Interval(600)
  async kook_update_private_message() {
    if (message_queue.update_private_message_queue.size === 0) {
      return;
    }

    const msg_id_list = [];

    const map_keys = message_queue.update_private_message_queue.keys();

    // 考虑性能问题 所以不使用 [...map.keys()]
    for (const task_id of map_keys) {
      msg_id_list.push(task_id);
    }

    const msg_id = msg_id_list[0];

    const message: i_update_message =
      message_queue.update_private_message_queue.get(msg_id);

    await to(fetch_update_message(message));

    // 删除队列中的消息
    message_queue.update_private_message_queue.delete(msg_id);
  }

  /**
   * description: kook 回应 文字频道消息
   */
  @Interval(600)
  async reaction_group_message() {
    if (message_queue.reaction_group_mssage_queue.length === 0) {
      return;
    }

    const message = message_queue.reaction_group_mssage_queue.shift();

    await to(fetch_reaction_message(message));
  }

  /**
   * description: kook 回应 私聊消息
   */
  @Interval(600)
  async reaction_private_message() {
    if (message_queue.reaction_private_mssage_queue.length === 0) {
      return;
    }

    const message = message_queue.reaction_group_mssage_queue.shift();

    await to(fetch_reaction_message(message));
  }

  /**
   * description: 每隔10秒（防止网络波动）清除一个消息id（重复处理消息）
   */
  @Interval(10000)
  async clear_msg_id() {
    if (message_queue.msg_id_queue.length === 0) {
      return;
    }

    message_queue.msg_id_queue.shift();
  }
}
