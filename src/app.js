import path from "node:path"

import * as dotenv from "dotenv"


dotenv.config({ path: path.join("./src/config/.env.dev") })



console.log('PORT:', process.env.PORT)
console.log('MOOD:', process.env.MOOD)
console.log('DB_URI exists:', !!process.env.DB_URI)

import bootstrap from './app.controller.js'

bootstrap()
 