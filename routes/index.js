/**
 * Route
 */
const router = require('koa-router')()
const debug = require('debug')('ss-spa:route')
const bot = require('../services/bot.service')

router.post('/api/v1/chabot/reply', async function (ctx, next) {
    debug('reply', ctx.request.body)
    let request = ctx.request.body
    if (request && request.fromUserId && request.textMessage) {
        let reply = await bot.reply(request.fromUserId, request.textMessage)
        ctx.body = {
            rc: 0,
            data: reply
        }
    } else {
        ctx.body = {
            rc: 1,
            error: 'Invalid body.'
        }
    }
})


exports = module.exports = router