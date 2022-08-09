import express from 'express'
import setupMiddleware from '@/main/config/middlewares'
import setupRoutes from '@/main/config/routes'
import setupStaticFiles from './static-files'

const app = express()
setupStaticFiles(app)
setupMiddleware(app)
setupRoutes(app)
export default app
