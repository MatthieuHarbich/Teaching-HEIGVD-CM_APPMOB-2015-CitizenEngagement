angular.module('citizen-engagement.listIssues', [])

  .factory('ListIssuesFactory', function($http, apiUrl) {

      return{


      getIssues: function(callback) {
          $http({
              method: 'GET',
              url: apiUrl + '/issues',
              headers: {
                'x-sort': 'updatedOn',
                'x-pagination':'0;*'
              }
            }).success(function(issues) {

             
             callback(null, issues);

            }).error(function(err) {
              callback(err);
              
              
            });
      },

      

    };

    

  })

  .controller("MapController", function(ListIssuesFactory,mapboxMapId, mapboxAccessToken, $scope) {
  console.log('map');
  // var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
  // mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
  $scope.mapDefaults = {
    tileLayer: mapboxTileLayer
   };
   $scope.mapCenter = {
     lat: 46.7833,
     lng: 6.65,
     zoom: 14
   };
   $scope.mapMarkers = [];

   $scope.$on('$ionicView.beforeEnter', function() {
      

     ListIssuesFactory.getIssues(function(err, data){
        if(err){
          $scope.error = err;
        }else{
          $scope.issues = data;
        };

        
        var issues = $scope.issues;
        $scope.mapMarkers = [];

        angular.forEach(issues, function(value, key){
          $scope.mapMarkers.push({
            lat: value.lat,
            lng: value.lng
          })
        });


        // var values = {name: 'misko', gender: 'male'};
        //   var log = [];
        //   angular.forEach(values, function(value, key) {
        //     this.push(key + ': ' + value);
        //   }, log);
        //  expect(log).toEqual(['name: misko', 'gender: male']);
          
  });
//    var issue = ListIssuesFactory.getIssues();
//     $scope.mapMarkers.push({
//       lat: issue.lat,
//       lng: issue.lng,
//        message: "yeah",
//      getMessageScope: function() {
//        var scope = $scope.$new();
//        scope.issue = issue;
//      return scope;
//     }
// }); 

})
 })

  .controller('listIssuesCtrl', function(apiUrl, ListIssuesFactory, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      

     ListIssuesFactory.getIssues(function(err, data){
        if(err){
          $scope.error = err;
        }else{
          $scope.issues = data;
        };
          
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

  .controller('lastIssuesCtrl', function(apiUrl, ListIssuesFactory, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      

     ListIssuesFactory.getIssues(function(err, data){

          $scope.issues = data;
      });
   
    });

    $scope.toggleIssue = function(issue) {
      if ($scope.isIssueShown(issue)) {
        $scope.shownIssue = null;
      } else {
        $scope.shownIssue = issue;
      }
    };

  $scope.isIssueShown = function(issue) {
    return $scope.shownIssue === issue;
  };

   
  })
;