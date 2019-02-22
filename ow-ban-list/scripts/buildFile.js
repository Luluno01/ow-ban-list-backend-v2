const { build } = require('../build/fetch')
const { resolve } = require('path')
const { BAN_INDEX } = require('../build/config')

let path = process.argv[2] || './announcements.json'
if(!path.endsWith('.json')) path += '.json'
let maxConcurrency = parseInt(process.argv[3]) || 50
console.log(`Fetching announcement from ${BAN_INDEX}...`)
console.time('build')
build(path, maxConcurrency)
.then(() => {
  console.timeLog('build', 'Build successed')
  console.log(`File exported to ${resolve(path)}`)
})
.catch(err => {
  console.error(`Build failed`)
  throw err
})