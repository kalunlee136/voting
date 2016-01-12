var app = angular.module('flapperNews', ['ui.router']);

app.controller('MainCtrl', ['$scope','posts', 'auth', function($scope,posts,auth){
    $scope.posts = posts.posts;
      $scope.isLoggedIn = auth.isLoggedIn;
          
    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }
       posts.create({
          title: $scope.title,
          link: $scope.link,
        });
      $scope.title = '';
      $scope.link = '';
    };
    
    $scope.incrementUpvotes = function(post) {
      posts.upvote(post);
    };
    
}]);

app.controller('PostsCtrl', ['$scope','posts','post', 'auth', function($scope,posts,post,auth){
    
    $scope.post = post // this gets a single post,
                       // whereas posts gets the factory
    $scope.isLoggedIn = auth.isLoggedIn;
    
    $scope.addComment = function(){
      if($scope.body === '') { return; }
        posts.addComment(post._id, {
          body: $scope.body,
          author: 'user'
        })
        
        .success(function(comment) {
          $scope.post.comments.push(comment);
        })
        
        .error(function(err,data){
          console.log(err);
        });
        
        $scope.body = '';
    };
   
    $scope.incrementUpvotes = function(comment) {
      posts.upvoteComment(post, comment)
    };
    
}]);

app.controller('AuthCtrl', ['$scope','$state','auth', function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
  
}]);

app.controller('NavCtrl', ['$scope','auth',function($scope, auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

app.controller('UserCtrl',['$scope','posts', 'auth', function($scope,posts,post,auth){
  
}]);

app.factory('posts', ['$http', 'auth', function($http, auth){
  var factory = {
     posts:[
      {title: 'post 1', upvotes: 5}
    ]
  };
  
  factory.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, factory.posts);
    })
    .error(function(err,data){console.log(err)});
  };
  
  factory.create = function(post) {
    return $http.post('/posts', post, {headers: {Authorization: 'Bearer '+auth.getToken()}}).success(function(data){
      factory.posts.push(data);
    })
    .error(function(err,data){console.log(err)});
  };
  
  factory.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote',null,{headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        post.upvotes += 1;
      });
  };
  
  factory.get = function(id) {
    return $http.get('/posts/' + id).then(function(res){
      return res.data;
    });
  };
  
  factory.addComment = function(id, comment) {
    return $http.post('/posts/' + id + '/comments', comment, {headers: {Authorization: 'Bearer '+auth.getToken()}});
  };
  
  factory.upvoteComment = function(post, comment) {
    return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote',null, {headers: {Authorization: 'Bearer '+auth.getToken()}})
      .success(function(data){
        comment.upvotes += 1;
      });
  };

  return factory;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
   var auth = {};
   
   auth.saveToken = function (token){
     $window.localStorage['flapper-news-token'] = token;
   };
  
   auth.getToken = function (){
     return $window.localStorage['flapper-news-token'];
   }
   
   auth.isLoggedIn = function(){
     var token = auth.getToken();
     
     if(token){
       var payload = JSON.parse($window.atob(token.split('.')[1]));
       return payload.exp > Date.now() / 1000;
     } else {
       return false;
     }
   };
   
   auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
    
        return payload.username;
      }
    };
   
   auth.register = function(user){
      return $http.post('/register', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
   
   auth.logIn = function(user){
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token);
      });
    };
   
   auth.logOut = function(){
      $window.localStorage.removeItem('flapper-news-token');
    };

   return auth;
}])