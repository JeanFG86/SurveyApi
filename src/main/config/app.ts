import express from 'express'
import setupMiddleware from '@/main/config/middlewares'

const app = express()
setupMiddleware(app)
export default app
