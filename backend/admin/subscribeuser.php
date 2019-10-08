<?php
require("../objects/public.php");
$postdata = file_get_contents("php://input");
$postdata = json_decode($postdata);

$email =$postdata->email;
$subtype = $postdata->type;


$public->subscribe($email,$subtype);