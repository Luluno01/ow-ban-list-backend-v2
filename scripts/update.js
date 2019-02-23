const { models } = require('../build/models');


(async function() {
  try {
    let anns = await models.Announcement.default.updateIndexAndFetch()
  } catch(err) {
    process.exit(1)
  }
  process.exit(0)
})()