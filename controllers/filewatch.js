const watch = require('node-watch');
 
const watcher = watch(process.env.WATCH_FILE, { });

 
watcher.on('error', function(err) {
  console.error("ERROR in filewatch: " + err)
});
 

module.exports = watcher