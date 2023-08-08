import { get_config } from './config';

/**
 * description: 获取卡片底部信息
 */
function get_card_footer() {
  const version = get_config('version');
  return {
    type: 'context',
    elements: [
      {
        type: 'kmarkdown',
        content: `kook bot v${version}   |   [官方服务器](https://www.kookapp.cn/)   |   [帮助文档](https://www.kookapp.cn/)`,
      },
    ],
  };
}

/**
 * description: 帮助卡片
 */
export function get_help_card(user_id) {
  const modules = [];

  modules.push({
    type: 'header',
    text: {
      type: 'plain-text',
      content: '指令帮助',
    },
  });

  modules.push({
    type: 'section',
    text: {
      type: 'kmarkdown',
      content: `(met)${user_id}(met)`,
    },
  });

  modules.push({
    type: 'divider',
  });

  modules.push({
    type: 'section',
    text: {
      type: 'kmarkdown',
      content: '**设置指令：**',
    },
  });

  modules.push({
    type: 'section',
    text: {
      type: 'kmarkdown',
      content: '/设置',
    },
  });

  modules.push({
    type: 'divider',
  });

  modules.push(get_card_footer());

  return JSON.stringify([
    {
      type: 'card',
      theme: 'success',
      size: 'lg',
      modules,
    },
  ]);
}

/**
 * description: 设置卡片
 */
export function get_set_card({ user_id }) {
  const modules = [];

  modules.push({
    type: 'header',
    text: {
      type: 'plain-text',
      content: '设置卡片',
    },
  });

  modules.push({
    type: 'section',
    text: {
      type: 'kmarkdown',
      content: `(met)${user_id}(met)`,
    },
  });

  modules.push({
    type: 'action-group',
    elements: [
      {
        type: 'button',
        theme: 'primary',
        click: 'return-val',
        value: JSON.stringify({
          user_id,
          type: 'set_a',
          set_value: 'aaa',
        }),
        text: {
          type: 'plain-text',
          content: '设置A',
        },
      },
      {
        type: 'button',
        theme: 'danger',
        click: 'return-val',
        value: JSON.stringify({
          user_id,
          type: 'set_b',
          set_value: 'bbb',
        }),
        text: {
          type: 'plain-text',
          content: '设置B',
        },
      },
    ],
  });

  modules.push({
    type: 'divider',
  });

  modules.push(get_card_footer());

  return JSON.stringify([
    {
      type: 'card',
      theme: 'success',
      size: 'lg',
      modules,
    },
  ]);
}
