import { i_message_queue } from 'src/types/kook_message';

/**
 * description: kook api 请求消息队列
 */
export const message_queue: i_message_queue = {
  msg_id_queue: [],
  reply_group_message_queue: [],
  reply_private_message_queue: [],
  update_group_message_queue: new Map([]),
  update_private_message_queue: new Map([]),
  reaction_group_mssage_queue: [],
  reaction_private_mssage_queue: [],
};

/**
 * description: 机器人当前状态
 */
export const bot_current_status = {
  /**
   * description: 机器人是否开启
   */
  open: true,
  /**
   * description: 机器人关闭后的回复消息
   */
  feedback_text: '服务器维护中...',
};
