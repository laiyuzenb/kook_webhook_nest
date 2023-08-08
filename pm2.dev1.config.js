module.exports = {
  apps: [
    {
      name: 'kook_bot_dev1',
      script: 'dist/main.js',
      env_dev1: {
        RUNNING_ENV: 'dev1',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
