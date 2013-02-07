
function initialize() {


    
    var FullSail = new google.maps.LatLng(28.594461, -81.304002);

    var mapOptions = {
        zoom: 20,
        center: FullSail,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

      
/*=================== FS3C =======================*/       
    var FS3C_Bounds = new google.maps.LatLngBounds(
    	new google.maps.LatLng(28.594256, -81.304249),
    	new google.maps.LatLng(28.594663, -81.303696));

    var FS3C_map = new google.maps.GroundOverlay("FS3C.png", FS3C_Bounds);
   
    FS3C_map.setMap(map);

    
/*=================== FS3B1 =======================*/       
    var FS3B1_Bounds = new google.maps.LatLngBounds(
    	new google.maps.LatLng(28.594906, -81.304305),
    	new google.maps.LatLng(28.595417, -81.303560));

    var FS3B1_map = new google.maps.GroundOverlay("FS3B1.png", FS3B1_Bounds);
   
    FS3B1_map.setMap(map);

}