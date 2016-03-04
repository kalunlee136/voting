app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/home.html', controller: 'MainCtrl'}
        },
          resolve: {
          pollsPromise: ['polls', function(polls){
             polls.showAllPolls();
          }]
         }
      })
      
      .state('polls', {
        url: '/polls/:id',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/poll.html', controller: 'MainCtrl'}
        }
      })
      
      .state('r', {
        url: '/polls/:id/r',
        views:{
          'body':{templateUrl: 'partials/result.html', controller: 'MainCtrl'}
        }
      })
      
      .state('login', {
        url: '/login',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/login.html', controller: 'AuthCtrl'}
        },
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
      })
      
      .state('register', {
        url: '/register',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/register.html', controller: 'AuthCtrl'}
        },
        onEnter: ['$state', 'auth', function($state, auth){
          if(auth.isLoggedIn()){
            $state.go('home');
          }
        }]
      })
      
      .state('profile', {
        url: '/profile',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/profile.html', controller: 'UserCtrl'}
        },
        resolve:{
          pollsPromise:['polls',function(polls){
            polls.getAllUserPolls();
          }]
        }
      })
  
    $urlRouterProvider.otherwise('');
}]);

