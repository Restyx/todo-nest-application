export default () => ({
  server: {
    port: parseInt(process.env.SERVER_PORT) || 3000,
  },
  database: {
    postgres: {
      host: process.env.POSTGRES_HOST || 'todo-app-monolith-db', // or localhost if you are not using docker-compose
      port: parseInt(process.env.POSTGRES_PORT) || 5432,
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'postgres',
      synchronize: process.env.POSTGRES_SYNCHRONIZE || true
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES || '1d',
  },
  bcrypt: {
    salt: parseInt(process.env.BCRYPT_SALT) || 10,
  },
});
