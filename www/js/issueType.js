angular.module('citizen-engagement.issueType', [])

  .factory('IssueTypeFactory', function($http, apiUrl) {

      return{


      getIssueTypes: function(callback) {
          $http({
              method: 'GET',
              url: apiUrl + '/issueTypes'
              
            }).success(function(issueTypes) {

             
             callback(null, issueTypes);

            }).error(function(err) {
              callback(err);             
              
            });
      },     

    };   

  })

  .controller('getIssueTypesCtrl', function(IssueTypeFactory, $scope){

    

      
      IssueTypeFactory.getIssueTypes(function(err,data){
        if(err){
          console.log('err');
          $scope.error = err;
        }else{
          console.log('yeah');
          $scope.issueTypes = data;
        };
        
      });

    

  })
  
;