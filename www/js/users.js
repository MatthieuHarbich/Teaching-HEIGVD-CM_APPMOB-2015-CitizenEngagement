angular.module('citizen-engagement.users', [])

	.factory('UserFactory', function($http, $stateParams, apiUrl){
		return{
			getUsers: function(callback){
				$http({
					method: 'GET',
					url: apiUrl + '/users'
				}).success(function(users){
					callback(null, users);
				}).error(function(err){
					callback(err);
				});
			},

			getUserById: function(id, callback){
				$http({
					method: 'GET',
					url: apiUrl + '/users/' + id

				}).success(function(user){
					callback(null, user);
				}).error(function(err){
					callback(err);
				});
			}
		};
	})

	.controller('listUsersCtrl', function(apiUrl, UserFactory, $scope){

		UserFactory.getUsers(function(err, data){
			if(err){
				$scope.error = err;
			}else{
				$scope.users = data;
			}
		});

		
	})

	.controller('getUserByIdCtrl', function(AuthService, apiUrl, UserFactory, $scope, $stateParams){
		
		// The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {

      UserFactory.getUserById( AuthService.currentUserId, function(err, data, header){
      	var userId = AuthService.currentUserId;
      	console.log("User id : " + userId);

			if(err){
				console.log(err);
				$scope.error = err;
			}else{
				$scope.user = data;
				console.log($scope.user.roles.indexOf('staff') > -1);
			};

			$scope.isStaff = function() {

	      	return ($scope.user.roles.indexOf('staff') > -1);
	      };
			
		});

      
      
    });

		

	})



