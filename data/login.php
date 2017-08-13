<?php
    session_start();
    if(isset($_POST['user'])){
        $user = $_POST['user'];
        $password = $_POST['pwd'];
        if($user == 'admin' && $password == 'admin'){
//            var_dump($user);
//            $_SESSION['user'] = $user;
            return true;
        }else{
            return false;
        }
    }
?>