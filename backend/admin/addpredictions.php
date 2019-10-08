<?php
require("../objects/admin.php");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

//escaping the variables
$game = htmlentities($request->game);
$league = htmlentities($request->league);
$time = htmlentities($request->time);
$prediction = htmlentities($request->pred);
$odds = htmlentities($request->odds);
$category = htmlentities($request->cat);

//add to the db
$admin->addprediction($game,$league,$time,$prediction,$odds,$category);