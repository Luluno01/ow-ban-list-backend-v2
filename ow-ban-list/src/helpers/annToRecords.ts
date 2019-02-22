/**
 * @description Iterate ban records in annoucements.
 * @param anns Announcement objects to be converted.
 */
export function *annToRecords(anns: Announcement[]): IterableIterator<BanRecord> {
  for(let ann of anns) {
    if(!ann.bans) continue
    for(let ban of ann.bans) {
      const header = ban.header
      for(let battleTag of ban.battleTags) {
        yield {
          battleTag,
          date: ann.date,
          header,
          url: ann.url,
          announcementName: ann.name
        }
      }
    }
  }
}

export default annToRecords