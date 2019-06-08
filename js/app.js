var app = angular.module("app", ["ngRoute", "ngAnimate"]);
//checks if user is authenticated .. redirects user to signin else

//Configuration and Routing
app.config([
  "$routeProvider",
  "$locationProvider",
  function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix("");
    $routeProvider
      .when("/home", {
        templateUrl: "partials/home.html",
        controller: "homeController"
      })
      .when("/signin", {
        templateUrl: "partials/user/signin.html",
        controller: "signinController"
      })
      .when("/subscribe", {
        templateUrl: "partials/user/subscribe.html",
        controller: "subscribeController",
        resolve: {
          function($rootScope, $http, $location) {
            $http
              .get("backend/includes/authstatus.php")
              .then(function(response) {
                if (response.data === "disconnected") {
                  $location.path("/signin");
                }
                $rootScope.userdata = "Creator";
              });
          }
        }
      })
      .when("/service", {
        templateUrl: "partials/user/service.html",
        controller: "serviceController",
        resolve: {
          function($rootScope, $http, $location) {
            $http
              .get("backend/includes/authstatus.php")
              .then(function(response) {
                if (response.data === "disconnected") {
                  $location.path("/signin");
                }
                $rootScope.userdata = "Creator";
              });
          }
        }
      })
      .when("/wb-signin", {
        templateUrl: "partials/admin/signin.html"
      })
      .when("/wb-admin", {
        templateUrl: "partials/admin/dashboard.html",
        controller: ""
      })
      .otherwise({ redirectTo: "/home" });
  }
]);

//home controller
app.controller("homeController", [
  "$scope",
  "$http",
  function($scope, $http) {
    $scope.feedback = { message: "", class: "" };
    $scope.formdata = {};
    $scope.tracks = [
      {
        date: "11/04/19",
        time: "9:30pm",
        league: "sweden phisvensran",
        game: "malmo vs sundsvail",
        prediction: "malmo wins",
        Odds: 1.56,
        result: "won"
      },
      {
        date: "11/04/19",
        time: "9:30pm",
        league: "sweden phisvensran",
        game: "malmo vs sundsvail",
        prediction: "malmo wins",
        Odds: 1.56,
        result: "won"
      }
    ];
    $scope.register = function() {
      if ($scope.formdata.password === $scope.formdata.confirmpassword) {
        console.log($scope.formdata);
        $http({
          method: "POST",
          url: "backend/users/register.php",
          data: $scope.formdata
        }).then(function(response) {
          alert(response.data);
        });
        $scope.feedback.message = "user sucessfully created";
        $scope.feedback.class = "green-text white btn";
        $scope.formdata = {};
      } else {
        $scope.formdata.password = "";
        $scope.formdata.confirmpassword = "";
        console.log("your password does not match.. try again");
        $scope.feedback.message = "your password does not match.. try again";
        $scope.feedback.class = "red-text white btn";
      }
    };
  }
]);

//sign in controller
app.controller("signinController", [
  "$scope",
  "$http",
  "$location",
  function($scope, $http, $location) {
    $scope.feedback = { message: "", class: "" };
    $scope.formdata = {};
    $scope.login = function() {
      $http({
        method: "POST",
        url: "backend/users/login.php",
        data: $scope.formdata
      }).then(function(response) {
        if (response.data != 1) {
          $scope.feedback.message = response.data;
          $scope.feedback.class = "red-text white btn";
          $scope.formdata = {};
        } else {
          $location.path("/subscribe");
        }
      });
    };
  }
]);

//subscribe controller
app.controller("subscribeController", [
  "$scope",
  "$http",
  "$rootScope",
  "$location",
  function($scope, $http, $rootScope, $location) {
    $scope.user = $rootScope.userdata;
    $scope.logout = function() {
      $http({ url: "backend/users/logout.php", method: "GET" }).then(function(
        response
      ) {
        if (response.data) {
          $location.path("/signin");
        }
      });
    };
    $scope.checkauth = function() {
      $http.get("backend/includes/authstatus.php").then(function(response) {
        alert(response.data);
      });
    };
  }
]);

//service controller
app.controller("serviceController", [
  "$scope",
  "$rootScope",
  "$http",
  "$location",
  function($scope, $rootScope, $http, $location) {
    $scope.logout = function() {
      $http({ url: "backend/users/logout.php", method: "GET" }).then(function(
        response
      ) {
        if (response.data) {
          $location.path("/signin");
        }
      });
    };
    $scope.daysleft = 2;
    $scope.casts = [
      {
        date: "11/04/19",
        time: "9:30pm",
        league: "sweden phisvensran",
        game: "malmo vs sundsvail",
        prediction: "malmo wins",
        Odds: 1.56
      },
      {
        date: "11/04/19",
        time: "9:30pm",
        league: "sweden phisvensran",
        game: "malmo vs sundsvail",
        prediction: "malmo wins",
        Odds: 1.56
      }
    ];
  }
]);
