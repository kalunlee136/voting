var app = angular.module('votingApp', ['ui.router']);

var doughnutOptions = {
      	//Boolean - Whether we should show a stroke on each segment
      	segmentShowStroke : true,
      	
      	//String - The colour of each segment stroke
      	segmentStrokeColor : "#fff",
      	
      	//Number - The width of each segment stroke
      	segmentStrokeWidth : 2,
      	
      	//The percentage of the chart that we cut out of the middle.
      	percentageInnerCutout : 50,
      	
      	//Boolean - Whether we should animate the chart	
      	animation : true,
      	
      	//Number - Amount of animation steps
      	animationSteps : 100,
      	
      	//String - Animation easing effect
      	animationEasing : "easeOutBounce",
      	
      	//Boolean - Whether we animate the rotation of the Doughnut
      	animateRotate : true,
      
      	//Boolean - Whether we animate scaling the Doughnut from the centre
      	animateScale : true,
      	
      	//Function - Will fire on animation completion.
      	onAnimationComplete : null,
      	
      	legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
}

app.controller('MainCtrl', ['$scope','$http','$state','$stateParams','polls', 'auth', function($scope,$http,$state,$stateParams,polls,auth){
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.choices = [{loc: 0,upvote:0}, {loc: 1,upvote:0}, {loc: 2,upvote:0}];
  $scope.allPolls = polls.allPolls;
  
  $scope.addNewChoice = function() {
    var newItemNo = $scope.choices.length;
    $scope.choices.push({'loc':newItemNo,'upvote':0});
    console.log($scope.choices);
  };
  
  $scope.showAddChoice = function(choice) {
    return choice.loc === $scope.choices[$scope.choices.length-1].loc;
  };
  
  $scope.createPoll = function(){
    var obj = {'title':$scope.title,'choices':$scope.choices};
    $http.post('/polls',obj , {headers: {Authorization: 'Bearer '+auth.getToken()}} )
      .success(function(data){
        var url = $state.href('polls');
        window.location.href= url + data._id;
          
      })
      .error(function(err){
        console.log(err);
      })
  }
  
  $scope.init = function(){
    if(localStorage[$stateParams.id]){
      var url = $state.href('r', {id:$stateParams.id});
      console.log('url', url , $stateParams.id);
      window.location.href= url;

    }
    return $http.get('/polls/' + $stateParams.id).then(function(res){
      var doughnutData = []; // Doughnut Chart Data
      $scope.title1 = res.data.title;
      $scope.choices1 = res.data.choices;
      $scope.total = 0;
      
      //var url = $state.href('polls', {} , {absolute: true});
      $scope.choices1.forEach(function(item){
        var randomColor = getRandomColor();
        doughnutData.push({ value: item.upvote, label: item.name, color: randomColor})
        $scope.total += item.upvote;
      })

      //Get the context of the Doughnut Chart canvas element we want to select
      var ctx = document.getElementById("doughnutChart").getContext("2d");
      
      // Create the Doughnut Chart
      var mydoughnutChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);
      document.getElementById('js-legend').innerHTML = mydoughnutChart.generateLegend();
      
    }); 
    
  }
  
  $scope.submitVote = function(){
    $scope.choiceIndex = $("input[type='radio']:checked").val();
    $scope.choices1[$scope.choiceIndex].upvote +=1;
    
    return $http.put('/polls/'+$stateParams.id,{'choices':$scope.choices1})
      .success(function(res){
        console.log(res);
        localStorage.setItem($stateParams.id,true);
        var url = $state.href('polls');
        window.location.href= url + '/r'
      })
      .error(function(err){
        console.log(err);
      })
    
  }
  
}]);

app.controller('UserCtrl', ['$scope','$http','polls','auth', function($scope,$http,polls,auth){
    $scope.userPolls = polls.userPolls;
    
    $scope.deletePoll = function(id,index){
      polls.deletePoll(id,index);
    }
}]);

app.factory('polls', ['$http', 'auth', function($http, auth){
  var factory = {};
  factory.allPolls = [];
  factory.userPolls = [];
  
  factory.showAllPolls = function () {
    $http.get('/polls').then(function (data) {
      angular.copy(data.data,factory.allPolls);
      console.log('getAllUserPolls', data);
    });
  }
  
  factory.getAllUserPolls = function(){
    $http.get('/users/polls',{headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(data){
      angular.copy(data.data,factory.userPolls);
      console.log('getAllUserPolls', data)
    })
  }
  
  factory.deletePoll = function(id, index){
    $http.delete('/polls/'+id, {headers: {Authorization: 'Bearer '+auth.getToken()}}).then(function(data){
      factory.userPolls.slice(index,1);
    });
  }
  return factory;
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
     $window.localStorage['vote-app-token'] = token;
   };
  
   auth.getToken = function (){
     return $window.localStorage['vote-app-token'];
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
      $window.localStorage.removeItem('vote-app-token');
    };

   return auth;
}]);

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}