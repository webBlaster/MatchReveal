<?php
require('../objects/user.php');
//get variables 
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
//sanitize variables
$fullname = htmlentities($request->fullname);
$email = htmlentities($request->email);
$number = htmlentities($request->mobile);
$password = md5($request->password);
//register
$user->register($fullname,$email,$number,$password);