var mongoose = require('mongoose');

var VoteSchema = new mongoose.Schema({
    title:String,
    upvotes: {type: Number, default: 0},
    
});

VoteSchema.methods.upvote = function(cb){
    this.upvotes += 1;
    this.save(cb);
}

mongoose.model('Vote',VoteSchema);