app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('poll', {
        url: '',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/home.html', controller: 'MainCtrl'}
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
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/result.html', controller: 'MainCtrl'}
        }
      })
  
    $urlRouterProvider.otherwise('');
}]);

