/**
 * description kook解析后的自定义的消息类型
 */
export const KOOK_MSG_TYPE = {
  /**
   * 首次进入服务器 系统欢迎消息
   */
  group_system: 'group_system',
  /**
   *  设置
   */
  set: 'set',
  /**
   *  个人信息
   */
  info: 'info',
  /**
   *  帮助
   */
  help: 'help',
  /**
   * 点击卡片按钮
   */
  click_card_button: 'click_card_button',
  /**
   * 文字私聊
   */
  private_chat: 'private_chat',
};

/**
 * description: kook发送消息类型
 */
export const KOOK_SEND_MSG_TYPE = {
  /**
   * description: 文本消息
   */
  text: 1,
  /**
   * description: kmarkdown消息 https://developer.kookapp.cn/doc/kmarkdown
   */
  kmd: 9,
  /**
   * description: 卡片消息 https://developer.kookapp.cn/doc/cardmessage
   */
  card: 10,
};
