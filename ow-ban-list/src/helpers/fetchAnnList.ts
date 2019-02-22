import getText from './getText'
import getAnnList from './getAnnList'
import { BAN_INDEX } from '../config'


/**
 * @description Fetch ban announcement index from web page.
 * @param indexUrl Optional. URL of ban announcements index.
 */
export async function fetchAnnList(indexUrl: string = BAN_INDEX) {
  let html: string = await getText(indexUrl)
  return Array.from(getAnnList(html))
}

export default fetchAnnList