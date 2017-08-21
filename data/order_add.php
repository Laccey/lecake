<?php
    /*根据客户端提交的订单信息，向订单表中插入一条记录，获得数据库返回的订单*/
    header('Content-Type:application/json');
    $output = [];
    @$user_name = $_REQUEST['user_name'];
    @$sex = $_REQUEST['sex'];
    @$phone = $_REQUEST['phone'];
    @$addr = $_REQUEST['addr'];
    @$did = $_REQUEST['did'];
    @$user = $_REQUEST['user'];
    $order_time = time()*1000;

    if(empty($user_name) || empty($sex) || empty($phone) || empty($addr) || empty($did) ){
        echo '[]';
        return;
    }

//    访问数据库
    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = "SET NAMES utf8";
    mysqli_query($conn,$sql);
    $sql = "INSERT INTO le_order VALUES(NULL,'$phone','$user_name','$sex','$order_time','$addr','$did','$user')";
    $result = mysqli_query($conn,$sql);
    $arr = [];
    if($result){
        $arr['msg'] = 'success';
        $arr['did'] = mysqli_insert_id($conn);//获得最近执行的一条INSERT语句生成的自增主键
    }else{
        $arr['msg'] = 'fail';
        $arr['reason'] = "SQL语句执行失败：$sql";
    }
    $output[] = $arr;

    echo json_encode($output);
?>