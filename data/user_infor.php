<?php
    header('Content-Type:application/json');
    $output = [];
    @$user = $_REQUEST['user'];
    if(empty($user)){
        echo "[]";
        return;
    }

    $conn = mysqli_connect('23.106.158.44','root','chouchoushigesichouchou','lecake');
    $sql = 'SET NAMES utf8';
    mysqli_query($conn,$sql);
    $sql = "SELECT user_name,avatar,user_phone FROM le_user WHERE le_user.user_name='$user'";
    $result = mysqli_query($conn,$sql);
    while($arr = mysqli_fetch_assoc($result)){
        $output[] = $arr;
    }
    echo json_encode($output);

?>