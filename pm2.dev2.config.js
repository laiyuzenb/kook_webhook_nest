module.exports = {
  apps: [
    {
      name: 'kook_bot_dev2',
      script: 'dist/main.js',
      env_dev1: {
        RUNNING_ENV: 'dev2',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
