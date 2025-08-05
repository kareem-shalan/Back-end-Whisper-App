import path from "node:path"

import * as dotenv from "dotenv"

dotenv.config({ path: path.join("./src/config/.env.dev") })

console.log(process.env.PORT)


import bootstrap from './app.controller.js'


bootstrap()
 