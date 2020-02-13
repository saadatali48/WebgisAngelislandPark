<?php

$id=$_POST['id'];

$db = pg_connect("host = 'localhost' port = '5432' dbname = 'parkdb' user = 'postgres' password = 'postgres'") or die("unable to connect");
$result = pg_query($db,"delete from comments where id = '$id'");

$conn = NULL;
?>

