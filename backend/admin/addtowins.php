<?php
require("../objects/admin.php");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

//escaping the variables
$game = htmlentities($request->game);
$league = htmlentities($request->league);
$time = htmlentities($request->time);
$prediction = htmlentities($request->pred);
$gamedate = htmlentities($request->gamedate);

//add to the db
$admin->addtowins($game,$league,$time,$prediction,$gamedate);