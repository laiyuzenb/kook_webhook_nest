import { parse } from 'yaml';
import { isEmpty } from 'lodash';
const path = require('path');
const fs = require('fs');

// 获取项目运行环境
export const getEnv = () => {
  return process.env.RUNNING_ENV;
};

let config_data: any = {};

/**
 * description 获取项目配置参数
 */
export const get_config = (key = '') => {
  // 已注入配置 则返回数据
  if (isEmpty(config_data) === false) {
    // 支持按单个字段返回
    if (key) {
      return config_data[key];
    }
    return config_data;
  }

  const env = getEnv();

  const yaml_path = path.join(process.cwd(), `./.config/${env}.yaml`);

  const file = fs.readFileSync(yaml_path, 'utf8');

  config_data = parse(file);

  return config_data;
};
