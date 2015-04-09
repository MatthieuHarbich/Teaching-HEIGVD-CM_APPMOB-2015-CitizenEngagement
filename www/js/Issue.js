angular.module('citizen-engagement.issue', [])
  
  .factory('mySharedFilter', function($rootScope){
    var sharedFilter = {};

    sharedFilter.filterText = '';

    sharedFilter.prepareToBroadcast = function(filterText){
      
      this.filterText = filterText;
      this.broadcastItem();
    };

    sharedFilter.broadcastItem = function(){
      

      $rootScope.$broadcast('filterBroadcast');
    };

    return sharedFilter;
  })

  .factory('IssueFactory', function($http, apiUrl) {

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

      getIssueById: function(id, callback){
        $http({
          method: 'GET',
          url: apiUrl + '/issues/' + id
        }).success(function(issue){
          callback(null, issue);
        }).error(function(err){
          callback(err);
        });
      },

      getPhotoByUrl: function(url, callback){
        $http({
          method: 'GET',
          url: url,
        }).success(function(photo){
          callback(null, photo);
        }).error(function(err){
          callback(err);
        });
      },

      postComment : function(id, data, callback){
        $http({
          method:'POST',
          url: apiUrl + '/issues/' + id + '/actions',
          data: data
        }).success(function(comment){
          callback(null,comment);
        }).error(function(err){
          callback(err);
        })
      },

      postIssue: function(data, callback){
        $http({
          method: 'POST',
          url: apiUrl + '/issues',
          data: data

        }).success(function(newIssue){
          console.log(newIssue);

          callback(null, newIssue);
        }).error(function(err){
          console.log(err);
          callback(err);
        });
      },

      postPhoto: function(imageData, callback){
        
         $http({
              method: "POST",
              url: "https://warm-bastion-3094.herokuapp.com/api/images",
              headers: {
                Authorization: "Bearer " + "Py7n9/utjzJmYotOoOPnPgmd+x+C8YP9AifhsquC8sVGDNiSEmskPNows5WXKEl6P5W9gBlROZIZl0+kj1iDAMyGnM+w4l75BRWij7rNLJIcHRA8QB2CUUpl5lMtbsOoTJobWO+P/J7oLyt/YGMHMLOqh70ylcr+eYQXYSanjrk=",
                "Content-Type": "application/json"
              },
                data: {
                data: imageData
              }
            }).success(function(data) {

             
              callback(null, data.url);
              
            }).error(function(data){
                

                //attention au callback
            });
      }

      

    };

    

  })

  .factory('CameraService', function($q){
    return{
      getPicture: function(options){
        var deferred = $q.defer();

        navigator.camera.getPicture(function(result){
          
          deferred.resolve(result);
        }, function(err){
         
          deferred.reject(err);
        }, options);

        return deferred.promise;
      }
    }
  })

  .controller("MapController", function($filter, mySharedFilter,IssueFactory,mapboxMapId, geolocation, CameraService, mapboxAccessToken, $scope, $state, $timeout, $rootScope) {
       
      $scope.$on('$ionicView.beforeEnter', function(){
        $timeout(function(){
          $scope.$broadcast('invalidateSize');
        })
      })
       $scope.mapCenter = {};
       $scope.mapCenter.lat = {}; 
       $scope.mapCenter.lng = {}; 
      
      
            geolocation.getLocation().then(function(data) {
          $scope.mapCenter.lat = data.coords.latitude;
          $scope.mapCenter.lng = data.coords.longitude;
           
          
          console.log($scope.mapCenter);

          $scope.centerMap();


        }, function(error) {
           $log.error("Could not get location: " + error);
        });
    
          
      

      
      
      



        $scope.filterText = '';


        $scope.$on('filterBroadcast', function(){
           
            $scope.filterText = mySharedFilter.filterText;
            console.log($scope.listMarkersFiltered);
            $scope.listMarkersFiltered = $filter('filter')($scope.listMarkers,  {author: $scope.filterText});
        });

        $scope.mapCenter = {}
       
      
      $scope.takePicture = function(){
      if (navigator.camera) {
                   CameraService.getPicture({
                    quality: 75,
                    targetWidth: 400,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.DATA_URL
                    }).then(function(imageData) {
                        
                       
              });
                  }
   };

  
  // var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
  // mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
  var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
  mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
  $scope.listCenter = {
       lat: 46.7833,
       lng: 6.65,
       zoom: 13
   };
  $scope.addCenter = {
      lat: 46.7833,
       lng: 6.65,
       zoom: 13
  };
  $scope.listDefaults = {
    tileLayer: mapboxTileLayer
   };

   $scope.centerMap = function(){

    var lng = $scope.mapCenter.lng;
    var lat = $scope.mapCenter.lat;
    $scope.listCenter = {
       lat: lat,
       lng: lng,
       zoom: 16
     };
      $scope.addMarker = [];
     
     $scope.listMarkers.push({
        lat: $scope.mapCenter.lat,
       lng: $scope.mapCenter.lng,
       icon: {
            iconUrl: 'img/center.png',
             iconSize:     [15, 15] // size of the icon
            
        }
     })

      $scope.addCenter = {
         lat: $scope.mapCenter.lat,
         lng: $scope.mapCenter.lng,
         zoom: 18
       };
       
       var issues = $scope.issues;
        $scope.addMarker.push({
          lat: lat,
          lng:lng,
          draggable: true,
          focus:true,
          message: "Hey, drag me if you want"
        })

     console.log($scope.listCenter);
     console.log('in centerMap')
   }
     
   $scope.listMarkers = [];

   $scope.$on('$ionicView.beforeEnter', function() {
      

     IssueFactory.getIssues(function(err, data){
        if(err){
          $scope.error = err;
        }else{
          $scope.issues = data;
        };

        
        var issues = $scope.issues;
        $scope.mapMarkers = [];

        angular.forEach(issues, function(issue, key){
          
          $scope.listMarkers.push({
            lat: issue.lat,
            lng: issue.lng,
            author: issue.owner.name,
            // issueType: issue.issueType.name,
            description: issue.description,
            message: "<h4> {{ issue.owner.name }} </h4><p> {{ issue.description }} </p><img ng-click='openDetail()' src='{{ issue.imageUrl }}' width='200px' />",
            getMessageScope: function() {
              var scope = $scope.$new();
              scope.issue = issue;
              return scope;
            }

          });      


        });

        $scope.openDetail = function(){
          console.log(this.issue.id);
          $state.go('app.issueDetails', { id: this.issue.id })
        }

        $scope.listMarkersFiltered = $scope.listMarkers;


          
  });


})

   $scope.addDefaults = {
    tileLayer: mapboxTileLayer
   };
  

   // $scope.addMarker = [];

   $scope.$on('$ionicView.beforeEnter', function() {
      
    

     


})

   

 })

  .controller('listIssuesCtrl', function(apiUrl,IssueFactory, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      

     IssueFactory.getIssues(function(err, data){
        if(err){
          $scope.error = err;
        }else{
          $scope.issues = data;
        };
          
      });


      
    });

    $scope.showIssueDetail = function(issue){
      console.log(issue.owner.name)
    }

    

   
  })

  .controller('issueDetailCtrl', function(apiUrl,IssueFactory, $http,$stateParams, $ionicHistory, $ionicLoading, $scope, $state) {

    var issueId = $stateParams.id;

    IssueFactory.getIssueById(issueId, function(err, issue){
      console.log(issue);
      $scope.issueById = issue;
      // var comments = $scope.issueById.comments;
      // console.log(comments);
    });



    $scope.addComment = function(comment){
        $scope.newComment = {
              "type": "comment",
              "payload": {
                "text": comment
              }
            };

            console.log($scope.commentText);

          IssueFactory.postComment(issueId, $scope.newComment, function(err, issue){
            $scope.newComment = '';
            $scope.issueById.comments = issue.comments;

          })
    }

    

   
  })

  .controller('lastIssuesCtrl', function(apiUrl, IssueFactory, $http, $ionicHistory, $ionicLoading, $scope, $state) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      

     IssueFactory.getIssues(function(err, data){
          console.log('issues');
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

  .controller('filterCtrl', function(apiUrl, mySharedFilter, CameraService, IssueFactory, $http, $scope, $rootScope){
      
        $scope.handleKeyUp = function(filterText){
          console.log(filterText);
          mySharedFilter.prepareToBroadcast(filterText);
        }

       $rootScope.$broadcast('filterEvent')
  })

  .controller('MapControlleri', function(apiUrl,  CameraService, IssueFactory, $http, $scope, $log){
    $scope.$on('$ionicView.beforeEnter', function(){
            $scope.newIssue = {};

          if (navigator.camera) {
                   CameraService.getPicture({
                    quality: 75,
                    targetWidth: 400,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.DATA_URL
                    }).then(function(imageData) {
                        

                        IssueFactory.postPhoto(imageData, function(err, imageUrl){
                          $scope.newIssue.imageUrl = imageUrl;
                        })
                        
               });

          } 

    });
  })



  .controller('addIssueCtrl', function(apiUrl,  CameraService, IssueFactory, $http, $scope, $log, $state){
  
    
   
    

    
    


      
    $scope.addIssue = function(){
      
        console.log('addIssue');
        
           
          
          $scope.newIssue.lat = $scope.addMarker[0].lat;
          $scope.newIssue.lng = $scope.addMarker[0].lng;
          console.log($scope.newIssue.imageUrl);
          
        

       
      IssueFactory.postIssue($scope.newIssue, function(err, data){
         if(err){
        console.log(err);
        $scope.error = err;
        }else{
        
         $scope.issues = data;
         $state.go('app.map');
        };
      });
      
    };

   
  })

  .controller('addComment', function(IssueFactory, $http, $scope, apiUrl){

  })

  .controller('takePictureCtrl', function(IssueFactory, CameraService){
    
    

  })
;