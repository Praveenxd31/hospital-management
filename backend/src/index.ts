import 'dotenv/config'
import app from './app'
import { logger } from './utils/logger'
import prisma from './config/db'     

const PORT = process.env.PORT || 5000

async function bootstrap() {
  try {
    await prisma.$connect()
    logger.info('Database connected')

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start server', error)
    process.exit(1)
  }
}

bootstrap()