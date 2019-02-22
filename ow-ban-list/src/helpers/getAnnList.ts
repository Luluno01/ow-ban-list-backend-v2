import * as cheerio from 'cheerio'
import range from './range'


/**
 * @description Get announcements list from text.
 * @param text Announcements index text.
 */
export function *getAnnList(text: string): IterableIterator<{
  name: string
  url: string
}> {
  let $ = cheerio.load(text)
  let lis = $('blockquote > li > a')
  for(let i of range(lis.length)) {
    let elem = lis[i]
    let url = elem.attribs.href.replace(/^http:\/\/bs.ow.blizzard.cn/g, 'http://bbs.ow.blizzard.cn')
    yield {
      name: $(elem).text(),
      url
    }
  }
}

export default getAnnList