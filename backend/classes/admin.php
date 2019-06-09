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
        //sql to check if password is in db
        $checksql = "SELECT * FROM admin WHERE secretkey = '$password'";
        //check the db
        $conn = $this->db->connect();
        $conn->query($checksql);
        $result = $conn->query($checksql)->rowcount();
        if($result===1){
            echo "1";
        }else{
            echo "0";
        }

    }
    //sets secret key for admin
    public function setkey($key){
        $encrypt = md5($key);
        $sql = "INSERT INTO admin (secretkey) VALUES('$encrypt')";
        $insert = $this->db->connect()->exec($sql);
        if($insert == 1){
            echo "secretkey set successfully";
        }else{
            echo "secretkey failed to change try later";
        }
    }
    //adds a prediction 
    public function addprediction($game,$league,$time,$prediction,$odds,$category){
        //sql to insert all prediction data into prediction table
        $sql = "INSERT INTO predictions 
        (game,league,time,prediction,odds,category) 
        VALUES('$game','$league','$time','$prediction','$odds','$category')";

        $connect = $this->db->connect();
        $insert = $connect->exec($sql);

        if($insert == 1){
            echo "1";
        }else{
            echo "0";
        }
    }
    //get todays predictions
    public function getpredictions(){

         //current date
         $currentdate = date("y/m/d",time());

        //sql to get all todays post
        $sql = "SELECT * FROM predictions WHERE date = '$currentdate'";
        $result = $this->db->connect()->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($result);

    }
}
