const chokidar = require('chokidar');
 
const watcher = chokidar.watch(process.env.WATCH_FILE, { 
  usePolling: true,
  interval: 100
});

 
watcher.on('error', function(err) {
  console.error("ERROR in filewatch: " + err)
});
 

module.exports = watcher