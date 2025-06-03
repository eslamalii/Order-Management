import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/database'

dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: '🎉 API is up and running' })
})
;(async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
  })
})()
