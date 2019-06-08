<?php
class general
{
    //checks if user is authenticated
    public function authstatus(){
        session_start();
        if(isset($_SESSION['auth'])){
            echo "connected";
        }else{
            echo "disconnected";
        }
    }
}
?>