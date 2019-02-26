import * as LastUpdate from './LastUpdate'
import * as BanBlock from './BanBlock'
import * as Announcement from './Announcement'
import _sequelize from './db'
import Store from '../helpers/Store'
const { cache } = require('../../config.json')


export const models = {
  LastUpdate,
  BanBlock,
  Announcement
}

export default models

const createTables = [
  LastUpdate,
  Announcement,
  BanBlock
]

export async function sync() {
  if(cache) await (await (new Store).init()).flushdb()
  for(let model of createTables) {
    await model.default.sync({ force: true })
  }
  for(let modelName in models) {
    try {
      await models[modelName].sync()
      console.log(`Model ${modelName} synchronized`)
    } catch(err) {
      console.error(`Model ${modelName} failed to synchronize: ${err.stack}`)
      throw err
    }
  }
  sequelize.close()
}

export const sequelize = _sequelize