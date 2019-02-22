type BanBlock = {
  header: string
  battleTags: string[]
}

type Announcement = {
  name: string
  url: string
  date?: Date
  bans?: BanBlock[]
}

type BanRecord = {
  battleTag: string
  date: Date
  header: string
  url: string
  announcementName: string
}