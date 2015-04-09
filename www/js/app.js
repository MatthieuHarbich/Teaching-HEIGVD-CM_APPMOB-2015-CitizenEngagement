// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('citizen-engagement', ['ionic', "geolocation",'citizen-engagement.auth', 'citizen-engagement.constants', 'citizen-engagement.issue', 'citizen-engagement.users', "leaflet-directive", "citizen-engagement.map","citizen-engagement.issueType"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.run(function(AuthService, $rootScope, $state) {

  
  $rootScope.$on('$stateChangeStart', function(event, toState) {

    
    if (!AuthService.currentUserId && toState.name != 'login') {

      
      $state.go('login');
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {




$ionicConfigProvider.tabs.position('bottom'); 


  $stateProvider


    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'getUserByIdCtrl'
      
    })
    
    

    .state('app.lastIssues', {

      url: '/lastIssues',
      views: {
        
        'app-map': {
  
          templateUrl: 'templates/lastIssues.html',
          controller:'lastIssuesCtrl'
          
        }
      }
    })

    .state('app.issueDetails', {

      url: '/issueDetail/:id',
      views: {
        
        'app-map': {
  
          templateUrl: 'templates/issueDetail.html',
          controller:'issueDetailCtrl'
          
        }
      }
    })

    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      templateUrl: 'templates/login.html'
    })

    .state('app.map', {
      url: '/map',
      views: {
        'app-map': {
          templateUrl: 'templates/map.html',
          controller: 'MapController'
        }
      }
    })

    .state('app.addIssue', {
      url: '/addIssue',
      views: {
        'app-map': {
          templateUrl: 'templates/addIssue.html',
          controller: 'MapControlleri'
        }
      }
    })

    .state('app.users', {

      url: '/users',
      views: {
        
        'app-map': {
  
          templateUrl: 'templates/users.html',
          controller:'listUsersCtrl'
          
        }
      }
    })
  ;

  
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('app.map'); 
  });


});


