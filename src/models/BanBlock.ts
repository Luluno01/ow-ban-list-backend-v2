/// <reference path="../global.d.ts" />
import * as Sequelize from 'sequelize'
import sequelize from './db'
import { TAnnouncement } from './Announcement'
import { fetchBanBlocks as _fetchBanBlocks } from '../../ow-ban-list/build/helpers'
import hash from '../helpers/hash'
import escapeLike from '../helpers/escapeLike'


const BanBlock = sequelize.define('banBlock', {
  header: Sequelize.STRING,
  battleTags: Sequelize.ARRAY(Sequelize.STRING(32)),
  hash: {  // To identify a block
    type: Sequelize.STRING(32),
    unique: true
  }
})

export default BanBlock as TBanBlock

type TBanBlock = typeof BanBlock & {
  id: number
  header: string
  battleTags: string
  hash: string
  annId: number
  createdAt: Date
  updatedAt: Date
  fetch(ann: TAnnouncement): Promise<TBanBlock[]>
  toJSON(): object
  search(keyWords: string[]): Promise<any>
}

export async function sync() {
  // await BanBlock.sync({ force: true })  // Re-create table
}

/**
 * @description Fetch ban blocks for `ann` from web page.
 */
(BanBlock as TBanBlock).fetch = async function fetch(ann: TAnnouncement) {
  let [ blocks, annDate ] = await _fetchBanBlocks(ann)
  return await sequelize.transaction()
  .then(async t => {
    let createdBlocks: TBanBlock[] = []
    await Promise.all(blocks.map(async block => {
      try {
        createdBlocks.push(await BanBlock.create({
          ...block,
          hash: hash(JSON.stringify(block.battleTags)),
          annId: ann.id
        } as any, { transaction: t }) as TBanBlock)
      } catch(err) {
        // pass
      }
    }).concat([ (async () => {
      // Update the announcement release date
      await ann.update({ date: annDate }, { where: { id: ann.id }, transaction: t })
    })() ]))
    await t.commit()
    return createdBlocks
  })
};


const SQL_BASE = 'SELECT distinct x."id", x."annId" FROM (SELECT "public"."banBlocks"."id", "public"."banBlocks"."annId", unnest("public"."banBlocks"."battleTags") tag FROM "public"."banBlocks") x WHERE '
const CONDITION = 'lower(tag) LIKE ';
(BanBlock as TBanBlock).search = async function search(keyWords: string[]) {
  let conditions = keyWords.map(keyWord => CONDITION + "'%" + escapeLike(keyWord.toLowerCase()) + "%' ESCAPE '\\'")
  return await sequelize.query(SQL_BASE + conditions.join(` OR `) + ';', { type: sequelize.QueryTypes.SELECT })
}