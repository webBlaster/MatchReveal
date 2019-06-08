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
        $checkersql = "SELECT * FROM users WHERE email = '$email' and fullname = '$fullname'";
        $connect = $this->db->connect();
        $check = $connect->query($checkersql);
        $message;
        if($check->rowcount()==0){
            $adduser = "INSERT INTO users (fullname,email,number,password) VALUES ('$fullname','$email','$number','$password')";
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
    private function userid($username){
        $connect = $this->db->connect();
        $sql = "SELECT id FROM users where email ='$email'";
        $result = $connect->query($sql);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        $id = $result[0]["id"];
        return $id;
    }
    //logs out a user
    public function logout($username){
        //unset user sessions
        session_start();
        unset($_SESSION['user']);
        unset($_SESSION['auth']);
        echo json_encode("user session terminated");

    }
}