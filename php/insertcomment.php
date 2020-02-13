<?php

$type=$_POST['type'];
$amenity=$_POST['amenity'];
$comment = $_POST['comment'];
$email = $_POST['email'];
$latlong = $_POST['latlong'];

$db = pg_connect("host = 'localhost' port = '5432' dbname = 'parkdb' user = 'postgres' password = 'postgres'") or die("unable to connect");
$result = pg_query($db,"insert into comments (description,latlong,poitypes_id,commenttype_id,email) values ('$comment','$latlong','$amenity','$type','$email')");

$conn = NULL;
?>

