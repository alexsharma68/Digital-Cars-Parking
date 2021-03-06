var mockups = angular.module('mockups', ['ngRoute','ngAnimate'])
        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) 
            {
                $routeProvider
                .when('/', {
                    templateUrl : 'load/home.html',
                    controller  : 'home',
                })
                .when('/list.html', {
                    templateUrl : 'load/list.html',
                    controller  : 'list',
                })
                .when('/enter.html', {
                    templateUrl : 'load/enter.html',
                    controller  : 'enter',
                })
                .when('/exit.html', {
                    templateUrl : 'load/exit.html',
                    controller  : 'exit',
                })
                .when('/waiting.html', {
                    resolve: {
                        responseData: function(Factory) {
                            return Factory.getWaitingList('waiting.json').then(function(res){ return res.data; });
                        },
                    },
                    templateUrl : 'load/waiting.html',
                    controller  : 'waiting',
                })
                $locationProvider.html5Mode({
                 enabled: true,
                 requireBase: false
                }); 
            }
        ]);
    mockups.controller('home', function($scope,$http,$location) {
        $scope.startScan = function () {
        	
            var mainInfo = $http.get('startScan.json').success(function(response) {
                // you have received user profile here;
                console.log(response);
                toView.data=response.user_profile; 
                // lets redirect to router
                $location.path(response.dynamic_router);
            });
        }
    });
    mockups.controller('enter', function($scope) {
        $scope.data=toView.data;
        tick(true);
    });
    mockups.controller('list', function($scope) {
        $scope.data=toView.data;
        tick(true);
    });
    mockups.controller('waiting', function($scope,responseData,Factory,$location) {
        $scope.waiting_list=responseData;
        $scope.data=responseData[0];
        $scope.clicked_user=false;
        tick(true);
        $scope.changeUserDetails=function(id){
            var found=$scope.waiting_list.filter(function(e) {return e.id == id;});
            $scope.data=found[0];
        }
        $scope.updateWaitingList=function(){
        	Factory.getWaitingList('waiting.json').then(function(res){ 
        		$scope.waiting_list=res.data;
        		setTimeout($scope.updateWaitingList,1000)
        	});
        }
        $scope.enter=function(){
        	var current_user_id=$scope.data.id;
        	Factory.setUserInPark(current_user_id).then(function(){
        		$location.path("/");
        	});
        	
        }
        $scope.updateWaitingList();
    });
    mockups.controller('exit', function($scope) {
        $scope.data=toView.data;
        tick(true);
    });

  

