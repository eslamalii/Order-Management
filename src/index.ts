import 'reflect-metadata'
import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/database'
import authRoutes from './routes/authRoutes'
import { errorHandler } from './utils/errorHandler'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Order Management API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  })
)

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: '🎉 API is up and running' })
})

app.use('/api/auth', authRoutes)
app.use(errorHandler)
;(async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
    console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`)
  })
})()
