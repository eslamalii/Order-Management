import { Sequelize } from 'sequelize-typescript'
import dotenv from 'dotenv'
import {
  Category,
  EmailVerificationToken,
  Item,
  Order,
  OrderItem,
  PasswordResetToken,
  Role,
  User,
} from '../models'

dotenv.config()

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SCHEMA = 'public',
} = process.env as Record<string, string>

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  console.error(
    '❌ One or more required DB_* environment variables are missing.'
  )
  process.exit(1)
}

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  schema: DB_SCHEMA,
  logging: false,
  models: [
    User,
    Order,
    Category,
    EmailVerificationToken,
    Item,
    OrderItem,
    PasswordResetToken,
    Role,
  ],
  define: {
    underscored: true,
    timestamps: true,
  },
})

export async function connectDB(): Promise<void> {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established.')
    await sequelize.sync({ alter: true })
    console.log('✅ Models synchronized with the database.')
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err)
    process.exit(1)
  }
}
