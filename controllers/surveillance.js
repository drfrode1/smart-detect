const filewatch = require('./filewatch');
const googlevision = require('./googlevision');
const fs_sync = require('fs-sync');
const fs = require('fs');
const moment = require('moment');
const FBMessenger = require('fb-messenger')
const messenger = new FBMessenger({token: process.env.FB_TOKEN})

var Event = require('../models/event');
const destFile = process.env.DEST_FILE;
const srcFile = process.env.WATCH_FILE;



filewatch.on('change', function(evt, name) {
    console.log('Changed: %s', name);

    getVisionRequest(function(docCnt) {
        if (docCnt < process.env.MAX_API_DAY) {

            var file_modified = fs.statSync(srcFile).mtime
            
            var copy_res = fs_sync.copy(srcFile, destFile);
            //var copy_res = true;  // DEBUG
    
            console.log('Copy status: %s', copy_res);
    
            if (copy_res) {
                var gv = googlevision.labelDetection(destFile);
    
                gv.on('done', function(data) {
                    console.log('Got reply from google: ');
                    
                    var newEvent = new Event({
                        camera: "DLINK932",
                        fileTime: file_modified,
                        breach: false,
                        labels: data
                    });
    
                    var bitmap = fs.readFileSync(destFile);
                    newEvent.file.data = bitmap;
                    newEvent.file.contentType = 'image/jpg';
    
                    console.log(bitmap);
    
                    newEvent.save(function(err){
                        if (err) throw err;
    
                        console.log("Save mongo");
                        messenger.sendTextMessage({id: '814945133', text: 'Hello'})
                        fs_sync.remove(destFile);

                    })
                });
            } else {
                console.log("Copy failed");
            }   
        } else {
            console.log("API count exceeded");
        }      
    });
});
    

function getVisionRequest(fn) {
    let startDay = moment().startOf('day');
    let endDay = moment().endOf('day');

    Event.find({createdAt: {$gte: startDay, $lt: endDay}}, function (err, docs){
        if (err) throw err

        console.log("documents found: "+ docs.length);
        fn(docs.length);
    })    
} 