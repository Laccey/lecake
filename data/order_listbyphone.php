<?php
    /*根据客户端提交的电话号码，返回其所有订单*/
    header('Content-Type:application/json');
    $output = [];
    @$phone = $_REQUEST['phone'];
    if(empty($phone)){
        echo "[]";
        return;
    }

//    访问数据库
    $conn = mysqli_connect('127.0.0.1','root','wzn4999660!@#','lecake');
    $sql = "SET NAME utf8";
    mysqli_query($conn,$sql);
    $sql = "SELECT le_dish.did,le_dish.img_sm,le_order.user_name,le_order.order_time FROM le_dish,le_order WHERE le_order.did=le_dish.did AND le_order.phone='$phone'";
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }

    echo json_encode($output);
?>