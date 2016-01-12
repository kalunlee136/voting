app.config(['$stateProvider','$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/home.html', controller: 'MainCtrl'}
        },
         resolve: {
          postPromise: ['posts', function(posts){
            return posts.getAll();
          }]
         }
      })
    
      .state('posts', {
        url: '/posts/:id',
        views:{
          'header':{templateUrl:'/partials/header.html'},
          'body':{templateUrl: 'partials/posts.html', controller: 'PostsCtrl'}
        },
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
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
      
      .state('profile',{
        url:'/profile',
        views:{
          'body':{templateUrl:'partials/profile.html',controller:'UserCtrl'}
        }
      })
      
    $urlRouterProvider.otherwise('');
}]);

