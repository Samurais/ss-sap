/**
 * Test Dialog Support with Chinese Lang 
 */
const test = require('ava')
const superagent = require('superagent')
const config = require('../config/environment')
const baseUrl = `http://localhost:${config.node.port}`

async function getReply(textMessage) {
    let result = await superagent.post(`${baseUrl}/api/v1/chabot/reply`)
        .set("Content-Type", "application/json")
        .send({
            fromUserId: "hain",
            textMessage: textMessage
        })
    return result.body
}

/**
 * Test Functional API
 * Test api:getReply(hello)
 */
test.before(async t => {
    let reply = await getReply('hello')
    console.log('getReply(hello)', reply)
    t.is(reply.rc, 0, "Response code should be 0.")
    t.pass()
})

/**
 * Test Alternates
 */
test('Test Alternates api:getReply(你在哪个学校)', async function (t) {
    let reply = await getReply('你在哪个学校')
    console.log('getReply(你在哪个学校)', reply)
    t.is(reply.data.string, "北京信息科技大学", "Reply string should be 北京信息科技大学.")
    t.pass()
})

test('Test Alternates api:getReply(你毕业于哪个学校)', async function (t) {
    let reply = await getReply('你毕业于哪个学校')
    console.log('getReply(你毕业于哪个学校)', reply)
    t.is(reply.data.string, "北京信息科技大学", "Reply string should be 北京信息科技大学.")
    t.pass()
})

/**
 * Test Optionals
 */
test('Test Optionals api:getReply(清河小营)', async function (t) {
    let reply = await getReply('清河小营')
    console.log('getReply(清河小营)', reply)
    t.is(reply.data.string, "我也在附近", "Reply string should be 我也在附近.")
    t.pass()
})

test('Test Optionals api:getReply(清河小营校区)', async function (t) {
    let reply = await getReply('清河小营校区')
    console.log('getReply(清河小营校区)', reply)
    t.is(reply.data.string, "我也在附近", "Reply string should be 我也在附近.")
    t.pass()
})

/**
 * Test Segmenter 
 */
test('Test Optionals api:getReply(聊天是一门艺术)', async function (t) {
    let reply = await getReply('聊天是一门艺术')
    console.log('getReply(聊天是一门艺术)', reply)
    t.truthy(reply.data.lang_code === 'cmn', "Reply string should be 我也在附近.")
    t.truthy(reply.data.nlp_chinese.cut.length > 0, "Reply should contain nlp_chinese.cut")
    t.truthy(reply.data.nlp_chinese.keywords.length > 0, "Reply should contain nlp_chinese.keywords")
    t.pass()
})