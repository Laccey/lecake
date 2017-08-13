<?php
    session_start();
    if(isset($_SESSION['user']) && !empty($_SESSION['user'])){
        return true;
    }else{
        return false;
    }
?>