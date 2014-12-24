/**
* app.js
*/
var myApp = angular.module("myBookRatingApp", ['firebase','ngCookies']);

/*myApp.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    .when('/login', {
        templateUrl:'../../partials/login.html',
        controller:'loginCtrl'
    })
    .otherwise({redirectTo: '/'})
}]);*/

//declaring angular comtroller and adding dependencies
myApp.controller('bookCtrl', ['$scope', '$firebase', '$cookies',
    function($scope, $firebase, $cookies) {
        var ref = new Firebase("https://booklistapp.firebaseio.com/booklist");
        $scope.books = $firebase(ref).$asArray();
        
        //taking advantage of html5 local storage for saving user's unique id
        if (!localStorage.user_access) {
            localStorage.user_access = get_random_no();
        } 
        var accessMod = $scope.access = localStorage.user_access;
        
        //adding new books function
        $scope.addBooks = function() {
            if(!$scope.bookName || !$scope.bookCat) return;
            var name = $scope.bookName;
            $scope.books.$add({name: name, category: $scope.bookCat, bookrating:0, avgrating:0, timesrated:0});
            //RESET input
            $scope.bookName = $scope.bookCat = "";
            
        };

        //delete a book all users have read write access
        $scope.deleteBook = function(id) {
            $scope.books.$remove(id);
        };

        //update books disable when book has been rated
        $scope.updatebook = function(id, rating, key) {
            
            var avgrate = $scope.books.$getRecord(key);
            avgrate.timesrated = avgrate.timesrated + 1;
            var avg = get_average_rating(avgrate.avgrating, rating);
            avgrate.avgrating = avg;
            console.log(avgrate.bookrating);
            //if(Number(accessMod) != Number($scope.access)) {
                //user is a new user save data
            $scope.books.$save(id);
            //}
            
            disable_ratings();
            
            
        }

        //clears everthing in local storage (user access)
        $scope.new_rateUid = function() {
            localStorage.clear();
            localStorage.user_access = get_random_no();
            $scope.access = localStorage.user_access;
            disable_ratings();

            console.log($scope.books);
            for(var i =0;i<$scope.books.length;i++){
                var id = $scope.books[i]['$id'];
                var newRef = new Firebase("https://booklistapp.firebaseio.com/booklist/"+id).update({bookrating:0});
            }
            
        }
    }
]);

function get_average_rating(oldrating, newrating) {
    //return (oldrating + newrating)/count;
    return Math.ceil((Number(oldrating) + Number(newrating)))
}

function get_random_no() {
    return(Math.floor(100000 + Math.random() * 900000)); //dont ever use in production
}

function disable_ratings() {
    //$(".rater").addClass("hide") ;
}

/** Start jQuery :) **/


