<?php
require("../objects/user.php");
//get variables from client side
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$email = htmlentities($request->email);
$password = md5($request->password);
$user->login($email,$password);