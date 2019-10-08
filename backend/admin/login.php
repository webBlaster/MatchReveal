<?php
require("../objects/admin.php");
//get variables from client side
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$password = md5(htmlentities($request->password));
$admin->login($password);