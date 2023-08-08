import { createDecipheriv } from 'crypto';
import { get_config } from 'src/utils/config';

// 在 encrpytKey 后面补 \0 至长度等于 32 位，得到 key
function zero_padding(key: string) {
  const keyByte = Buffer.from(key, 'utf-8');

  if (keyByte.length < 32) {
    const result = Buffer.alloc(32);

    Buffer.from(key, 'utf-8').copy(result);

    return result;
  }

  return keyByte;
}

// 解密kook消息
function decrypt_data(encrypt_data) {
  const configs = get_config();
  // 1.将密文用 base64 解码
  const encrypted = Buffer.from(encrypt_data, 'base64');
  // 2.截取前16位得到 iv,
  const iv = encrypted.subarray(0, 16);
  // 3. 截取16位之后的数据为新的密文 用 base64 解码新的密文, 得到待解密数据
  const encryptedData = Buffer.from(
    encrypted.subarray(16, encrypted.length).toString(),
    'base64',
  );
  // 4. 在 encrpytKey 后面补 \0 至长度等于 32 位，得到 key
  const key = zero_padding(configs.kook_bot_encrypt_key);
  // 5. 利用上面的 iv, key, 待解密数据，采用 aes-256-cbc 解密数据
  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  // 6. 将数据转为buffer 再转为JSON
  const decrypt = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);
  const data = JSON.parse(decrypt.toString());

  // 校验请求的verify_token 与机器人的是否一致 防止收到伪造的消息
  if (data.d.verify_token !== configs.kook_bot_verify_token) {
    throw Error('verify_token不一致');
  }

  return data;
}

// 获取kook消息 防止解密失败报错
export function handle_decrypt_data(encrypt_data) {
  try {
    const data = decrypt_data(encrypt_data);
    return data;
  } catch (error) {
    return {};
  }
}
