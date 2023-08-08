import fetch from 'node-fetch';
import { get_config } from 'src/utils/config';

/**
 * description 请求方法
 */
export async function request({
  url,
  method = 'POST',
  headers = {},
  data = {},
}) {
  return new Promise(async (resolve, reject) => {
    const bot_token = get_config('kook_bot_token');
    const body = JSON.stringify(data);

    try {
      const result = await fetch(url, {
        method,
        headers: {
          Authorization: `Bot ${bot_token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
        body,
      }).then((res) => res.json());

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}
