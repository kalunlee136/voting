//var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
var Poll = require('../models/Polls');
//var Vote = require('../models/Votes');



module.exports = function(app){
    /* GET home page. */
    app.get('/', function(req, res, next) {
      res.render('index');
    });
    
    //begin param post routes
    
    app.get('/polls', function(req, res, next) {
      Poll.find(function(err, polls){
        if(err){ return next(err); }
    
        res.json(polls);
      });
    });
    
    app.post('/polls',function(req, res, next) {
      var poll = new Poll(req.body);
      //poll.author = req.payload.username;
      
      poll.save(function(err, poll){
        if(err){ return next(err); }
    
        res.json(poll);
      });
    });
    
    app.param('id', function(req, res, next, id) {
      var query = Poll.findById(id);
    
      query.exec(function (err, poll){
        if (err) { return next(err); }
        if (!poll) { return next(new Error('can\'t find comment')); }
    
        req.poll = poll;
        return next();
      });
    });
    
    app.get('/polls/:id', function(req, res, next) {
       res.json(req.poll);
    });
    
    //end param post routes
    app.put('/polls/:id', function(req, res, next) {
      //req.poll.choices[req.body.index].upvote += 1;
      
      Poll.findById(req.params.id, function(err, p) {
        if (!p)
          return next(new Error('Could not load Document'));
        else {
          // do your updates here
         
          p.choices = req.body.choices;
          
          p.save(function(err){
            if(err) throw(err);
            
            res.json(p);
          });
        }
      });
      
    });
    
    //begin param comment routes
     app.param('comment', function(req, res, next, id) {
      var query = Comment.findById(id);
    
      query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next(new Error('can\'t find comment')); }
    
        req.comment = comment;
        return next();
      });
     });
     
     app.post('/posts/:post/comments', auth , function(req, res, next) {
      var comment = new Comment(req.body);
      comment.post = req.post;
      comment.author = req.payload.username;
    
      comment.save(function(err, comment){
        if(err){ return next(err); }
    
        req.post.comments.push(comment);
        req.post.save(function(err, post) {
          if(err){ return next(err); }
    
          res.json(comment);
        });
      });
     });
    
     app.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
        req.comment.upvote(function(err, comment){
        if (err) { return next(err); }
        
        res.json(comment);
      });
    });
    
    app.post('/register', function(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
      
      console.log(req.body);
      var user = new User();
    
      user.username = req.body.username;
    
      user.setPassword(req.body.password)
    
      user.save(function (err){
        if(err){ return next(err); }
    
        return res.json({token: user.generateJWT()})
      });
    });
    
    app.post('/login', function(req, res, next){
      if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
      }
    
      passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }
    
        if(user){
          return res.json({token: user.generateJWT()});
        } else {
          return res.status(401).json(info);
        }
      })(req, res, next);
    });
}

