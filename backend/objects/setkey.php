<?php
require("../classes/admin.php");
$admin = new Admin();
$secretkey = 'AlphaNumeric#1';
$admin->setkey($secretkey);
echo "done";
?>