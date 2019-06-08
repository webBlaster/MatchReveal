<?php
require("database.php");

class Admin
{
    private $db;
    public function __construct()
    {
        $this->db = new database();
    }
    //logs in a user
    public function login($password){
        //sql to check to if password is in db
        $checksql = "SELECT * FROM admin WHERE secretkey = '$password'";
        //check the db
        $conn = $this->db->connect();
        $conn->query($checksql);
        $result = $conn->query($checksql)->rowcount();
        if($result===1){
            echo "access granted";
        }else{
            echo "access denied";
        }

    }
    //adds a prediction 
    public function addprediction(){

    }
    //gets predictions
    public function getpredictions(){

    }
}

$test = new Admin();
$test->login("heyman");