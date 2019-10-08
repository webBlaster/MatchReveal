<?php
require("database.php");
class general
{
    private $db;
    public function __construct()
    {
        $this->db = new database();
    }
    //checks if user is authenticated
    public function authstatus(){
        session_start();
        if(isset($_SESSION['auth'])){
            echo "connected";
        }else{
            echo "disconnected";
        }
    }

    //returns todays predictions
    private function todayspredictions(){

        //current date
        $currentdate = date("y/m/d",time());

       //sql to get all todays post
       $sql = "SELECT * FROM predictions WHERE date = '$currentdate'";
       $result = $this->db->connect()->query($sql)->fetchAll(PDO::FETCH_ASSOC);
       return $result;

   }
    //get todays predictions
    public function getpredictions(){
        $result = $this->todayspredictions();
       echo json_encode($result);
   }

   //function to seperate predictions into individual cartegories
   public function getsortedpredictions(){
        //get predictions
        $result = $this->todayspredictions();
        //seperate into individual arrays
        $midnight = array();
        $low = array();
        $other = array();
        $twoplus = array();

        $predictions = array();

        foreach($result as $pred){
            switch($pred['category']){
                case 'midnight':
                array_push($midnight,$pred);
                break;

                case 'low':
                array_push($low,$pred);
                break;

                case 'other':
                array_push($other,$pred);
                break;

                default:
                array_push($twoplus,$pred);

            }
        }

        array_push($predictions,$midnight,$low,$other,$twoplus);
        //send back as json
        echo json_encode($predictions);
   }
   //get winnings
   public function getwins(){
       $sql = "SELECT * FROM wins ORDER BY date DESC LIMIT 5";
       $conn = $this->db->connect()->query($sql);
       $result = $conn->fetchAll(PDO::FETCH_ASSOC);
       echo json_encode($result);
   }

   //subscribe a user
   public function subscribe($email,$subtype){
       $connect = $this->db;
        $currentdate = date("Y-m-d",time());
        if($subtype =="trial"){
            $date = strtotime(date('Y-m-d',strtotime($currentdate))."+ 3 day");
            $enddate = date('Y-m-d',$date);
            $subsql = "UPDATE users SET enddate = '$enddate' WHERE email='$email'";
            $connect = $connect->connect()->exec($subsql);
            if($connect == 1){
                echo "1";
            }else{
                echo "0";
            }
        }else{
            $date = strtotime(date('Y-m-d',strtotime($currentdate))."+ 30 day");
            $enddate = date('Y-m-d',$date);
            $subsql = "UPDATE users SET enddate = '$enddate' WHERE email='$email'";
            $connect = $connect->connect()->exec($subsql);
            if($connect == 1){
                echo "1";
            }else{
                echo "0";
            }
        }
    }
}
