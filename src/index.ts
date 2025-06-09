import 'reflect-metadata'
import express, { Application, Request, Response } from 'express'
import { connectDB } from './config/database'
import { createRoutes } from './routes'
import { errorHandler } from './utils/errorHandler'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './docs/swagger'
import { config } from './config/config'
import { setupContainer } from './config/container'
import { CronService } from './services/cronService'
import { TYPES } from './config/types'

const app: Application = express()
const PORT = config.port

app.use(express.json())

const container = setupContainer()

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

app.use('/api/v1', createRoutes(container))
app.use(errorHandler)
;(async () => {
  try {
    await connectDB()

    // Initialize cron jobs after database connection
    const cronService = container.get<CronService>(TYPES.CronService)
    cronService.init()
    console.log('✅ Cron jobs initialized')

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`)
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
})()
