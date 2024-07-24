export default () => ({
  port: Number(process.env.SERVER_PORT),
  pgDatabase: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES,
  },
  bcrypt: {
    salt: Number(process.env.BCRYPT_SALT),
  },
});
