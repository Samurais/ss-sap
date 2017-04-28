/**
 * zh_CN Segmenter
 * http://wooorm.com/franc/
 * https://github.com/wooorm/franc/tree/master/packages/franc-all
 */
const franc = require('franc');
const superagent = require("superagent");
const config = require('../config/environment');
const logger = require('../services/logging.service').getLogger('message/zh_CN.plugin')

/**
 * cut Chinese Sentence
 * @param {*} sentence 
 */
async function cutChineseSentence(data) {
    let result = await superagent.post(`${config.hanlpUri}/tokenizer`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data);
    return result.body.data
}

/**
 * Get key words
 * @param {*} data 
 */
async function getKeywordsChineseSentence(data) {
    let result = await superagent.post(`${config.hanlpUri}/keyword`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .send(data);
    return result.body.data
}

const addCNWords = async function addCNWords(cb) {
    logger.info('this.message', this.message.clean)
    let result = franc(this.message.clean, { minLength: 1 });
    this.message.lang_code = result
    if (result === 'cmn') {
        let cut = await cutChineseSentence({
            "type": "nlp",
            "content": this.message.clean
        });

        let keywords = await getKeywordsChineseSentence({
            "num": 1,
            "content": this.message.clean
        })

        logger.info('nlp data', {
            cut: cut,
            keywords: keywords
        })

        this.message.nlp_chinese = {
            cut: cut,
            keywords: keywords
        }
        cb();
    } else {
        cb();
    }
};


exports = module.exports = {
    addCNWords: addCNWords
}