import './config/module-alias'
import env from './config/env'
import app from './config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers'

MongoHelper.connect(env.mongoUrl).then(() => {
  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
}).catch(console.error)
