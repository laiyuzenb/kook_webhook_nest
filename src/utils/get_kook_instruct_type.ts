import { get } from 'lodash';
import { KOOK_MSG_TYPE } from 'src/consts/kook';
import { i_message_data } from 'src/types/kook_message';

/**
 * description: 获取kook消息类型 vscode 鼠标hover KOOK_MSG_TYPE KEY 查看描述
 */
export function get_kook_instruct_type(message): i_message_data {
  const {
    channel_type = '',
    content = '',
    author_id = '',
    type = '',
  } = message;

  // 是否是文字消息
  const is_text = type === 9;

  // 是否是文字私聊
  const is_private =
    channel_type === 'PERSON' &&
    type === 9 &&
    ['1', '3900775823'].includes(author_id) === false;

  const extra_type = get(message, 'extra.type', '');

  const row_content = get(message, 'content', '');

  const msg_id = get(message, 'msg_id', '');

  const user_id = get(message, 'extra.author.id', '');

  const user_name = get(message, 'extra.author.username', '');

  const identify_num = get(message, 'extra.author.identify_num', '');

  const user_avatar = get(message, 'extra.author.avatar', '');

  const guild_id = get(message, 'extra.guild_id', '');

  const channel_id = get(message, 'target_id', '');

  const channel_name = get(message, 'extra.channel_name', '');

  const quote_type = get(message, 'extra.quote.type', '');

  const quote_content = get(message, 'extra.quote.content', '');

  const message_data = {
    // 是否私聊
    is_private,
    // 指令类型 如 /设置 /帮助
    instruct_type: '',
    // 消息id
    msg_id,
    // 服务器id(仅限服务器频道)
    guild_id: is_private ? '' : guild_id,
    // 频道id(仅限服务器频道)
    channel_id: is_private ? '' : channel_id,
    // 频道名(仅限服务器频道)
    channel_name: is_private ? '' : channel_name,
    // 用户id
    user_id,
    // 用户名
    user_name: `${user_name}#${identify_num}`,
    // 用户头像
    user_avatar,
    // 处理后（删除指令名后）消息内容
    content: '',
    // 原始消息内容
    row_content,
    // 引用消息类型
    quote_type,
    // 引用消息内容
    quote_content,
    // 是否是我发送卡片的用户(仅限卡片消息)
    is_target: false,
    // 按钮数据(仅限卡片消息)
    button_data: undefined,
  };

  // 首先去除首位空格 作为用户手抖容错
  const trim_content = content.trim();

  // 首次进入服务器 系统欢迎消息（可不处理）
  if (channel_type === 'GROUP' && ['1', '3900775823'].includes(author_id)) {
    message_data.instruct_type = KOOK_MSG_TYPE.group_system;
    return message_data;
  }

  // 帮助指令
  if (trim_content.startsWith('/帮助')) {
    message_data.instruct_type = KOOK_MSG_TYPE.help;

    return message_data;
  }

  // 个人信息指令
  if (trim_content.startsWith('/个人信息')) {
    message_data.instruct_type = KOOK_MSG_TYPE.info;

    return message_data;
  }

  // 设置指令
  if (trim_content.startsWith('/设置')) {
    message_data.instruct_type = KOOK_MSG_TYPE.set;

    message_data.content = trim_content.replace('/设置', '');
    return message_data;
  }

  // 点击卡片事件
  if (extra_type === 'message_btn_click') {
    const button_body = get(message, 'extra.body', {});
    const body_user_info = get(button_body, 'user_info', {});
    const msg_id = get(button_body, 'msg_id', '');
    const user_id = get(body_user_info, 'id', '');
    const user_name = get(body_user_info, 'username', '');
    const identify_num = get(body_user_info, 'identify_num', '');

    let button_data: any = {};

    try {
      button_data = JSON.parse(get(button_body, 'value', '{}'));
    } catch (error) {
      // json解析失败
    }
    // 判断 文字频道还是私聊
    const is_private =
      get(button_body, 'channel_type', '') === 'GROUP' ? false : true;

    // 点击卡片的用户是否是我发送卡片的用户（可自行处理是否只能指定用户点击）
    const is_target = button_data?.user_id === user_id;

    const guild_id = get(message, 'extra.body.guild_id', '');
    const channel_id = get(message, 'extra.body.target_id', '');

    message_data.instruct_type = KOOK_MSG_TYPE.click_card_button;
    message_data.msg_id = msg_id;
    message_data.user_id = user_id;
    message_data.user_name = `${user_name}#${identify_num}`;
    message_data.is_private = is_private;
    message_data.guild_id = guild_id;
    message_data.channel_id = channel_id;
    message_data.is_target = is_target;
    message_data.button_data = button_data;

    return message_data;
  }

  if (is_private && is_text) {
    message_data.instruct_type = KOOK_MSG_TYPE.private_chat;

    return message_data;
  }

  return message_data;
}
