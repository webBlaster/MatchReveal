<?php
require("../objects/admin.php");

$id = json_decode(file_get_contents("php://input"));
$admin->remfromwins($id);