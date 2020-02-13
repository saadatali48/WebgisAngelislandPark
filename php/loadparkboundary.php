<?php


$db = pg_connect("host = 'localhost' port = '5432' dbname = 'parkdb' user = 'postgres' password = 'postgres'") or die("unable to connect");
$result = pg_query($db,"SELECT *,public.ST_AsGeoJSON(geom,6) AS geojson from angel_island_boundary");
if (!$result) {
  echo pg_last_error();
  exit();
}

$geojson = array(
   'type'      => 'FeatureCollection',
   'features'  => array()
);


$response=[];
while ($row = pg_fetch_assoc($result)) {
    $properties = $row;
    # Remove geojson and geometry fields from properties
    unset($properties['geojson']);
    unset($properties['geom']);
    $feature = array(
         'type' => 'Feature',
         'geometry' => json_decode($row['geojson'], true),
         'properties' => $properties
    );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}
header('Content-type: application/json');
echo json_encode($geojson, JSON_NUMERIC_CHECK);
$conn = NULL;
?>

