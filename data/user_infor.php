<?php
    header('Content-Type:application/json');
    $conn = mysqli_connect('127.0.0.1','root','wzn4999660!@#','lecake');
    $sql = 'SET NAME UTF8';
    mysqli_query($conn,$sql);
    $sql = 'SELECT state FROM le_user';
    $result = mysqli_query($conn,$sql);
    if($arr = mysqli_fetch_assoc($result)){
            $output = $arr['state'];
    };
    echo json_encode($output);
//    echo $output
//    echo $result
//    console.log($result);
?>