// import { Database } from '@adonisjs/lucid/database'
import { Logger } from '@adonisjs/core/logger'
import db from '@adonisjs/lucid/services/db'

const logger = new Logger({ enabled: true })

async function checkDatabaseConnection() {
  try {
    await db.connection().raw('SELECT 1+1 as result')
    logger.info('Database connection successful')
  } catch (error) {
    logger.error('Database connection failed', error)
    process.exit(1) // Exit the process with an error code
  }
}

checkDatabaseConnection()
