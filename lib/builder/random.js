/**
 * 随机生成古诗
 */

import {
  getRandomItem
}
from '../util/random'

import {
  countTemplate
}
from '../util/template'
import render from '../util/render'
import templatesData from '../data/templates'
import wordsData from '../data/words'

/**
 * 随机生成 TemplateData 数据源
 * @param  {Array}   array          原始的数据源数组
 * @param  {Int}     limit          需要几个随机的元素
 * @param  {String}  cTempData      当前已有的汉字组成的字符串，新生成的数组不会有重复的汉字
 * @return {Array}   生成的新随机数组
 */
function buildTemplateArray(array, count, cTempData) {
  const resultArray = []
  while (resultArray.length !== count) {
    // 随机生成汉字词组，如果随机结果和已有数据重复，则弃用本次生成结果
    var r = getRandomItem(array)
    var sameWords = Object.keys(cTempData)
      .reduce((pv, cv) => {
        return pv.concat(cTempData[cv].join('').split(''))
      }, [])
      .concat(resultArray.join('').split(''))
      .filter((cWord) => {
        var same = false
        r.split('').forEach((w) => {
          if (w == cWord) {
            same = true
          }
        })
        return same
      })
    if (sameWords.length === 0) {
      resultArray.push(r)
    }
  }

  return resultArray
}


function buildTemplate(template) {
  const templateCount = countTemplate(template)

  const aDataWords = wordsData.A
  const bDataWords = getRandomItem(wordsData.B)

  const templateData = Object.keys(templateCount).reduce((pv, cv) => {
    const type = cv.split('')[0]
    const length = cv.split('')[1]
    const pz = cv.split('')[2]
    const count = templateCount[cv]
    var words = []
    switch (type) {
      case 'A':
        words = aDataWords[length][pz]
        break
      case 'B':
        words = bDataWords[length][pz]
        break
      default:
        break
    }
    const data = buildTemplateArray(words, count, pv)
    pv[cv] = data
    return pv
  }, {})
  return render(template, templateData)
}

export default function build(temp) {
  const t = temp || getRandomItem(templatesData)
  return buildTemplate(t)
}

// console.log(build())
