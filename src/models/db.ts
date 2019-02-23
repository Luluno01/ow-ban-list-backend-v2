import * as Sequelize from 'sequelize'
const config = require('../../sequelize.config.js')


export const sequelize = new Sequelize(process.env.DB_URL, config)

export default sequelize