import path from "node:path"

import * as dotenv from "dotenv"


if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join("./src/config/.env.production") })
}

console.log('PORT:', process.env.PORT)


import bootstrap from './app.controller.js'


bootstrap()
 