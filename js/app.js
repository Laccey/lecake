/**
 * Created by coco on 2017/6/28.
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
})(document,window);
angular.module('Module',['ng','ngRoute','ngAnimate','ngCookies','infinite-scroll']).config(['$routeProvider',function ($routeProvider) {
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
    // $scope.hasMore = true; //是否还有更多数据可供加载
    $scope.dishList = [];
    $http.get('data/dish_listbypage.php?start=0').then(function (data) {
        $scope.dishList = $scope.dishList.concat(data.data);
    });
    // $scope.items = new Item();
    // $scope.loadMore = function () {
    //     $http.get('data/dish_listbypage.php?start='+$scope.dishList.length)
    //         .then(function (data) {
    //             // if(data.data.length<8){
    //             //     $scope.hasMore = false;
    //             // }
    //             $scope.dishList = $scope.dishList.concat(data.data);
    //     })
    // };
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
})
    // .factory('Item',function ($scope,$http) {
    // var Item = function () {
    //     this.busy = false;
    // };
    // Item.prototype.loadMore = function () {
    //     if(this.busy) return;
    //     this.busy = true;
    //     $http.get('data/dish_listbypage.php?start='+$scope.dishList.length)
    //         .then(function (data) {
    //             $scope.dishList = $scope.dishList.concat(data.data);
    //             this.busy = false;
    //         }.bind(this));
    // };
    // return Item;
// })
.controller('detailCtrl',function ($scope,$rootScope,$routeParams,$http,$cookieStore) {
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
}).controller('userCtrl',function ($scope,$location,$cookieStore,$http) {
    $scope.name = $cookieStore.get('user');
    $http.post('data/user_infor.php','user='+$scope.name)
        .then(function (data) {
            var phone = data.data[0].user_phone;
            data.data[0].user_phone = phone.substr(0,3) + '****' + phone.substr(7,11);
            $scope.userList = data.data;
        })
});