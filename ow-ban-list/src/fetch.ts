import getText from './helpers/getText'
import getAnnList from './helpers/getAnnList'
import parseAnn from './helpers/parseAnn'
import TaskQueue from './helpers/TaskQueue'
import { BAN_INDEX } from './config'
import { writeFile } from 'fs'
import { promisify } from 'util'


/**
 * @description Fetch ban announcements.
 * @param startIndex Optional. The index of announcement to start with. (For pagination)
 * @param maxAnnouncement Optional. Max number of announcements to be fetched.
 * @param maxConcurrency Optional. Max number of concurrent tasks.
 * @param indexUrl Optional. URL of ban announcements index.
 */
export async function fetch(
  startIndex: number = 0,
  maxAnnouncement: number = 0,
  maxConcurrency: number = 5,
  indexUrl: string = BAN_INDEX
) {
  let html: string = await getText(indexUrl)
  let tasks = []
  let announcements: Announcement[] = []
  let i = 0
  for(let annMeta of getAnnList(html)) {
    if(i < startIndex) {
      i++
      continue
    }
    // Push task
    announcements.push(annMeta)
    let index = i - startIndex
    tasks.push(async function() {
      const text = await getText(annMeta.url)
      let res = parseAnn(text)
      announcements[index].bans = res[0]
      announcements[index].date = res[1]
    })
    i++
    if(maxAnnouncement && i - startIndex >= maxAnnouncement) break
  }
  if(tasks.length == 0) return {
    anns: [],
    errs: []
  }
  // Start task
  let queue = new TaskQueue<void>(tasks, maxConcurrency)
  await queue.start()
  return {
    anns: announcements,
    errs: queue.errs
  }
}

export default fetch

/**
 * @description Fetch announcements with ban blocks and dump to a JSON file.
 * @param path Path to destination JSON file.
 * @param maxConcurrency Max number of concurrent fetch tasks.
 */
export async function build(path: string, maxConcurrency: number = 50) {
  const writeFileAsync = promisify(writeFile)
  const { anns, errs } = await fetch(0, 0, maxConcurrency)
  let errIndex = Object.keys(errs)
  if(errIndex.length) {
    console.warn('Failed to fetch some announcements:')
    for(let annIndex in errs) {
      let ann = anns[annIndex]
      let err = errs[annIndex]
      err = err instanceof Error ? (err.stack || err.toString()) : err
      console.warn(`${ann.name} (${ann.url}): ${err}`)
    }
  }
  await writeFileAsync(path, JSON.stringify(anns.map(ann => {
    if(ann.date) ann.date = ann.date.getTime() as any
    return ann
  })))
}