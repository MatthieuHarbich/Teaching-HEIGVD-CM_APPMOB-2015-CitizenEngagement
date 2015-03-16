angular.module('citizen-engagement.lastIssues', [])

  .factory('LastIssuesFactory', function($http, apiUrl) {

      return{


      getLastIssues: function(callback) {
          $http({
              method: 'GET',
              url: apiUrl + '/issues'
            }).success(function(issues) {

             
             callback(null, issues);

            }).error(function(err) {
              callback(err);
              
              
            });
      },

      

    };

    

  })

  .controller('lastIssuesCtrl', function(apiUrl, LastIssuesFactory, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      

     LastIssuesFactory.getIssues(function(err, data){

          $scope.issues = data;
      });
      // $scope.issues = ListIssuesFactory.getIssues(function(err, issues) {
      //   if (err) {
      //     $scope.error = err;
      //   } else {
      //     $scope.issues = issues;
      //   }
      // });
    });

    

   
  })
;