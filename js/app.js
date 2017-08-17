/**
 * Created by Wayne on 2017/6/28.
 */
(function (doc,win) {
    var width = function () {
        return (document.body || document.documentElement).clientWidth / 10;
    };
    var fontSize = function () {
        document.getElementsByTagName("html")[0].setAttribute('style','font-size:'+ width() + "px !important");
    };
    // fontSize();
    doc.addEventListener('DOMContentLoaded',fontSize,false);
    win.onresize = function () {
        fontSize();
    };
    var bottomBar = function () {

    }
})(document,window);
angular.module('Module',['ng','ngRoute','ngAnimate','ngCookies']).config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/start',{
        templateUrl:'tpl/start.html',
        controller:'startCtrl'
    }).when('/main',{
        templateUrl:'tpl/main.html',
        controller:'mainCtrl'
    }).when('/detail/:did',{
        templateUrl:'tpl/detail.html',
        controller:'detailCtrl'
    }).when('/order/:did',{
        templateUrl:'tpl/order.html',
        controller:'orderCtrl'
    }).when('/myorder',{
        templateUrl:'tpl/myorder.html',
        controller:'myorderCtrl'
    }).when('/login',{
        templateUrl:'tpl/login.html',
        controller:'loginCtrl'
    }).when('/user',{
        templateUrl:'tpl/user.html',
        controller:'userCtrl'
    }).otherwise({
        redirectTo:'/start'
    })
}]).controller('parentCtrl',function ($scope,$location) {
    $scope.jump = function (routeURl) {
        $location.path(routeURl);
    }
}).controller('startCtrl',function ($scope,$http) {
}).controller('mainCtrl',function ($scope,$rootScope,$http,$cookieStore) {
    $scope.hasMore = true; //是否还有更多数据可供加载
    $scope.dishList = [];
    $http.get('data/dish_listbypage.php?start=0').then(function (data) {
        $scope.dishList = $scope.dishList.concat(data.data);
    });
    $scope.loadMore = function () {
        $http.get('data/dish_listbypage.php?start='+$scope.dishList.length)
            .then(function (data) {
                if(data.data.length<5){
                    $scope.hasMore = false;
                }
                $scope.dishList = $scope.dishList.concat(data.data);
        })
    };
    $scope.$watch('kw',function () {
        if($scope.kw){
            $http.get('data/dish_listbykw.php?kw='+$scope.kw)
                .then(function (data) {
                    $scope.dishList = data.data;
                })
        }
    });
    $scope.$watch($cookieStore,function () {
        $scope.name = $cookieStore.get('user');
        $scope.ifLogin_order = function () {
            if(!$scope.name){
                window.location.href = '#!/login';
            }else{
                window.location.href = '#!/myorder';
            }
        };
        $scope.ifLogin_user = function () {
            if(!$scope.name){
                window.location.href = '#!/login';
            }else{
                window.location.href = '#!/user';
            }
        };
    });
}).controller('detailCtrl',function ($scope,$rootScope,$routeParams,$http,$cookieStore) {
    // 读取路由url中的参数
    $http.get('data/dish_listbydid.php?did='+$routeParams.did)
        .then(function (data) {
            $scope.dish = data.data[0];
            $scope.dish.detail = $scope.dish.detail.split('，');
        });
    $scope.$watch($cookieStore,function () {
        $scope.name = $cookieStore.get('user');
        $scope.ifLogin_order = function () {
            if (!$scope.name) {
                window.location.href = '#!/login';
            } else {
                window.location.href = '#!/order/'+$routeParams.did;
            }
        };
    });
}).controller('orderCtrl',function ($scope,$routeParams,$http,$cookieStore) {
    $scope.order = {did:$routeParams.did};
    $scope.submitOrder = function () {
        var str = jQuery.param($scope.order);
        $scope.name = $cookieStore.get('user');
        $http.post('data/order_add.php', str+'&user='+$scope.name)
            .then(function (data) {
                $scope.result = data.data[0];
        })
    }
}).run(function ($http) {
    $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded'};
}).controller('myorderCtrl',function ($scope,$http,$rootScope,$cookieStore) {
    $scope.name = $cookieStore.get('user');
    $http.post('data/order_listbyuser.php','user='+$scope.name)
        .then(function (data) {
            $scope.orderList = data.data;
        })
}).controller('loginCtrl',function ($scope,$rootScope,$http,$routeParams,$cookieStore) {
    $scope.user = $routeParams;
    $scope.Login = function () {
       var str = jQuery.param($scope.user);
       $http.post('data/login.php', str).then(function (data) {
                if(data.data == $scope.user.user){
                    window.location.href = '#!/main';
                    $cookieStore.put('user',$scope.user.user);
                }else{
                    alert('密码或用户名不正确!');
                }
            })
   }
}).controller('userCtrl',function ($scope,$location) {

});