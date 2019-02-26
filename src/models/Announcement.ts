import * as Sequelize from 'sequelize'
import sequelize from './db'
import LastUpdate from './LastUpdate'
import { fetchAnnList } from '../../ow-ban-list/build/helpers'
import BanBlock from './BanBlock'
import TaskQueue from '../../ow-ban-list/build/helpers/TaskQueue'
import retry from '../helpers/retry'
import { formatError } from '../helpers/formatError'


export const Announcement = sequelize.define('announcement', {
  name: Sequelize.STRING,
  url: {
    type: Sequelize.TEXT,
    unique: true
  },
  date: {
    type: Sequelize.DATE,
    allowNull: true,
    defaultValue: null
  }
})

BanBlock.belongsTo(Announcement, { as: 'ann', onDelete: 'cascade' })

export default Announcement as TAnnouncement

export type TAnnouncement = typeof Announcement & {
  id: number
  name: string
  url: string
  date?: Date | null
  createdAt: Date
  updatedAt: Date
  createIndex(): Promise<TAnnouncement[]>
  updateIndex(): Promise<TAnnouncement[]>
  updateIndexAndFetch(): Promise<TAnnouncement[] | undefined>
  prototype: {
    fetch(): Promise<typeof BanBlock[]>
    getBans(): Promise<typeof BanBlock[]>
  }
  fetch(): Promise<typeof BanBlock[]>
  getBans(): Promise<typeof BanBlock[]>
  toJSON(): object
}

export async function sync() {
  // await Announcement.sync({ force: true })  // Re-create table
  console.log('Fetching announcement index')
  let anns = await (Announcement as TAnnouncement).createIndex()  // Create announcements index
  await LastUpdate.setUpdate(anns.length, '')
  console.log('Fetching ban blocks')
  try {
    let job = (new TaskQueue(anns.map(ann => {
      return retry(async function() {
        console.log(`Fetching ban blocks for announcement ${ann.id}`)
        try {
          await BanBlock.fetch(ann)
        } catch(err) {
          console.error(`Failed to fetch ban blocks for announcement ${ann.id}: ${formatError(err)}`)
          throw err
        }
        console.log(`Ban blocks for announcement ${ann.id} fetched`)
      }, 5)
    }), 10))
    await job.start()
    let errIndex = Object.keys(job.errs)
    if(errIndex.length) {
      console.error(`Failed to fetch ban blocks for some announcement(s): ${errIndex.map(i => anns[i].id)}`)
      let err: Error | string = job.errs[errIndex[0]]
      console.error(`The first error is: ${err instanceof Error ? err.stack : err}`)
    }
    console.log('Ban blocks fetched')
  } catch(err) {
    console.error(`Failed to pre-fetch ban blocks: ${err.stack}`)
  }
}

/**
 * @description Create announcements index.
 * Should be used only when synchronizing.
 */
(Announcement as TAnnouncement).createIndex = async () => {
  let annMetas = await fetchAnnList()
  return (await Announcement.bulkCreate(annMetas as any, { returning: true })) as TAnnouncement[]
}

/**
 * @description Update announcements index.
 * @returns Newly inserted announcements.
 */
(Announcement as TAnnouncement).updateIndex = async () => {
  let annMetas = await fetchAnnList()
  // Determine which is new announcement
  let oldAnns = (await Announcement.findAll()) as TAnnouncement[]
  let oldUrls = oldAnns.map(ann => ann.url)
  let newAnnMetas: typeof annMetas = []
  for(let annMeta of annMetas) {
    if(!oldUrls.includes(annMeta.url)) newAnnMetas.push(annMeta)  // New announcement found
  }
  if(newAnnMetas.length == 0) {
    await LastUpdate.setUpdate(annMetas.length, '')
    return []
  }
  return await sequelize.transaction()
  .then(async t => {
    try {
      let anns = (await Announcement.bulkCreate(newAnnMetas as any, { returning: true, transaction: t })) as TAnnouncement[]
      await LastUpdate.setUpdate(anns.length, '', t)
      return anns
    } catch(err) {
      await LastUpdate.setUpdate(0, err, t)  // 0 announcement was updated
    } finally {
      await t.commit()
    }
  })
}

/**
 * @description Update announcements index and fetch their ban blocks.
 * This function does not guarantee that all operations will success.
 * This function will not throw an error if any operation fails.
 * @returns Newly inserted announcements.
 */
(Announcement as TAnnouncement).updateIndexAndFetch = async () => {
  try {
    console.log('Fetching announcement index')
    const anns = await (Announcement as TAnnouncement).updateIndex()
    console.log('Announcement index fetched')
    console.log('Fetching ban blocks for new announcement(s)')
    for(let ann of anns) {
      try {
        console.log(`Fetching ban blocks for announcement ${ann.id}`)
        await (retry(async () => await ann.fetch(), 5)())
        console.log(`Ban block for announcement ${ann.id} fetched`)
      } catch(err) {
        console.error(`Failed to fetch ban blocks for announcement ${ann.id}`)
        throw err
      }
    }
    if(anns.length) console.log(`Announcements updated (${anns.map(ann => ann.id).join(', ')})`)
    else console.log('No new announcements')
    return anns
  } catch(err) {
    console.error(`Failed to update announcement index`)
  }
}

/**
 * @description Re-fetch ban blocks for this announcement.
 */
(Announcement as TAnnouncement).prototype.fetch = async function fetch() {
  return await BanBlock.fetch(this)
};

/**
 * @description Query ban blocks of this announcement from database.
 */
(Announcement as TAnnouncement).prototype.getBans = async function getBans() {
  return (await BanBlock.findAll({ where: { annId: this.id } })) as typeof BanBlock[]
}
