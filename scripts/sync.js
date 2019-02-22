const { sync } = require('../build/models');


(async function() {
  try {
    await sync()
  } catch(err) {
    process.exit(1)
  }
  process.exit(0)
})()