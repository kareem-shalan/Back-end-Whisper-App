import path from "node:path"

import * as dotenv from "dotenv"


dotenv.config({ path: path.join("./src/config/.env.production") })



console.log('PORT:', process.env.PORT)
console.log('MOOD:', process.env.MOOD)
console.log('DB_URI exists:', !!process.env.DB_URI)

import bootstrap from './app.controller.js'

bootstrap()
 




// module.exports = {
//     apps: [
//       {
//         name: "sraha-app",
//         script: "src/app.js",   // entry point
//         instances: 4,             // number of instances
//         exec_mode: "cluster",     // cluster mode
  
//         // Default environment
//         env: {
//           NODE_ENV: "development",
//           MOOD: "DEV"

//         },
  
//         // Production environment
//         env_production: {
//           NODE_ENV: "development",
//           MOOD: "PRO"

//         },
  
//         // Staging environment
//         env_staging: {
//           NODE_ENV: "staging"
//         }
//       }
//     ]
//   };