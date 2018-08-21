const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    camera: {
        type: String, 
        trim: true, 
        required: false
    },
    file: {data: Buffer, contentType: String},
    fileTime: Date,
    breach: Boolean,
    labels: [
        { 
            description: {
                type: String, 
                trim: true,
                required: true,
                max: 50
            }, 
            score: {
                type: Number,
                required: true
            }
        }
    ]    
});

EventSchema.plugin(timestamps);

module.exports =  mongoose.model('Event', EventSchema);