<?php
//    session_start();
    $user = $_POST['user'];
    $password = $_POST['pwd'];

    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = 'SET NAMES utf8';
    mysqli_query($conn,$sql);
    $sql = 'SELECT user_name,user_pwd FROM le_user';
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    };
    foreach($output as $k => $val){
        if($user == $val["user_name"] && $password == $val["user_pwd"]){
            echo $user;
        }
    }
//    $u = $output[0]["user_name"];
//    $p = $output[0]["user_pwd"];
//    if($user == $u && $password == $p){
////        $_SESSION['user'] = $user;
////        echo $_SESSION['user'];
//        echo $u;
//    }else{
//        echo "登录失败";
//        exit();
//    }

?>