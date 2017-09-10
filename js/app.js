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
// $(document).ready(function () {
//     setTimeout(scrollTo,0,0,0);
// });
// window.onload = function () {
//     setTimeout(scrollTo,0,0,0);
// };
angular.module('Module',['ng','ngRoute','ngAnimate','ngCookies','infinite-scroll']).config(['$routeProvider',function ($routeProvider) {
    $routeProvider
    //     .when('/start',{
    //     templateUrl:'tpl/start.html',
    //     controller:'startCtrl'
    // })
    .when('/main',{
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
        redirectTo:'/main'
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
    $scope.swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 2500,
        autoplayDisableOnInteraction: false
    });
    // $scope.scrollerConfig = {
    //     useCSSTransition: true,
    //     gpuOptimization: true,
    //     pullToRefresh :true,
    //     pullToRefreshConfig:{
    //         labelPull:"下拉刷新",
    //         labelClick:"点击刷新",
    //         labelRelease:"释放刷新",
    //         labelUpdate:"刷新中..."
    //     },
    //     onPullToRefresh : function(e){
    //         setTimeout(function () {
    //             e();
    //         }, 1500);
    //     },
    //     pullToLoadMore:true,
    //     pullToLoadMoreConfig:{
    //         labelPull:"上拉加载",
    //         labelClick:"点击加载",
    //         labelRelease:"释放加载",
    //         labelUpdate:"加载中..."
    //     },
    //     onPullToLoadMore:function(e){
    //         setTimeout(function () {
    //             e();
    //         }, 1500);
    //     }
    // };
    //
    // window.scroller = new Scroller('#wrapper', scrollerConfig);
    $scope.loadFlag = true;
    $scope.oi = 0;
    $scope.mySwiper = new Swiper('.outer',{
        direction: 'vertical',
        scrollbar: '.swiper-scrollbar',
        slidesPerView: 'auto',
        mousewheelControl: true,
        freeMode: true,
        onTouchMove: function(swiper){		//手动滑动中触发
            var _viewHeight = document.getElementsByClassName('outer-wrapper')[0].offsetHeight;
            var _contentHeight = document.getElementsByClassName('inner-slide')[0].offsetHeight;


            if(mySwiper.translate < 50 && mySwiper.translate > 0) {
                $(".init-loading").html('下拉刷新').show();
            }else if(mySwiper.translate > 50 ){
                $(".init-loading").html('松开立即刷新').show();
            }
        },
        onTouchEnd: function(swiper) {
            var _viewHeight = document.getElementsByClassName('outer-wrapper')[0].offsetHeight;
            var _contentHeight = document.getElementsByClassName('inner-slide')[0].offsetHeight;
            // 上拉加载
            if(mySwiper.translate <= _viewHeight - _contentHeight - 50 && mySwiper.translate < 0) {
                // console.log("已经到达底部！");

                if(loadFlag){
                    $(".loadtip").html('正在加载...');
                }else{
                    $(".loadtip").html('没有更多啦！');
                }

                setTimeout(function() {
                    for(var i = 0; i <5; i++) {
                        oi++;
                        $(".list-group").eq(mySwiper2.activeIndex).append('<li class="list-group-item">我是加载出来的'+oi+'...</li>');
                    }
                    $(".loadtip").html('上拉加载更多...');
                    mySwiper.update(); // 重新计算高度;
                }, 800);
            }

            // 下拉刷新
            if(mySwiper.translate >= 50) {
                $(".init-loading").html('正在刷新').show();
                $(".loadtip").html('上拉加载更多');
                loadFlag = true;

                setTimeout(function() {
                    $(".refreshtip").show(0);
                    $(".init-loading").html('刷新成功！');
                    setTimeout(function(){
                        $(".init-loading").html('').hide();
                    },800);
                    $(".loadtip").show(0);

                    //刷新操作
                    mySwiper.update(); // 重新计算高度;
                }, 1000);
            }else if(mySwiper.translate >= 0 && mySwiper.translate < 50){
                $(".init-loading").html('').hide();
            }
            return false;
        }
    });
    $scope.mySwiper2 = new Swiper('.swiper-container2',{
        onTransitionEnd: function(swiper){

            $('.w').css('transform', 'translate3d(0px, 0px, 0px)')
            $('.swiper-container2 .swiper-slide-active').css('height','auto').siblings('.inner-slide').css('height','0px');
            mySwiper.update();

//			$('.tab a').eq(mySwiper2.activeIndex).addClass('active').siblings('a').removeClass('active');
        }

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