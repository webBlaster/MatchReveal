<?php
require("../objects/public.php");
$postdata = file_get_contents("php://input");
$type = $postdata;

session_start();
$email = $_SESSION['user'];

$public->subscribe($email,$type);