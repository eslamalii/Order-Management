export const config = {
  // Server
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database
  database: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    schema: process.env.DB_SCHEMA || 'public',
    url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=${process.env.DB_SCHEMA || 'public'}`,
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  // Email & Tokens
  tokens: {
    emailTokenExpirationHours:
      Number(process.env.EMAIL_TOKEN_EXPIRES_IN_HOURS) || 24,
    passwordResetExpirationHours:
      Number(process.env.PASSWORD_RESET_EXPIRES_IN_HOURS) || 24,
  },

  // Security
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // Development helpers
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}
