

/* Nap Section */
var mapLat = 37.862805;
var mapLong = -122.432891;
var mapZoom = 15;
var map = L.map('mapid').setView([mapLat, mapLong], mapZoom);
var mapboxStreets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic2FhZGF0MjkzMCIsImEiOiJjam5hYWZ3eXY0YWp4M3BxdmtrZTc3aTIxIn0.zkUyZR1Gx8ZGIk-52rxawA'
}).addTo(map);

var mapboxSatellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 22,
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1Ijoic2FhZGF0MjkzMCIsImEiOiJjam5hYWZ3eXY0YWp4M3BxdmtrZTc3aTIxIn0.zkUyZR1Gx8ZGIk-52rxawA'
});
var baseLayers = {
    "Street": mapboxStreets,
    "Imagery": mapboxSatellite
};
L.control.layers(baseLayers).addTo(map);

/* Global Variables */
var clickedLatLng = null;
var clickforcomment = null;
var clickedCommentMarkerLayer = null;
var clickedMarkerLayer = null;
var nearestPointCircleLayer = null;
var restRoomsPois = [];
var picnicSitesPois = [];
var historicSitesPois = [];
var drinkingWaterPois = [];
var beachesPois = [];
var campSitesPois = [];
var commentsMarkerGroup = L.layerGroup();
var selectedMarker = null;

/* Loading Park Boundary */
LoadParkBoundary();
function LoadParkBoundary() {
    var url = "php/loadparkboundary.php";
    var parkBoundaryStyle = {
        color: '#006400',
        dashArray: "5 5",
        weight: 3,
        interactive: false
    };
    $.ajax({
        dataType: "json",
        url: url,
        success: function (response) {
            var parkboundary = L.geoJSON(response, parkBoundaryStyle).addTo(map);
        }
    });
}

var geojsonMarkerOptions = {
    radius: 20,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.2,
    zIndex: 100000
};
var insertedcomment = L.icon({
    iconUrl: 'images/icons/comment.svg',
    iconSize: [20, 20],
    shadowSize: [30, 30],
    shadowAnchor: [14, 14]
});
var loadedcomment = L.icon({
    iconUrl: 'images/icons/comment.svg',
    iconSize: [20, 20],
    shadowSize: [30, 30],
    shadowAnchor: [14, 14]
});
var loadedcomment = L.icon({
    iconUrl: 'images/icons/comment.svg',
    iconSize: [20, 20],
    shadowSize: [30, 30],
    shadowAnchor: [14, 14],
});
var delcomment = L.icon({
    iconUrl: 'images/icons/comment-del.svg',
    iconSize: [20, 20],
    shadowSize: [30, 30],
    shadowAnchor: [14, 14],
});



/* Loading Pois layer */
LoadPoisLayer();
function LoadPoisLayer() {
    var picnicSites = L.icon({
        iconUrl: 'images/icons/picnic-table.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });
    var historicSites = L.icon({
        iconUrl: 'images/icons/historical-building.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });
    var drinkingWater = L.icon({
        iconUrl: 'images/icons/tap.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });
    var campSites = L.icon({
        iconUrl: 'images/icons/tent.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });
    var beaches = L.icon({
        iconUrl: 'images/icons/beach.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });
    var restRooms = L.icon({
        iconUrl: 'images/icons/restroom.svg',
        iconSize: [20, 20],
        shadowSize: [30, 30],
        shadowAnchor: [14, 14]
    });



    var url = "php/pois.php";
    $.ajax({
        dataType: "json",
        url: url,
        success: function (response) {
            L.geoJSON(response, {
                pointToLayer: function (feature, latlng) {
                    switch (feature.properties.type) {
                        case 1:
                            picnicSitesPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: picnicSites });
                        case 2:
                            historicSitesPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: historicSites });
                        case 3:
                            drinkingWaterPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: drinkingWater });
                        case 4:
                            campSitesPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: campSites });
                        case 5:
                            beachesPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: beaches });
                        case 6:
                            restRoomsPois.push(turf.point([latlng.lng, latlng.lat], { "name": feature.properties.name }));
                            return L.marker(latlng, { icon: restRooms });
                    }
                },
                onEachFeature: onEachFeature
            }).addTo(map);
            picnicSitesPois = turf.featureCollection(picnicSitesPois);
            historicSitesPois = turf.featureCollection(historicSitesPois);
            drinkingWaterPois = turf.featureCollection(drinkingWaterPois);
            campSitesPois = turf.featureCollection(campSitesPois);
            beachesPois = turf.featureCollection(beachesPois);
            restRoomsPois = turf.featureCollection(restRoomsPois);
        }
    });
    function onEachFeature(feature, layer) {
        popupcontent = feature.properties.name;
        layer.bindPopup(popupcontent);
    }
}

/* Loading Trail Boundary */
LoadTrailsBoundary();
function LoadTrailsBoundary() {
    var url = "php/loadtrailsboundary.php";
    var trailsBoundaryStyle = {
        color: 'blue',
        fillColor: '',
        dashArray: "5 5",
        weight: 1
    };
    $.ajax({
        dataType: "json",
        url: url,
        success: function (response) {
            L.geoJSON(response, trailsBoundaryStyle).addTo(map);
        }
    });
}

function FindNearestRestRoom() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, restRoomsPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Restroom is <strong>" + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';

    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}
function FindNearestPicnicSite() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, picnicSitesPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Picnic Site is <strong>" + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';

    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}
function FindNearestHistoricSite() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, historicSitesPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Historic Site is <strong>" + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';
    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}
function FindNearestCampSite() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, campSitesPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Camp Site is <strong>" + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';
    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}
function FindNearestBeach() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, beachesPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Beach is <strong> " + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';
    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}
function FindNearestDrinkingWater() {
    if (clickedLatLng != null) {
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
        var targetPoint = turf.point([clickedLatLng.lng, clickedLatLng.lat]);
        var nearest = turf.nearestPoint(targetPoint, drinkingWaterPois);
        nearestPointCircleLayer = L.circleMarker([nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]], geojsonMarkerOptions).addTo(map);
        document.getElementById("textinfo").innerHTML = "<p>Nearest Drinking water Spot is <strong>" + nearest.properties.name + "&nbsp</p>";
        document.getElementById("showpopupmessage").style.display = "flex";
        document.getElementById('mapid').style.height = '100%';
        document.getElementById('nearestpoint').style.display = 'none';
    }
    else {
        document.getElementById("clickonmap").style.display = "block";
    }

}

function RemoveNearestPoint() {
    map.removeLayer(clickedMarkerLayer);
    map.removeLayer(nearestPointCircleLayer);
    clickedMarkerLayer = null;
    nearestPointCircleLayer = null;
    clickedLatLng = null;

    document.getElementById("showpopupmessage").style.display = 'none';
}

function SubmitComment() {
    if (clickforcomment != null) {
        var selectedCommentType = $('#type').val();
        var selectedAmenity = $("#entity").val();
        var commentText = $('#commenttext').val();
        var email = $('#email').val();
        if (commentText == '') {
            document.getElementById("popuptext").innerHTML = "Please Enter text in comment box";
            document.getElementById("commentspopup").style.display = "block";
        }
        else {
            var latlongTemp = clickforcomment.lat + "," + clickforcomment.lng;
            var xmlhttp = new XMLHttpRequest();
            var params = "type=" + selectedCommentType + "&amenity=" + selectedAmenity + "&comment=" + commentText + "&email=" + email + "&latlong=" + latlongTemp;
            xmlhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var selectedAmenityValue = null;
                    var selectedCommentTypeValue = null
                    if (selectedAmenity == '1') {
                        selectedAmenityValue = "Picnic Sites";
                    }
                    else if (selectedAmenity== '2') {
                        selectedAmenityValue = "Historical Sites";
                    }
                    else if (selectedAmenity== '3') {
                        selectedAmenityValue = "Drinking Water";
                    }
                    else if (selectedAmenity== '4') {
                        selectedAmenityValue = "Camping Site";
                    }
                    else if (selectedAmenity== '5') {
                        selectedAmenityValue = "Beaches";
                    }
                    else if (selectedAmenity== '6') {
                        selectedAmenityValue = "Restrooms";
                    }
                    if (selectedCommentType == 1) {
                        selectedCommentTypeValue = "Suggestion";
                    }
                    else if (selectedCommentType == 2) {
                        selectedCommentTypeValue = "General feedback";
                    }
                    else if (selectedCommentType == 3) {
                        selectedCommentTypeValue = "Hazard";
                    }
                    var popupcontent = "<div> <p><strong>Type: </strong>" + selectedCommentTypeValue + "</p><br>"
                        + "<p> <strong>Amenity: </strong>" + selectedAmenityValue + "</p> <br>"
                        + "<p><strong> Comment: </strong>" + commentText + "</p> <br>"
                        + "</div>";
                    clickedCommentMarkerLayer.setIcon(insertedcomment).bindPopup(popupcontent);
                    map.flyTo(clickforcomment, 18);
                    //alert("Comment inserted"); 
                }
            };

            xmlhttp.open("POST", "php/insertcomment.php", true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send(params);
        }
    }
    else {
        document.getElementById("popuptext").innerHTML = "Please click on map to insert comment";
        document.getElementById("commentspopup").style.display = "block";
    }


}

function CancelComment() {
    document.getElementById("commentsection").style.display = 'none';
    document.getElementById("mapid").style.height = '100%';
    if (clickedCommentMarkerLayer) {
        map.removeLayer(clickedCommentMarkerLayer);
        clickedCommentMarkerLayer = null;
    }
    if (clickforcomment) {
        clickforcomment = null;
    }
}


function SubmitPassword() {
    if (document.getElementById('password').value == "admin") {
        document.getElementById("getcomments").style.display = "none";
        document.getElementById("mapid").style.height = "100%";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.responseText);
                for (var i = 0; i < response.length; i++){
                    var latlongtemp = response[i]['latlong'].split(',');
                    var popupcontent = "<div> <p><strong>Type: </strong>" + response[i]['commenttype'] + "</p><br>"
                    + "<p> <strong>Amenity: </strong>" + response[i]['amenitytype'] + "</p> <br>"
                    + "<p><strong> Comment: </strong>" + response[i]['comment'] + "</p> <br>"
                    + "</div>";
                    var marker = L.marker([parseFloat(latlongtemp[0]), parseFloat(latlongtemp[1])],{icon: loadedcomment}).bindPopup(popupcontent).addTo(map);
                    marker.properties = {};
                    marker.properties.id = response[i]['id'];
                    marker.on('click', function(e){
                        selectedMarker = e.target;
                       document.getElementById("removecomment").style.display = 'flex';
                    });
                    commentsMarkerGroup.addLayer(marker);
                }
                
            }
        };
        xhttp.open("GET", "php/getcomments.php", true);
        xhttp.send();
    }
}
function CancelPassword() {
    document.getElementById("removecomment").style.display = 'none';
    document.getElementById("getcomments").style.display = 'none';
    document.getElementById("mapid").style.height = '100%';

}


function YesButton(){
    selectedMarker.closePopup();
    selectedMarker.setIcon(delcomment);
    var xmlhttp = new XMLHttpRequest();
    var params = "id=" + selectedMarker.properties.id;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    };
    xmlhttp.open("POST", "php/delcomment.php", true);
    xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xmlhttp.send(params);
    map.removeLayer(selectedMarker);
    selectedMarker = null;
    document.getElementById("removecomment").style.display = "none";
}
function NoButton(){
    document.getElementById("removecomment").style.display = "none";
    map.eachLayer(function (layer) {
        if (layer != mapboxSatellite && layer != mapboxStreets) {
           if(layer.properties){
                if(layer.properties.id){
                    map.removeLayer(layer);
                }
           }
           
        };
    });
}

map.off("click");

L.easyButton('fa-home', function (btn, map) {
    map.eachLayer(function (layer) {
        if (layer != mapboxSatellite && layer != mapboxStreets) {
            map.removeLayer(layer);
        };
    });
    clickedLatLng = null;
    clickedMarkerLayer = null;
    nearestPointCircleLayer = null;
    restRoomsPois = [];
    picnicSitesPois = [];
    historicSitesPois = [];
    drinkingWaterPois = [];
    beachesPois = [];
    campSitesPois = [];

    LoadPoisLayer();
    LoadParkBoundary();
    LoadTrailsBoundary();
    map.setView([mapLat, mapLong], mapZoom);
    document.getElementById('mapid').style.height = '100%';
    document.getElementById('nearestpoint').style.display = 'none';
    document.getElementById("showpopupmessage").style.display = 'none';
    document.getElementById("commentsection").style.display = "none";
    document.getElementById("commentspopup").style.display = "none";
    document.getElementById("removecomment").style.display = "none";
    document.getElementById("getcomments").style.display = "none";

}, 'Zoom To Home').addTo(map);
L.control.locate().addTo(map);

L.easyButton('fa-pencil', function (btn, map) {
    if (document.getElementById("nearestpoint").style.display != "none") {
        if (clickedMarkerLayer) {
            map.removeLayer(clickedMarkerLayer);
            clickedMarkerLayer = null;
        }
        if (clickedLatLng) {
            clickedLatLng = null;
        }
        document.getElementById("nearestpoint").style.display = "none";
        document.getElementById("mapid").style.height = '100%';
    }
    if (document.getElementById("getcomments").style.display != "none") {
        map.eachLayer(function (layer) {
            if (layer != mapboxSatellite && layer != mapboxStreets) {
               if(layer.properties){
                    if(layer.properties.id){
                        map.removeLayer(layer);
                    }
               }
               
            };
        });
    }
    document.getElementById("getcomments").style.display = "none"
    document.getElementById("removecomment").style.display = "none"
    document.getElementById("commentsection").style.display = "block";
    document.getElementById("mapid").style.height = "90%";
    if (clickforcomment) {
        clickforcomment == null;
    }
    map.on('click', function (e) {
        clickforcomment = e.latlng;
        if (clickedCommentMarkerLayer) {
            map.removeLayer(clickedCommentMarkerLayer);
            clickedCommentMarkerLayer = L.marker(e.latlng).addTo(map);
        }
        else {
            clickedCommentMarkerLayer = L.marker(e.latlng).addTo(map);
        }

    });

}, 'Submit a comment',
    'comment-button', {
        position: 'bottomleft'
    }
).addTo(map);
L.easyButton('fa-search', function (btn, map) {
    if (document.getElementById("commentsection").style.display != "none") {
        if (clickedCommentMarkerLayer) {
            map.removeLayer(clickedCommentMarkerLayer);
            clickedCommentMarkerLayer = null;
        }
        if (clickforcomment) {
            clickforcomment = null;
        }
        document.getElementById("commentsection").style.display = "none";
        document.getElementById("mapid").style.height = '100%';
    }
    if (document.getElementById("getcomments").style.display != "none") {
        map.eachLayer(function (layer) {
            if (layer != mapboxSatellite && layer != mapboxStreets) {
               if(layer.properties){
                    if(layer.properties.id){
                        map.removeLayer(layer);
                    }
               }
               
            };
        });
    }
    document.getElementById("getcomments").style.display = "none"
    document.getElementById("removecomment").style.display = "none"
    document.getElementById("commentsection").style.display = "none";
    document.getElementById('mapid').style.height = '85%';
    document.getElementById('nearestpoint').style.display = 'block';

    if (clickedMarkerLayer) {
        map.removeLayer(clickedMarkerLayer);
    }
    if (nearestPointCircleLayer) {
        map.removeLayer(nearestPointCircleLayer);
    }
    map.on("click", function (e) {
        clickedLatLng = e.latlng;
        if (clickedMarkerLayer) {
            map.removeLayer(clickedMarkerLayer);
            clickedMarkerLayer = L.marker(e.latlng).addTo(map);
        }
        else {
            clickedMarkerLayer = L.marker(e.latlng).addTo(map);
        }
        if (nearestPointCircleLayer) {
            map.removeLayer(nearestPointCircleLayer);
        }
    });
}, 'Search the park',
    'search-button', {
        position: 'bottomleft'
    }).addTo(map);

L.easyButton('fa-wrench', function (btn, map) {
    if (document.getElementById("commentsection").style.display != "none") {
        if (clickedCommentMarkerLayer) {
            map.removeLayer(clickedCommentMarkerLayer);
            clickedCommentMarkerLayer = null;
        }
        if (clickforcomment) {
            clickforcomment = null;
        }
        document.getElementById("commentsection").style.display = "none";
        document.getElementById("mapid").style.height = '100%';
    }
    if (document.getElementById("nearestpoint").style.display != "none") {
        if (clickedMarkerLayer) {
            map.removeLayer(clickedMarkerLayer);
            clickedMarkerLayer = null;
        }
        if (clickedLatLng) {
            clickedLatLng = null;
        }
        document.getElementById("nearestpoint").style.display = "none";
        document.getElementById("mapid").style.height = '100%';
    }



    document.getElementById("getcomments").style.display = "flex";
    document.getElementById("mapid").style.height = "95%";

}, 'Search comments - staff only',
    'wrench-button', {
        position: 'bottomright'
    }
).addTo(map);

L.easyButton('fa-question', function (btn, map) {
    document.getElementById("parkdetails").style.display = "block";

}, 'More Information',
    'help-button', {
        position: 'topright'
    }
).addTo(map);