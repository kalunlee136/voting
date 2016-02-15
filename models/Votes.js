var mongoose = require('mongoose');

//currently not used for anything
var VoteSchema = new mongoose.Schema({
    title:String,
    y: {type: Number, default: 0},
    
});

VoteSchema.methods.upvote = function(cb){
    this.y += 1;
    this.save(cb);
}

mongoose.model('Vote',VoteSchema);