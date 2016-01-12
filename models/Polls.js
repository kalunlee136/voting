var mongoose = require('mongoose');

var PollSchema = new mongoose.Schema({
    title:String,
    choices:[]
});

module.exports = mongoose.model('Poll',PollSchema);