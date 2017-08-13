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
    }
    // document.getElementsByTagName("html")[0].setAttribute('style','font-size:'+ width() + "px !important");
})(document,window);
angular.module('Module',['ng','ngRoute','ngAnimate']).config(['$routeProvider',function ($routeProvider) {
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
    }).otherwise({
        redirectTo:'/start'
    })
}]).controller('parentCtrl',function ($scope,$location) {
    $scope.jump = function (routeURl) {
        $location.path(routeURl);
    }
}).controller('startCtrl',function ($scope,$rootScope,$http) {
}).controller('mainCtrl',function ($scope,$rootScope,$http) {
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
    // $http.get('data/user_infor.php').then(function (data) {
    //     $rootScope.result = data.data;
    //     if($rootScope.result == 0){
    //         $('#order').attr('href','#!/login');
    //     }else{
    //         $('#order').attr('href','#!/myorder');
    //     }
    // });
    // console.log($rootScope.result);
    // if($rootScope.result == 0){
    //     console.log($rootScope.result);
    //     $('#order').attr('href','#!/login');
    // }else{
    //     $('#order').attr('href','#!/myorder');
    // }
    $scope.ifLogin = function () {
        $('.fixed-nav .active').removeClass('active');
        $('#index').attr('xlink:href','#index-regular.b245d60');
        $('#order').addClass('active');
        $('#order use').attr('xlink:href','#order.070ae2a');
        $http.get('data/judge_login.php').then(function (data) {
            if(data.data == 'true'){
                window.location.href = '#!/myorder';
            }else{
                window.location.href = '#!/login';
            }
        })
    }
}).controller('detailCtrl',function ($scope,$routeParams,$http) {
    // 读取路由url中的参数
    $http.get('data/dish_listbydid.php?did='+$routeParams.did)
        .then(function (data) {
            $scope.dish = data.data[0];
            $scope.dish.detail = $scope.dish.detail.split('，');
        });
    $scope.ifLogin = function () {
        $http.get('data/judge_login.php').then(function (data) {
            if(data.data == 'true'){
                window.location.href = '#!/myorder';
            }else{
                window.location.href = '#!/login';
            }
        })
    };
}).controller('orderCtrl',function ($scope,$routeParams,$http,$rootScope) {
    $scope.order = {did:$routeParams.did};
    console.log($scope.order);
    $scope.submitOrder = function () {
        $rootScope.phone = $scope.order.phone;
        var str = jQuery.param($scope.order);
        $http.post('data/order_add.php', str)
            .then(function (data) {
                $scope.result = data.data[0];
        })
    }
}).run(function ($http) {
    $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded'};
}).controller('myorderCtrl',function ($scope,$http,$rootScope) {
    $http.post('data/order_listbyphone.php','phone='+$rootScope.phone)
        .then(function (data) {
            $scope.orderList = data.data;
        })
}).controller('loginCtrl',function ($scope,$http,$routeParams) {
    $scope.user = $routeParams;
   $scope.Login = function () {
       var str = jQuery.param($scope.user);
       $http.post('data/login.php', str).then(function (data) {
                console.log(data.data);
                if(data.data == true){
                    console.log(data.data);
                    window.location.href = '#!/main';
                }else{
                    alert('密码或用户名不正确!');
                }
            })
   }
});
// .controller('footerCtrl',function ($scope,$http) {
//     $scope.ifLogin = function () {
//         $http.get('data/user_infor.php').then(function (data) {
//             $scope.result = data.data;
//             console.log($scope.result);
//             if($scope.result == 0){
//                 console.log($('.fixed-nav').children);
//             }
//         })
//     }
//
// });