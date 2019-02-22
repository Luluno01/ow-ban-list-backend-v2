import * as cheerio from 'cheerio'


/**
 * @description Parse announcement text to get ban blocks.
 * @param announcement Announcement text.
 * @returns Parsed ban blocks and the publish date of the announcement.
 */
export function parseAnn(text: string): [BanBlock[], Date?] {
  let $ = cheerio.load(text)
  let comments = $('.pcb')
  let res: BanBlock[] = []
  comments.each((index, elem) => {
    let header = $(cheerio('h2', elem)[0]).text()
    let battleTags: string[] = []
    cheerio('blockquote > li', elem).each((index, elem) => {
      battleTags.push($(elem).text())
    })
    if(battleTags.length) res.push({
      header,
      battleTags
    })
  })
  let dates = $('.dateline')
  let date: Date
  if(dates.length) {
    let dateString: string = (cheerio('span', dates[0]).attr('title') || $(dates[0]).text()).trim()
    if(dateString && dateString.match(/^\d+-\d+-\d+\s+\d+:\d+:\d+$/)) date = new Date(dateString + ' UTC+8')
  }
  return [ res, date ]
}

export default parseAnn