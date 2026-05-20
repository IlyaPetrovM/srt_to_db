const config = {
  PORT: process.env.PORT || 3333,
  DB: {
    host: process.env.DB_HOST || '10.79.165.203',
    port: process.env.DB_PORT || 3306,
    database: 'mediarch',
    user: 'mediarch_user',
    password: 'mediarch_password'
  }
};

module.exports = config;
