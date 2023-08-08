module.exports = {
  apps: [
    {
      name: 'kook_bot_prod2',
      script: 'dist/main.js',
      env_prod1: {
        RUNNING_ENV: 'prod2',
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
