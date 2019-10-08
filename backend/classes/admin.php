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
        //current date
        $currentdate = date("y/m/d",time());
        //sql to insert all prediction data into prediction table
        $sql = "INSERT INTO predictions 
        (game,league,time,prediction,odds,category,date) 
        VALUES('$game','$league','$time','$prediction','$odds','$category','$currentdate')";

        $connect = $this->db->connect();
        $insert = $connect->exec($sql);

        if($insert == 1){
            echo "1";
        }else{
            echo "0";
        }
    }
    //delete prediction
    public function deleteprediction($id){
        $sql = "DELETE FROM predictions WHERE id = '$id'";
        $conn = $this->db->connect()->exec($sql);
        if($conn == 1){
            echo "1";
        }else{
            echo "0";
        }
    }
    //add to winnings
    public function addtowins($game,$league,$time,$prediction,$gamedate){
        //sql to insert into wins table
        $sql = "INSERT INTO wins (game,league,time,prediction,gamedate)
         VALUES('$game','$league','$time','$prediction','$gamedate')";

         $conn = $this->db->connect()->exec($sql);
         if($conn == 1){
             echo "1";
         }else{
             echo "0";
         }

    }
    //remove from winnings
    public function remfromwins($id){
        $sql = "DELETE FROM wins WHERE id = '$id'";
        $conn = $this->db->connect()->exec($sql);
        if($conn == 1){
            echo "1";
        }else{
            echo "0";
        }
    }
}
