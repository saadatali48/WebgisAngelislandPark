<?php


$db = pg_connect("host = 'localhost' port = '5432' dbname = 'parkdb' user = 'postgres' password = 'postgres'") or die("unable to connect");

$result = pg_query($db,"select a.id, a.description,a.latlong, b.types, c.type from comments as a, commenttypes as b, poitypes as c where a.commenttype_id = b.id and a.poitypes_id = c.id;");


if (!$result) {
    echo "Problem with query " . $query . "<br/>";
    echo pg_last_error();
    exit();
}

$response=[];
while($myrow = pg_fetch_assoc($result)) {
	$response[] =array("id"=>$myrow['id'],"comment"=>$myrow['description'],"latlong"=>$myrow['latlong'],"commenttype"=>$myrow['types'],"amenitytype"=>$myrow['type']);
}
if (sizeof($response) == 0){
  $response[] =array("value"=>"Not Found");
  echo json_encode($response);

}
else{
  echo json_encode($response);

}

?>

