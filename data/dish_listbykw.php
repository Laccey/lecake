<?php
    /*根据客户端提交的查询关键字，返回包含指定关键字的菜品*/
    header('Content-Type:application/json');
    $output = [];
    @$kw = $_REQUEST['kw'];
    if(empty($kw)){
        echo "[]";
        return;
    }

//    访问数据库
    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = "SET NAMES utf8";
    mysqli_query($conn,$sql);
    $sql = "SELECT did,name,img_sm,material,price FROM le_dish WHERE name LIKE '%$kw%' OR material LIKE '%$kw%'";
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }

    echo json_encode($output);
?>