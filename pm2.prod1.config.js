module.exports = {
  apps: [
    {
      name: 'kook_bot_prod1',
      script: 'dist/main.js',
      env_prod1: {
        RUNNING_ENV: 'prod1',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
