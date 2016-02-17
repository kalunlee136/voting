var app = angular.module('votingApp', ['ui.router']);

app.controller('MainCtrl', ['$scope','$http','$state','$stateParams', function($scope,$http,$state,$stateParams){

  $scope.choices = [{loc: 0,upvote:0}, {loc: 1,upvote:0}, {loc: 2,upvote:0}];
  
  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length;
    $scope.choices.push({'loc':newItemNo,'upvote':0});
    console.log($scope.choices);
  };
  
  $scope.showAddChoice = function(choice) {
    return choice.loc === $scope.choices[$scope.choices.length-1].loc;
  };
  
  $scope.createPoll = function(){
    $http.post('/polls',{'title':$scope.title,'choices':$scope.choices})
      .success(function(data){
          window.location.href='https://blooming-taiga-52204.herokuapp.com/#/polls/'+data._id;
      })
      .error(function(err){
        console.log(err);
      })
  }
  
  $scope.init = function(){
    if(localStorage[$stateParams.id]){
      window.location.href='https://blooming-taiga-52204.herokuapp.com/#/polls/'+$stateParams.id+'/r'
    }
    
    return $http.get('/polls/' + $stateParams.id).then(function(res){
      $scope.title1 = res.data.title;
      $scope.choices1 = res.data.choices;
      $scope.total = 0;
      $scope.linke = 'https://blooming-taiga-52204.herokuapp.com/#/polls/'+$stateParams.id;
      $scope.choices1.forEach(function(item){
        $scope.total += item.upvote;
      })
      console.log($scope.total)
    });
    
    
  }
  
  $scope.submitVote = function(){
    $scope.choiceIndex = $("input[type='radio']:checked").val();
    $scope.choices1[$scope.choiceIndex].upvote +=1;
    return $http.put('/polls/'+$stateParams.id,{'choices':$scope.choices1})
      .success(function(res){
        console.log(res);
        localStorage.setItem($stateParams.id,true);
        window.location.href='https://blooming-taiga-52204.herokuapp.com/#/polls/'+$stateParams.id+'/r'
      })
      .error(function(err){
        console.log(err);
      })
    
  }
  
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
}]);