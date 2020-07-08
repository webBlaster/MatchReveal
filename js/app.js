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
        controller: "homeController",
        resolve: {
          wins: function($q, $rootScope, $http) {
            var defer = $q.defer();
            //get array of wins
            $http.get("backend/admin/getwins.php").then(function(response) {
              $rootScope.winnings = response.data;
              defer.resolve();
            });
            return defer.promise;
          }
        }
      })
      .when("/about", { templateUrl: "partials/user/about.html" })
      .when("/policy", { templateUrl: "partials/user/policy.html" })
      .when("/termsandcond", { templateUrl: "partials/user/tandc.html" })
      .when("/signin", {
        templateUrl: "partials/user/signin.html",
        controller: "signinController"
      })
      .when("/subscribe", {
        templateUrl: "partials/user/subscribe.html",
        controller: "subscribeController",
        resolve: {
          data: function($q, $rootScope, $http, $location) {
            var defer = $q.defer();
            $http
              .get("backend/includes/authstatus.php")
              .then(function(response) {
                if (response.data === "disconnected") {
                  $location.path("/signin");
                } else {
                  $http
                    .get("backend/users/subscribestatus.php")
                    .then(function(response) {
                      if (response.data == "1") {
                        $location.path("/service");
                      } else {
                        $http
                          .get("backend/users/getemail.php")
                          .then(function(response) {
                            $rootScope.userdata = response.data;
                            defer.resolve();
                          });
                      }
                    });
                }
              });

            return defer.promise;
          }
        }
      })
      .when("/service", {
        templateUrl: "partials/user/service.html",
        controller: "serviceController",
        resolve: {
          data: function($q, $rootScope, $http, $location) {
            var defer = $q.defer();
            $http
              .get("backend/includes/authstatus.php")
              .then(function(response) {
                if (response.data === "disconnected") {
                  $location.path("/signin");
                } else {
                  $http
                    .get("backend/users/subscribestatus.php")
                    .then(function(response) {
                      if (response.data !== "1") {
                        $location.path("/subscribe");
                      } else {
                        $http
                          .get("backend/users/sortedpredict.php")
                          .then(function(response) {
                            $rootScope.sortedpred = response.data;
                            $http
                              .get("backend/users/daysleft.php")
                              .then(function(response) {
                                $rootScope.daysleft = response.data;
                                defer.resolve();
                              });
                          });
                      }
                    });
                }
              });
            return defer.promise;
          }
        }
      })
      .when("/wb-signin", {
        templateUrl: "partials/admin/signin.html",
        controller: "wb-signinController"
      })
      .when("/wb-admin", {
        templateUrl: "partials/admin/dashboard.html",
        controller: "wb-adminController",
        resolve: {
          data: function($q, $rootScope, $location, $http) {
            var defer = $q.defer();
            if ($rootScope.admin !== true) {
              $location.path("/wb-signin");
            }
            $http
              .get("backend/admin/getpredictions.php")
              .then(function(response) {
                $rootScope.pred = response.data;
                defer.resolve();
              });

            return defer.promise;
          }
        }
      })
      .otherwise({ redirectTo: "/home" });
  }
]);

//home controller
app.controller("homeController", [
  "$scope",
  "$rootScope",
  "$http",
  function($scope, $rootScope, $http) {
    $scope.feedback = { message: "", class: "" };
    $scope.formdata = {};
    $scope.tracks = $rootScope.winnings;

    $scope.register = function() {
      if ($scope.formdata.password === $scope.formdata.confirmpassword) {
        $http({
          method: "POST",
          url: "backend/users/register.php",
          data: $scope.formdata
        }).then(function(response) {
          console.log(response.data);
          $scope.feedback.message = response.data;
          $scope.feedback.class = "green-text white btn";
          $scope.formdata = {};
        });
        
      } else {
        $scope.formdata.password = "";
        $scope.formdata.confirmpassword = "";
        $scope.feedback.message = "inconsistent password";
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
          $http
            .get("backend/users/subscribestatus.php")
            .then(function(response) {
              if (response.data == "1") {
                $location.path("/service");
              } else {
                $location.path("/subscribe");
              }
            });
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
    $scope.daysleft = $rootScope.daysleft;
    $scope.predict = $rootScope.sortedpred;
    //sorted arrays of predictions
    $scope.midnight = $scope.predict[0];
    $scope.low = $scope.predict[1];
    $scope.other = $scope.predict[2];
    $scope.plustwo = $scope.predict[3];
  }
]);

//wb-signin controller
app.controller("wb-signinController", [
  "$scope",
  "$rootScope",
  "$http",
  "$location",
  function($scope, $rootScope, $http, $location) {
    $scope.data = {};
    $scope.login = function() {
      $http({
        url: "backend/admin/login.php",
        method: "POST",
        data: $scope.data
      }).then(function(response) {
        if (response.data === "1") {
          $rootScope.admin = true;
          $location.path("/wb-admin");
        } else {
          alert("access denied");
        }
      });
    };
  }
]);

//wb-admin controller
app.controller("wb-adminController", [
  "$scope",
  "$rootScope",
  "$http",
  "$location",
  function($scope, $rootScope, $http, $location) {
    $scope.data = {};
    $scope.subdata = {};
    $scope.wins = {};
    $scope.predictions = $rootScope.pred;
    //add predictions
    $scope.add = function() {
      $http({
        url: "backend/admin/addpredictions.php",
        method: "POST",
        data: $scope.data
      }).then(function(response) {
        if (response.data === "1") {
          $scope.data = {};
          $scope.get();
        } else {
          alert("failed to add for some reason");
        }
      });
    };
    $scope.remove = function(id) {
      $http({
        url: "backend/admin/deleteprediction.php",
        method: "POST",
        data: id
      }).then(function(response) {
        $scope.get();
      });
    };
    $scope.subscribeuser = function() {
      $http({
        url: "backend/admin/subscribeuser.php",
        method: "POST",
        data: $scope.subdata
      }).then(function(response) {
        if (response.data == "1") {
          $scope.subdata = {};
          alert("done");
        }
      });
    };
    //add to winnings
    $scope.addtowins = function() {
      $http({
        url: "backend/admin/addtowins.php",
        method: "POST",
        data: $scope.wins
      }).then(function(response) {
        if (response.data == "1") {
          $scope.wins = {};
          $scope.getwins();
        }
      });
    };
    //remove from winnings
    $scope.remfromwins = function(id) {
      $http({
        url: "backend/admin/remfromwins.php",
        method: "POST",
        data: id
      }).then(function(response) {
        if (response.data == "1") {
          $scope.getwins();
        }
      });
    };
    //get array of wins
    $scope.getwins = function() {
      $http.get("backend/admin/getwins.php").then(function(response) {
        $scope.winrecord = response.data;
      });
    };
    //get predictions
    $scope.get = function() {
      $http.get("backend/admin/getpredictions.php").then(function(response) {
        $scope.predictions = response.data;
      });
    };
  }
]);
