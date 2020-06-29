<?php
require("database.php");

class User
{
    private $db;
    public function __construct()
    {
        $this->db = new database();
    }
    //registers a new user
    public function register($fullname,$email,$number,$password){
        //connects to the db
        $checkersql = "SELECT * FROM users WHERE email = '$email' or fullname = '$fullname'";
        $connect = $this->db->connect();
        $check = $connect->query($checkersql);
        if($check->rowcount()==0){

            $currentdate = date('y/m/d',time());//current date
            $adduser = "INSERT INTO users (fullname,email,number,password,enddate)
             VALUES ('$fullname','$email','$number','$password','$currentdate')";

            $add = $connect->exec($adduser);
            if($add == 1){
                $message = "new user succesfully created";
                echo json_encode($message);
            }
            else{
                $message = "creating a new user failed";
                echo json_encode($message);
            }
        }
        else{
            $message = "user already exist";
            echo json_encode($message);
        }
    }
    //logs in a user
    public function login($email,$password){
        $connect = $this->db->connect();
        $checksql = "SELECT * FROM users WHERE email = '$email' and password = '$password'";
        $check = $connect->query($checksql);
        if($check->rowcount()==1){
            session_start();
            $_SESSION["user"]=$email;
            $_SESSION["auth"]=true;
            echo json_encode(1);
        }else{
            echo json_encode("wrong user details");
        }
    }
    //get user id
    private function userid($email){
        $connect = $this->db->connect();
        $sql = "SELECT id FROM users where email ='$email'";
        $result = $connect->query($sql);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        $id = $result[0]["id"];
        return $id;
    }
    //user registered email
    public function getuseremail(){
        session_start();
        if(isset($_SESSION['auth'])){
            echo $_SESSION['user'];
        }else{
            echo "login required";
        }
    }
    
    //logs out a user
    public function logout(){
        //unset user sessions
        session_start();
        unset($_SESSION['user']);
        unset($_SESSION['auth']);
        echo json_encode("user session terminated");

    }

    private function getenddate($email){
         //sql to select the expiration date
         $enddatesql = "SELECT enddate FROM users WHERE email = '$email'";
         //connect and query the db
         $conn = $this->db->connect();
         $enddate = $conn->query($enddatesql)->fetchAll(PDO::FETCH_ASSOC);
         $enddate = $enddate[0]["enddate"];
         return $enddate;
    }
     //checks user subscription status
     public function subscribestatus(){
         //get user email through sessions
         session_start();
         $email = $_SESSION["user"];
         $enddate = $this->getenddate($email);
        //current date
        $currentdate = date("Y-m-d",time());
        if($currentdate >= $enddate){
            echo "0";
        }else{
            echo "1";
        }
        //echo "1";

    }
    public function getdaysleft(){
        session_start();
        $email = $_SESSION["user"];
        $enddate = $this->getenddate($email);
        $currentdate = date('Y-m-d',time());

        $datediff = (strtotime($enddate) - strtotime($currentdate))/86400;
        if($datediff >= 1){
            echo json_encode($datediff);
        }else{
            echo "0";
        }
        
       
    }
    }