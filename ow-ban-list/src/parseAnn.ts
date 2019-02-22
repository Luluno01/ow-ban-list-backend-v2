import * as cheerio from 'cheerio'


/**
 * @description Parse an announcement.
 * This function assumes that each comment in the announcement has at most one ban block.
 * @param text Announcement page text.
 * @returns Ban blocks in the announcement.
 */
export function parseAnn(text: string): BanBlock[] {
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
  return res
}

export default parseAnn