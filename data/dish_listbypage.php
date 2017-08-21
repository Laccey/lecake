<?php
    /*根据客户端提交菜品的序号，分页返回后续的5条所对应的菜品*/
    header('Content-Type:application/json;');
    $output = [];
    $count = 5;
    @$start = $_REQUEST['start'];
//    @符号用于压制该行代码产生的错误信息
    if(empty($start)){
        $start = 0;
    }
//    访问数据库
    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = 'SET NAMES utf8';
    mysqli_query($conn,$sql);
    $sql = "SELECT did,name,img_sm,material,price FROM le_dish LIMIT $start,$count";
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }
    $tmp = json_encode($output);
    echo $tmp
?>