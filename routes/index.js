var express = require('express');
var router = express.Router();
const Events = require('../models/event');

const FBMessenger = require('fb-messenger')
const messenger = new FBMessenger({token: process.env.FB_TOKEN})

/* GET home page. */
router.get('/', (req, res) => {
  Events.find().sort({createdAt: -1})
  .then((events) => {  
    
    events.forEach(function(part, index, theArray) {
      theArray[index].file.data = new Buffer(part.file.data).toString('base64');
      
      theArray[index].labels.map(obj => {
        obj.score = (Number.parseFloat(obj.score).toPrecision(3));
        return obj;
      });

    });
    try {
      messenger.sendTextMessage({id: '10160714023370134', text: 'Hello'});
      
    } catch (e) {
      console.error(e);
    }

    res.render('index', { title: 'Video survey', events});

  })

  .catch(() => {res.send('Something went wrong!'); });

});

module.exports = router;
