/**
 * description: kook消息数据
 */
export interface i_message_data {
  /**
   * description: 是否私聊
   */
  is_private: boolean;
  /**
   * description: 指令类型 如 /设置 /帮助
   */
  instruct_type: string;
  /**
   * description: 消息id
   */
  msg_id: string;
  /**
   * description: 服务器id(仅限服务器频道)
   */
  guild_id: string;
  /**
   * description: 频道id(仅限服务器频道)
   */
  channel_id: string;
  /**
   * description: 频道名(仅限服务器频道)
   */
  channel_name: string;
  /**
   * description: 用户id
   */
  user_id: string;
  /**
   * description: 用户名
   */
  user_name: string;
  /**
   * description: 用户头像
   */
  user_avatar: string;
  /**
   * description: 处理后（删除指令名后）消息内容
   */
  content: string;
  /**
   * description: 原始消息内容
   */
  row_content: string;
  /**
   * description: 引用消息类型
   */
  quote_type: string;
  /**
   * description: 引用消息内容
   */
  quote_content: string;
  /**
   * description: 是否是我发送卡片的用户(仅限卡片消息)
   */
  is_target: boolean;
  /**
   * description: 按钮数据(仅限卡片消息)
   */
  button_data: any;
}

/**
 * description kook 回复私信消息参数
 */
export interface i_reply_private_message {
  /**
   * description: 用户id
   */
  user_id: string;
  /**
   * description: 回复内容
   */
  content: string;
  /**
   * description: 消息类型
   */
  type?: number;
  /**
   * description: 回复某条消息的id
   */
  quote?: string;
}

/**
 * description kook 回复文字频道消息参数
 */
export interface i_reply_group_message {
  /**
   * description: 频道id
   */
  channel_id: string;
  /**
   * description: 回复内容
   */
  content: string;
  /**
   * description: 消息类型
   */
  type?: number;
  /**
   * description: 回复某条消息的id
   */
  quote?: string;
  /**
   * description: 用户id 如果传了，代表该消息是临时消息，该消息不会存数据库，但是会在频道内只给该用户推送临时消息。用于在频道内针对用户的操作进行单独的回应通知等。
   */
  temp_target_id?: string;
}

/**
 * description kook 更新消息参数
 */
export interface i_update_message {
  /**
   * description: 消息id
   */
  msg_id: string;
  /**
   * description: 更新内容
   */
  content: string;
  /**
   * description: 是否是私聊
   */
  is_private: boolean;
}

interface i_reaction_params {
  msg_id: string;
  is_private: boolean;
  emoji: string;
}

export interface i_message_queue {
  /**
   * description: 处理中的 消息id队列
   */
  msg_id_queue: string[];
  /**
   * description: 发送（回复）文字频道消息队列
   */
  reply_group_message_queue: i_reply_group_message[];
  /**
   * description: 发送（回复）私信消息队列
   */
  reply_private_message_queue: i_reply_private_message[];
  /**
   * description: 编辑（更新）文字频道消息 队列
   */
  update_group_message_queue: Map<string, i_update_message>;
  /**
   * description: 编辑（更新）私聊消息 队列
   */
  update_private_message_queue: Map<string, i_update_message>;
  /**
   * description: 回应文字频道消息队列
   */
  reaction_group_mssage_queue: i_reaction_params[];
  /**
   * description: 回应私聊消息队列
   */
  reaction_private_mssage_queue: i_reaction_params[];
}
