import cron from 'node-cron'
import * as dbService from '../../db/db.service.js'
import BlackListModel from '../../db/models/blackList.model.js'
export const deleteExpiredTokens = async () => {

    try {
        const task = cron.schedule("0 0 * * *", async () => {
            await dbService.deleteMany({
                model: BlackListModel,
                filter: { expireAt: { $lt: new Date() } }
            })
        })

        return task
    } catch (error) {
        console.log(error)
        return null
    }
}