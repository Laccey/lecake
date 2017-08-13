<?php
    /*根据客户端提交的菜品编号，返回指定的菜品*/
    header('Content-Type:application/json');
    $output = [];
    @$did = $_REQUEST['did'];
    if(empty($did)){
        echo '[]';
        return;
    }

//    访问数据库
    $conn = mysqli_connect('127.0.0.1','root','wzn4999660!@#','lecake');
    $sql = "SET NAME utf8";
    mysqli_query($conn,$sql);
    $sql = "SELECT did,name,img_sm,img_lg,detail,material,price FROM le_dish WHERE did = $did";
    $result = mysqli_query($conn,$sql);
    if($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }

    echo json_encode($output);
?>