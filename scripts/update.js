const { models } = require('../build/models');


(async function() {
  try {
    let anns = await models.Announcement.default.updateIndexAndFetch()
    if(anns) {
      if(anns.length) console.log(`Announcements updated (${anns.map(ann => ann.id).join(', ')})`)
      else console.log('No new announcements')
    }
  } catch(err) {
    process.exit(1)
  }
  process.exit(0)
})()