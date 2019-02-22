import getText from './getText'
import parseAnn from './parseAnn'


/**
 * @description Fetch ban blocks from announcement web page.
 * @param annMeta Announcement meta info including its name an URL.
 */
export async function fetchBanBlocks(annMeta: { name: string, url: string }) {
  const text = await getText(annMeta.url)
  return parseAnn(text)
}

export default fetchBanBlocks