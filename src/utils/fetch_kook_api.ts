import { request } from 'src/utils/request';
import {
  i_reply_group_message,
  i_reply_private_message,
} from 'src/types/kook_message';

/**
 * description 发送私信
 */
export async function fetch_send_private_message(
  message: i_reply_private_message,
) {
  const { quote, user_id, content, type } = message;
  const data = {
    type,
    quote,
    content,
    target_id: user_id,
  };

  const url = 'https://www.kookapp.cn/api/v3/direct-message/create';

  return request({ url, data });
}

/**
 * description 发送文字频道消息
 */
export async function fetch_send_group_message(message: i_reply_group_message) {
  const url = `https://www.kookapp.cn/api/v3/message/create`;

  const { type, channel_id, content, quote, temp_target_id } = message;
  const data = {
    type,
    quote,
    content,
    temp_target_id,
    target_id: channel_id,
  };

  return request({
    url,
    data,
  });
}

/**
 * description 更新消息(私聊/文字频道 通用)
 */
export async function fetch_update_message({
  msg_id = '',
  content = '',
  is_private = false,
}: {
  msg_id: string;
  content: string;
  is_private: boolean;
}) {
  const group_url = `https://www.kookapp.cn/api/v3/message/update`;
  const private_url = `https://www.kookapp.cn/api/v3/direct-message/update`;

  const data = {
    msg_id,
    content,
  };

  return request({
    url: is_private ? private_url : group_url,
    data,
  });
}

/**
 * description 回应消息(私聊/文字频道 通用)
 */
export async function fetch_reaction_message({
  msg_id,
  emoji = '⌛',
  is_private = false,
}: {
  msg_id: string;
  is_private: boolean;
  emoji: string;
}) {
  const group_url = `https://www.kookapp.cn/api/v3/message/add-reaction`;
  const private_url = `https://www.kookapp.cn/api/v3/direct-message/add-reaction`;

  const data = {
    msg_id,
    emoji,
  };

  return request({
    url: is_private ? private_url : group_url,
    data,
  });
}
