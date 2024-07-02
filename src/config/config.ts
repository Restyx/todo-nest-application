export default () => ({
  port: Number(process.env.SERVER_PORT),
  pgDatabase: {
    host: process.env.POSTGRESQL_HOST,
    port: Number(process.env.POSTGRESQL_PORT),
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    database: process.env.POSTGRESQL_DATABASE,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  bcrypt: {
    salt: Number(process.env.BCRYPT_SALT)
  }
});
