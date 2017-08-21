<?php
    /*根据客户端登录的用户名，返回其所有订单*/
    header('Content-Type:application/json');
    $output = [];
    @$user = $_REQUEST['user'];
    if(empty($user)){
        echo "[]";
        return;
    }

//    访问数据库
    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = "SET NAMES UTF8";
    mysqli_query($conn,$sql);
    $sql = "SELECT le_dish.did,le_dish.img_sm,le_order.user_name,le_order.order_time FROM le_dish,le_order WHERE le_order.user='$user' AND le_dish.did=le_order.did";
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }

    echo json_encode($output);
?>