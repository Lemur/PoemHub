const cheerio = require('cheerio')
const request = require('request')
const async = require('async')
const fs = require('fs')

var index = 0
function getPoem(url, cb) {

  request(url, function(err, res, body) {
    var $ = cheerio.load(body, {
      ignoreWhitespace: true
    })

    // 标题
    var poemTitle = $('div div div h1').text()
    // 作者
    $('p[style="margin:0px; font-size:12px;line-height:160%;"] span').remove()
    var poemAuthor = $('p[style="margin:0px; font-size:12px;line-height:160%;"]').eq(1).text()
    if (poemAuthor === '' || !poemAuthor) {
      poemAuthor = '佚名'
    }
    //正文
    $('div .son2 p[style="margin:0px; font-size:12px;line-height:160%;"]').remove()
    $('div .son2 div').remove()
    var poemBody = $('div .son2').text()
    poemBody = poemBody.substring(poemBody.lastIndexOf('     ') + 5)

    // 将结果追加到文件
    if (poemBody && poemBody !== '') {
      fs.appendFile('poems.txt', '\n' + poemTitle + '\n' + poemAuthor + '\n' + poemBody + '\n')
      console.log(index++)
      console.log(poemTitle)
      console.log(poemBody)
    }
    cb(null, null)
  })

}

var urls = []


for (var i = 0; i < 71000; ++i) {
  urls.push('http://so.gushiwen.org/view_' + i + '.aspx')
}

async.mapLimit(urls, 10, function(url, cb) {
  getPoem(url, cb)
})
