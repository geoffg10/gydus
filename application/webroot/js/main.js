/* 
	Date: December 2, 2012
	Project: MDD - gydus
	Project co-auth: Geoffrey Ganga, Jarvis Jardin, Renee Blunt
	Contact info
	-------------
		Renee Blunt:
					  renee.blunt@gmail.com
					  (407) 536-9168
					  
     Geoffrey Ganga: 
     				  bakerskategg09@gmail.com
     				  (678) 825-5628
     				  
      Jarvis Jardin: 
      				 jjardin@rocketmail.com
      				  (201) 779-6182
      				  
   ------------------------------------------
	The below code is accessing the Google Maps APIv3 and the Google Places API
	Also using maxmind for ip location

*/
$(document).ready(function () {
    var userLat = '',
        userLong = '';

    var map;
    var infowindow;
    var pos; //this is the users location that is displayed on google maps
    var map;
    var userMarker; //this is the visual location/marker of the user
    var selectedLocation = {};
    var campus = {};
    var campusId = {};
    var schoolArray = [];
    var buildingArray = [];
    var userJSONObj = {};
    var chosenSchool = {};
    var chosenBuilding;
    var typeahead = [];



    
    if (localStorage) {
        if (localStorage.userObj) {
            userJSONObj = JSON.parse(localStorage.userObj);
        }
    }


    /*	The below variables are just for an initial map location 
	we're doing this so that the user isn't prompted to share IP on inital page load
	until they've decided they want to use the application
	*lat and long based off of user's ip using the maxmind geoip js 
	*methods are listed here http://dev.maxmind.com/geoip/javascript
*/
    var geoIPLat = geoip_latitude(),
        geoIPLong = geoip_longitude();

    //initialize() is the first function fired, it is called on a domlistener for window load
    //it loads the map first based off of the users IP
    /*===================================================================================================== ##1.1 -runs initialize on load
     */
    function initialize() {

        pos = new google.maps.LatLng(geoIPLat, geoIPLong); //create map position
        var mapOptions = {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 15,
            center: pos
        };
        
        var image = new google.maps.MarkerImage(
	      'webroot/img/mapIcons/user-icon.png',
		    new google.maps.Size(32,37),
		    new google.maps.Point(0,0),
		    new google.maps.Point(16,37)
		);


        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions); //create a map and place it in its container with initial options
        userMarker = new google.maps.Marker({ //create current location marker on the map
            position: pos,
            map: map,
            title: 'You are here',
            draggable: true,
            icon:image

        });
        infowindow = new google.maps.InfoWindow(); //create infowindow, this is called later to display the location details when clicked

        google.maps.event.addListener(map, 'zoom_changed', function () {
	        clearSearchBar();
	        
            if (map.getZoom() == 16) {
                clearMarkers('building');
                getAllCampuses();
                $('#schoolCrumb').addClass('hide');
                $('#buildingCrumb').addClass('hide');
                chosenSchool = '';
                chosenBuilding = '';
            }else if(map.getZoom() == 17){
	            $('#buildingCrumb').addClass('hide');
	            chosenBuilding = '';
            }
        });


        google.maps.event.addListener(userMarker, 'dragend', function () {

        });
       
        
         var styles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});


  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

        

        /*===================================================================================================== ##2 getUniversities runs after initialize on load
         */
        
        getAllCampuses();
        getUniversities(); // calls the function get university

    }; //close initialize

    function handleNoGeolocation(errorFlag) { //this is fired when geolocation is accessed by user and there is a fail, it accepts a boolean
        if (errorFlag) {
            var content = 'Error: The Geolocation service failed.';
        } else {
            var content = 'Error: Your browser doesn\'t support geolocation.';
        }
    }; // close handleNoGeolocation




    //initialize();
    /*===================================================================================================== ##1 runs initialize on load
     */
 
    google.maps.event.addDomListener(window, 'load', initialize);



    /*
	//////////////////////////////////////////////////////////////////////////////////////  user generated calls
*/



    /*===================================================================================================== ##2.1 getUniversities runs after initialize on load
     */
 //////----------------------------------------------------- GET UNIVERSITIES  -------------------------------//////
   
    //gets universities within users location using the Google API
    function getUniversities() { 
        var request = {
            location: pos,
            radius: 9000, //this is in meters, its about 5 miles
            types: ['university']
        };

        var service = new google.maps.places.PlacesService(map); //create a google places service
        /*===================================================================================================== ##2.2 getUniversityCallback runs after getUniversities on load
         */
        service.nearbySearch(request, getUniversityCallback); //first parm is the request object, then runs the function with the results

    }; //close getUniversities

    /*===================================================================================================== ##2.2.1 getUniversityCallback runs after getUniversities on load
     */
     
     
//////----------------------------------------------------- GET UNIVERSITIES ( CALL BACK )  -------------------------------//////
     
    function getUniversityCallback(results, status) { //first param is the results json object from the getUniversities query, the second param is the status

        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
            	
                var google_id = results[i].id;
                getDBCampuses(results[i], google_id);

            } //end of for loop
        }
    }; //close getUniversityCallback

//////----------------------------------------------------- CREATING MARKERS  -------------------------------//////

    //creates markers on the map. params(name of marker, Lat/Long of marker, id of information, type of marker, zoom distance, infowindow content
    function createMarker(name, latlng, id, type, zoom, content) { 
//createMarker(response.result[i].name, ltlg, response.result[i].id, 'school', 17);
	    // if statement to set 'icon' variable depending on the type 
	    if(type=='school'){
		    
		    var icon = 'img/mapIcons/university-icon.png';
		   
		    

	    }else if(type=='building'){
		    var icon = 'img/mapIcons/building-icon.png';
		    
	    }
	    
	    //Google.Map API call to make an image for making custom markers
	    var image = new google.maps.MarkerImage(
	      icon,
		    new google.maps.Size(32,37),
		    new google.maps.Point(0,0),
		    new google.maps.Point(16,37)
		);
	    
		//create marker
        var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            icon: image
        });

        // click event listener for marker. params(where its attached to, type of event, function)
        google.maps.event.addListener(marker, 'click', function () { 
	        
	        //if statement to give the different types of markers, different functionality
            if (type == 'school') {
               
               	
               $('#schoolCrumb').removeClass('hide').html(name);               	
	           chosenSchool = {'name':name, 'id':id};
                
                getBuildings(id);
                infowindow.setContent(name);


            } else if (type == 'building') {
            	
            	
            	
            	$('#buildingCrumb').removeClass('hide').html(name);
            	
            	chosenBuilding = name;
            	
            	infowindow.setContent('<h4>'+name+'</h4>'+content+"<form class='hide' id='addRoomForm'><input id='addRoomInput' type='text' placeholder='Room Name'><button id='addRoomBtn' class='btn'> Add Room </button></form>"+"<button id='showAddRoomBtn' class='btn'>+</button>");
            	
            	
            }
            
            infowindow.open(map, this);
            map.setZoom(zoom);

            return false;

        });
        
        //if statement to give the different markers, different functionality
        if (type == 'school') {
            clearMarkers('building'); // calls clearMarkers() function. param(type of marker to remove)
            schoolArray.push(marker); //pushes to an array for clearMarkers() function

        } else if (type == 'building') {

            clearMarkers('school');// calls clearMarkers() function. param(type of marker to remove)
            buildingArray.push(marker);//pushes to an array for clearMarkers() function


        }


    }; //close createMarker

//////----------------------------------------------------- CLEAR MARKERS  -------------------------------//////

    //Clears markers from the map.params(type of marker to remove)
    function clearMarkers(whichOne) {
        if (whichOne == 'school') {
            if (schoolArray) {
                for (i in schoolArray) {            //array is populated with the marker from the createMarker() function.
                    schoolArray[i].setMap(null);
                };

                schoolArray.length = 0;


            }
        } else if (whichOne == 'building') {

            if (buildingArray) {
                for (i in buildingArray) {
                    buildingArray[i].setMap(null);
                }
                buildingArray.length = 0;

            }
        }
    }
    
///////-------------------------------------------------- CLEAR SEARCHBAR ----------------------------------/////

	function clearSearchBar(){
		
		$('#searchBar').val('');	
		
	};  
	
	function updateSearch(){
		
		$('#searchBar').attr('data-source', "["+typeahead+"]")	
	}; 
    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
    
											           AA              JJ        AA        XX       XX
											        AA    AA           JJ     AA    AA      XX     XX
											        AAAAAAAA           jj     AAAAAAAA       XX   XX
											        AA    AA           jj     AA    AA         XXX
											        AA    AA    jj     jj     AA    AA       XX   XX
											        AA    AA    jjjjjjjjj     AA    AA      XX     XX
											    
 */   
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////----------------------------------------------------- GET CAMPUSES  -------------------------------//////

    function getAllCampuses() { 
    //starting the ajax call to database 
       $.ajax({
       	//the type of method we are going to use
       	//using GET because we are tying to get information
            type: 'GET',
        // the php file that we are calling 
            url: '../application/map/getAllCampuses',
        //the type of data we are going to be gathering is going to be json
            dataType: 'json',
        // if everything works out right the success function will run
            success: function (response) {
            
            	// looping through the results that we are getting back
                for (var i = 0; i < response.result.length; i++) {
	                // creating a variable latitude and longitude
                    var ltlg = new google.maps.LatLng(response.result[i].latitude, response.result[i].longitude)
                    //create markers for the campuses
                    
                    createMarker(response.result[i].name, ltlg, response.result[i].id, 'school', 17, '');
                }// end of the for loop
            },// end of the success function
            // if there is an error, then this error function will happen
            error: function (error) {
            	//do things with errors
            }// end of error function
        });// end of ajax function
    };// end of get campuses
   
//////----------------------------------------------------- GET DBCampuses  -------------------------------//////

    function getDBCampuses(place, google_id) { // performing ajax to check db with results then display results
        //takes two params, one is the google place and the second is the id of the google place
     // starting the ajax call to the database
    
        $.ajax({
        	//using POST because we are tying to POST the information
            type: 'POST',
            // the data that we are sending to is the google id
            data: {
                google_id: google_id
            },
            // the php file that we are calling to make this function run
            url: '../application/map/getcampuses',
            //the type of data we will be expecting to be returned is JSON
            dataType: 'json',
            //if everything runs correctly then this function wil run with successLocDB as its param
            //successLocDB is a ref to the database
            success: function (successLocDB) {
                //if the result from the database is no record then
                if (successLocDB.result.length == 0) {
                    //call the function makeList
                    //this is for locations that aren't in the db
                    makeList(place);
                } else {
                	//this is for locations that are in the user's map location and in the DB
                    //if the data has a record then you will call the make Added school, with place, the successLocDB result passed into the function
                    //makeAddedSchool(place, successLocDB.result);

                    //call the schools from the database
                    schoolsFromDB(place, successLocDB.result);
                }//end of else
            },// end of success function
            //if there is an error then error function run
            error: function (error) {
              console.log(error);
            }//end of error function
        }); //end of ajax
    }; // end of getDBCampuses function


//////----------------------------------------------------- ADD NEW CAMPUS  -------------------------------//////

// add my campus function
    function addmyCampus(data) { 
    	// starting the ajax call
    	console.log(data);
        $.ajax({
        	//using POST because we are tying to POST the information
            type: 'POST',
            //the data we are going to be sending to the database and will be using
            data: {
                latitude: data.geometry.location.Ya,//latitude is grabbing the latitude from the location
                longitude: data.geometry.location.Za,//longitude is grabbing the longititude from the location
                name: data.name,//grabbing the name form the data
                google_id: data.id//google ref id, we are sending the campus id to the database
            },
            //the php fiile we are using to send the information to the database
            url: '../application/map/addcampus',
            // the type of data we are expecting back is in the json format
            dataType: 'json',
            //success function
            success: function (successData) {
            	console.log(successData)
                //if the message is location added then
                if (successData.message == "location added") {
                    //should be calling this is your location
                }//end of if
                //calling the getDBCampuses function and passing the data that we are recieveing  and the id of the data to the function
                console.log("getDBcampuses line 449");
                getDBCampuses(data, data.id);
            },//end of the success function
            error: function (errorData) {
            	console.log(errorData);
            }//end of the error function
        });// end of ajax
    };// end of addmycampus function

//////----------------------------------------------------- ADD NEW BUILDING  -------------------------------//////


    function addNewBuilding(newBuildingName, newBuildinglatitude, newBuildinglongitude, campus_identify) { // add building to DB
        //starting the ajax call
        $.ajax({
        	//using POST because we are tying to POST the information
            type: 'POST',
            //the data is going to be the campus id, the position, the name, and who the info was added by
            data: {
                campus_id: campus_identify,
                latitude: newBuildinglatitude,
                longitude: newBuildinglongitude,
                name: newBuildingName
            },
            // the php file we are going to use to help make this work
            url: '../application/map/addbuilding',
            //the type of data we are expecting is going to be in JSON format
            dataType: 'json',
            //success function
            success: function (successData) {
                //if the success data has an error
                if(successData.message == "must_log_in"){
	                //show login
                }else if(successData.message == "building_added"){
	                //if it worked, then set the infowindow (when you click on the marker, the information bubble that pops up) should be the new buildings name
                 
                    infowindow.getContent(newBuildingName);
                }
            },//end of success
            //error function
            error: function (errorData) {
                console.log(errorData);
            }//end of error
        });// end of ajax
    };// end of add new building

//////----------------------------------------------------- GET BUILDINGS   -------------------------------//////

    function getBuildings(data) { // performing ajax to get buildings from the selected College 
        clearMarkers('building');


        $.ajax({
            //using POST because we are tying to POST the information
            type: 'POST',
            // the data  is going to be the campus_id which is data
            data: {
                campus_id: data
            },
            // the php file we are going to be using
            url: '../application/map/getbuildings',
            //the type of response we are expecting is going to be json format
            dataType: 'json',
            //success function
            success: function (response) {
            	// if the response you are getting  is not no record
                if (response.result.length > 0) {
                	
                  	// loop through each result you are getting
                    for (var i = 0; i < response.result.length; i++) {
	                    //creating a variable called ltlg which is the response latitude and longitude
                        var ltlg = new google.maps.LatLng(response.result[i].latitude, response.result[i].longitude);
                        //calling the get rooms fucntion and passing the name, id , and the variable into it
                        getRooms(response.result[i].name, response.result[i].building_id, ltlg);
                    };// end of for loop
                }// end of if statement

            },// end of success function
            //error function
            error: function (error) {
                console.log("error ", error);
            }// end of error
        }); //end of ajax
    }; // end of getbuilding function


//////----------------------------------------------------- GET ROOMS  -------------------------------//////

    function getRooms(name, id,ltlg) { // performing ajax to get Rooms from the selected Buildings 
        $.ajax({
           	//using POST because we are tying to POST the information
            type: 'POST',
            // the data we are using is the building id
            data: {
                building_id: id
            },
            // the php file we are calling
            url: '../application/map/getrooms',
            //the type of data we are expecting back is in the json format
            dataType: 'json',
            //success function 
            success: function (response) {
	            // if the responses message is rooms
	            
                if (response.message = "rooms") {
                	//create a variable called html which is a ul with a class of room list
                    var html = "<ul class='roomList'>";
	                // looop through the results
                    for (var i = 0; i < response.result.length; i++) {
	                   // creating a variable called li which is a li with the results names
                       var li ="<li class='roomName'>"+response.result[i].name+"</li>";
                       // each time an li is created add it to the ul
                     	html += li;
                    }// end of for loop
                    // adding the end tag of the ul to the html variable
                    html += '</ul>';
                    //calling the create marker function and passing in name, position, id, buiilding, and the variable html which is the ul
                    createMarker(name, ltlg ,id, 'building', 20,html);   
                } else {
                   //there are no rooms
                }//end of else
            },// end of success
            //error message
            error: function (error) {
                console.log("error ", error);
            }//end of error message
        }); //end of ajax
    }; // end of getRooms function
    
    
//////----------------------------------------------------- SEARCH -------------------------------//////    
    
    
    function search(school,building,id,value){
	    
	    var html = '';
	    
	    if(school == ''){
   
		   $.ajax({
		   		type:'POST',
		   		data:{
			   		table: 'campus',
			   		value:value	
		   		},
		   		url:'../application/map/autosearch',
		   		dataType:'JSON',
		   		success: function(response){
			   		
			   		
					if(response.result != 'no record'){			   	
			   		
				   		for(var i = 0;i<response.result.length;i++){

					   		var p =  '<p id="'+response.result[i].id +'" class="searchResult gydus-well well well-small" data-lat="'+response.result[i].latitude+'" data-lng="'+response.result[i].longitude+'" data-type="school">'+response.result[i].name +'</p>';	
					   		html+=p;

				   		};
				   		
			   		}else{
					  	
					  	var p =  '<p class="well gydus-well well-small">'+response.result +'</p>';	
					  	html+= p
					};
						
				   		//$('#searchAutoComplete').removeClass('hide');
				   		$('#autocompletelist').html(html)
				   				
		   		},
		   		error:function(response){
		   			console.log(response)
			   		
		   		}   
		   });	    
		    		    
	    }else if(building == ''){
	    		    	
	    	$.ajax({
		   		type:'POST',
		   		data:{
			   		table: 'building',
			   		id:id,
			   		value:value	
		   		},
		   		url:'xhr/search.php',
		   		dataType:'JSON',
		   		success: function(response){
			   		
					if(response.result != 'no record'){			   	
			   		
				   		for(var i = 0;i<response.result.length;i++){

					   		var p =  '<p id="'+response.result[i].id +'" class="searchResult well gydus-well well-small" data-lat="'+response.result[i].latitude+'" data-lng="'+response.result[i].longitude+'" data-type="building">'+response.result[i].name +'</p>';	
					   		html+=p;

				   		};
				   		
			   		}else{
					  	
					  	var li =  '<p class="well well-small">'+response.result +'</p>';	
					  	html+= li
					};
						
				   		//$('#searchAutoComplete').removeClass('hide');
				   		$('#autocompletelist').html(html)
				   				
				},
				error:function(response){
		   			console.log(response)
			   		
		   		}   
		   });	  
	    	
		   
	    }else{
		    console.log('search','"',value,'"','in rooms table from',building,'in',school);
	    }
	    
	    
	    
	    
	    
    }
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*    
    
							        CCCC  			LL				IIIIIIIIIIIIIII  		CCCC         KKKK       KKK
							    CC       CC			LL					  III   	    CC       CC      KKKK      KKK
							    CC					LL					  III           CC               KKKK    KKK
							   CC					LL                    III          CC                KKKK  KKK
							   CC					LL					  III		   CC                KKKKK
							   CC					LL					  III		   CC                KKKK  KKK
							    CC					LL					  III			CC               KKKK   KKK
							    CC        CC		LL					  III			CC		 CC      KKKK    KKK
							       CCCCC			LLLLLLLLLLLL	IIIIIIIIIIIIIIII		CCCCC        KKKK     KKK 
*/							
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//////----------------------------------------------------- GPS -------------------------------//////

    $('#useGPS').click(function (e) { //enables the use of GPS and moved the user's marker to there location 

        if (navigator.geolocation) { //if geolocation is possible for user
        	// getting the current position of the user 
            navigator.geolocation.getCurrentPosition(function (position) { //on success
	            //setting the users lat to the lat position cordinate
                userLat = position.coords.latitude;
                //setting the users long to the long position cordinate
                userLong = position.coords.longitude;

                //creating a new position and passing the users locations (based off latitude and longitude)
                pos = new google.maps.LatLng(userLat, userLong);
                // dropping a marker to display users location on the map
                userMarker.setPosition(pos);
                //after the pin is dropped, then center the map based off their location
                map.setCenter(pos);
            }, function () {
                //when geolocation didn't work
                handleNoGeolocation(true);
            });
        } else {
            // Browser doesn't support Geolocation
            handleNoGeolocation(false);
        }
        return false;
    });

//////----------------------------------------------------- clicking on the addlocation button -------------------------------//////
    //clicking on the addlocation button
    $('#addLocation').click(function (e) {
    	// calling the addUserLocation and passing in the params, position of the marker created. 
        addUserLocation(userMarker.position);
        return false;
    });

//////----------------------------------------------------- LIST OF CAMPUS FROM GOOGLE -------------------------------//////

    // Modal is populated with schools from google that are in your location but not in the database .. they are put at the bottom of the modal.	

    function makeList(place) {
        // this makes an List of all the schools and adds them to the ul called Test list
        // starting a boolean that will be set to true
        // isHidden is going to hide the schools when the button says "add school"
        var isHidden = true;
        // the add school button is clicked
        $('#addBtnBlue').click(function (e) {
        	// if the is Hidden is true
            if (isHidden) {
            	//show all the school from google
                $('#schoolsPlusList').removeClass('hide');
                //change the text of the add school button to "hide list"
                $('#addBtnBlue').html('hide list')
                //making it hidden again
                isHidden = false;
                     
                $('<li id="placeNames" class="alert alert-success">' + place.name + '<i  class="icon-plus pull-right muted"></i></li>').appendTo('#schoolsPlusList')
                    .click(function (e) { // calling the ajax function when the button is clicked 
                    //the ajax function will send the school to the database
                    // calling the addCampus function and passing place into it
                    

                    addmyCampus(place); //on line 396
                    
                    // after the school you chose has been clicked and added to the database, it is then removed from the list of schools
                    $(this).remove();
                    
                });
            } else {
	            // if is hidden is false then
	            //hide the list of schools
                $('#schoolsPlusList').addClass('hide');
                //change the 'hide schools' back to 'add school'
                $('#addBtnBlue').html('Add School');
                isHidden = true;
            }// end of else statement
        })// end of clicking the "add school button" function
    };// end of makeList


//////----------------------------------------------------- LIST OF CAMPUS FROM DATABASE -------------------------------//////

    // Top part of the "add your school" modal
    // this will show the school you have chosen then will cause the modal to disspear
    function schoolsFromDB(place, dataDB) {
        // this makes a list of the school you have chosen from google, and then has a message saying "your school has been added"
        // the message saying "school has been added" will slowly fade in
        
        $('<li>' + place.name + '</li>').appendTo('#ourAddedList').click(function (e) {
            map.setZoom(17);
            pos = new google.maps.LatLng(place.geometry.location.Ya, place.geometry.location.Za);
            
            map.setCenter(pos);
            getBuildings(dataDB[0].id);
            $("#schoolModal").fadeOut('slow');
            addLocationLocalStorage(dataDB);
        });;

        $('<li><a href="#">' + dataDB[0].name + '</a></li>').prependTo('#favorites').click(function (e) {
           
           	$('#schoolCrumb').removeClass('hide').html(dataDB[0].name);               	

           	chosenSchool = {'name':dataDB[0].name,'id':dataDB[0].id};
           	

           	addLocationLocalStorage(dataDB[0]);

           	
            map.setZoom(17);
            pos = new google.maps.LatLng(dataDB[0].latitude,dataDB[0].longitude);
            map.setCenter(pos);

            getBuildings(dataDB[0].id);
        });

    };
//////----------------------------------------------------- LIST OF CAMPUS THAT YOU CHOOSE -------------------------------//////

    function makeAddedSchool(place, dataDB) {
    	
        // this makes a list of the school you have chosen from google, and then has a message saying "your school has been added"
        // the message saying "school has been added" will slowly fade in
        $('<li>' + place.name + '<span id="schoolAddedMSG" class="text-success gydus-block">School has been added</span></li>').fadeIn(
            "slow", function () {
            // the "school has been added" will then fade out
            $("#schoolAddedMSG").fadeOut(
                'slow', function () {
                // the "add your school" modal will then fade out and be removed from the DOM
                $("#schoolModal").fadeOut('slow');
            }).remove();
            // the school that you chose will then be added to ul "our added list" which is the top part of the " add your school" modal.		
        }).appendTo('#ourAddedList');
        // calling the local storage function
        addLocationLocalStorage(dataDB);
        //if your chosen school is hidden
        if ($("#chosenSchool").hasClass("hide")) {
        	// remove the class hide and make it appear
            $("#chosenSchool").removeClass("hide");
        } else {
        	// else if it isnt, then make it hidden again
            $("#chosenSchool").addClass("hide");
        }
        //populates the fav dropdown and click to zoom
    };// end of makeAddedSchools
    
    
//////----------------------------------------------------- ADDING CAMPUS TO LOCAL STORAGE -------------------------------//////

    //adding location to local storage
    function addLocationLocalStorage(dataDB) {
        if (localStorage) {
            //if local storage contains the chosen campus, then stringify
            localStorage.chosenCampus = JSON.stringify(dataDB);
            // then puts the name of the school inside the "your chosen school" that is the blue box on the top of the page
            $('<p>' + dataDB.name + '</p>').appendTo('#yourchosenSchool');
        }
        campus = dataDB;
    }

//////----------------------------------------------------- ADDING NEW BUILDING CLICK FUNCTION -------------------------------//////

    // if there is a school in the local storage, then the modal shouldnt show up
    //if there no school is in the local storage then the modal should show up
    function createSelectedLocation() {
    	// if there is local storage
        if (localStorage) {
        	// and if there is a chosen campus inside the local storage
            if (localStorage.chosenCampus) {
            	// then create a variable that will parse the choosen campus inside the local storage
                var data = JSON.parse(localStorage.chosenCampus);
              	// empty the paragraph tag that contains the choosen campus and adds it to the chosen school banner  
                $('<p>' + localStorage.chosenCampus.name + '</p>').empty().appendTo('#yourchosenSchool');
            } else {
            	// school modal shows up
                $("#schoolModal").removeClass("hide");
            }
        } else {
            //show modal
            $("#schoolModal").removeClass("hide");
        }
    }; // end of adding location to local storage


    // calling the createSelectedLocation function, no params are passed into it
    createSelectedLocation();

//////----------------------------------------------------- CLOSING SCHOOL MODAL -------------------------------//////

	// when you click on the close button "x"
    $('#closeSchoolModal').on('click', function () {
    	// hide the school modal
        $('#schoolModal').addClass("hide");
        return false;
    })
    
//////----------------------------------------------------- NAVIGATION  ADD NEW BUILDING BTN CLICK -------------------------------//////
	// clicking on the add building button 
    $('#navAddBuilding').on('click', function () {
    	// creating a variable which is the google maps marker image
        var image = new google.maps.MarkerImage(
        	// getting the image from the folder struct
	      'img/mapIcons/add-icon.png',
		    new google.maps.Size(32,37),
		    new google.maps.Point(0,0),
		    new google.maps.Point(16,37)
		 
		);
        // creating a variable called ADDBUILDINGmarker which is going to create a current location marker and getting
        	
        ADDBUILDINGMarker = new google.maps.Marker({ //create current location marker on the map
        	//setting properties for ADDBUILDINGmarker
        	//position is getting the position
            position: pos,
            map: map,
            //letting the user know that they can drag the marker
            title: 'drag me',
            // setting the marker to become draggable
            draggable: true,
            //setting the icon to be an image
            icon:image
        });
        
        //creating a new infowindow. Infowindow is the "details box" that shows up when you click on the icon
        infowindow = new google.maps.InfoWindow(); //create infowindow, this is called later to display the location details when clicked

        // adding an event listener to the marker
        google.maps.event.addListener(ADDBUILDINGMarker, 'click', function () { //add click function to open a dialog to display the marker's details
	        // we are adding an input field and a button so that when the user is ready to add the building they can add a name to the building
         
      
         
           infowindow.setContent("<form id='newbldgform'><label id='newBuildingsName'>"+'Name of the location'+"</label><input id="+'infoBoxInput'+" type="+'text'+" placeholder="+'name location'+"><button id="+'infoBoxBtn'+"  type="+'submit'+" class="+'btn'+">"+'Submit'+"</button></form>");
		  	infowindow.open(map, this);
            map.setZoom(17);
        });


        google.maps.event.addListener(ADDBUILDINGMarker, 'dragend', function () {
            // this is the drag function
           
        });
        return false;
    });

//////----------------------------------------------------- ADDING NEW BUILDING CLICK FUNCTION -------------------------------//////
	
    $('body').on('submit','#newbldgform', function () {
       var dragLng;
       var dragLat;
       
        google.maps.event.addListener(ADDBUILDINGMarker, 'dragend', function () {
        	
            dragLng = ADDBUILDINGMarker.getPosition().log();
            dragLat = ADDBUILDINGMarker.getPosition().lat();
        });
        var campusobject = JSON.parse(localStorage.chosenCampus);
        //var user = JSON.parse(localStorage.userObj);
        var newBuildingName = $("#infoBoxInput").val(); // getting the values of the input field
        var newBuildinglatitude = ADDBUILDINGMarker.getPosition().Ya; // getting the latitude value from the local storage
        var newBuildinglongitude = ADDBUILDINGMarker.getPosition().Za; // getting the longitude value from the local storage
       
        var newBuildingCampus_identify = campusobject.id; // getting the campus id from the local storage

       

        addNewBuilding(newBuildingName, newBuildinglatitude, newBuildinglongitude, newBuildingCampus_identify);
        return false;
    })

//////----------------------------------------------------- SHOW ALL SCHOOLS CLICK -------------------------------//////

// clicking the show all schools link from the drop down menu
// clicking this makes the school modal show 
    $('#showAllSchools').on('click', function () {
    	console.log('running');
        $("#schoolModal").removeClass('hide');
        return false;
    });
//////----------------------------------------------------- SHOW ADD ROOM CLICK -------------------------------//////

	// when the  show addroom button is clicked
	
    $('body').on('click','#showAddRoomBtn',function(){
	    
	   $('#addRoomForm').removeClass('hide'); 
	   $('#showAddRoomBtn').html('close');
	   return false;
    });
    
    $('#addRoomBtn').live('click',function(){
	 	$('#addRoomForm').addClass('hide');   
	 	$('#showAddRoomBtn').html('+');
	 	return false;
   	});
    
//////----------------------------------------------------- SCHOOL BREADCRUMBS -------------------------------//////
    
    // the bread crumbs are clickable
    // so when a user clicks on the school crumb
    $('#schoolCrumb').on('click', function(){
	    
	    //hiding the bread crumb
	    $('#schoolCrumb').addClass('hide');
	    //hiding the buidling bread crumb
	    $('#buildingCrumb').addClass('hide');
	    //setting what the maps zoom should be at
	    map.setZoom(16);
	    return false;
    });//END OF SCHOOL CRUMBS
//////----------------------------------------------------- BUILDING BREADCRUMBS -------------------------------//////
    
    //when the building crumb is pressed
    $('#buildingCrumb').on('click', function(){     
    
    	//hide the bread crumb
    	$('#buildingCrumb').addClass('hide');
    	//set the maps zoom 
    	map.setZoom(17);
    	return false;
    });// END OF BUILDING CRUMBS   	
    
//////--------------------------------------------------- AUTO COMPLETE -----------------------------------////////

	$('#searchBar').keyup(function(){
		
		$('#autocompletelist').removeClass('hide');
		
		if($('#schoolCrumb').hasClass('hide')){
			
			search('','','',$('#searchBar').val())
		}else if($('#buildingCrumb').hasClass('hide')){
			search(chosenSchool.name,'',chosenSchool.id,$('#searchBar').val());
		}else{
			//search(chosenSchool,chosenBuilding,'',$('#searchBar').val());
		}
		
	});

//////--------------------------------------------------- SEARCH FIELD BLUR  -----------------------------------////////
	
/*	$('#searchBar').blur(function(){
		
		$('#autocompletelist').html('');	
	}); */
	
//////--------------------------------------------------- AUTO COMPLETE BREADCRUMBS  -----------------------------------////////
	
	$('body').on('click','.searchResult',function(e){
				
		var tar = e.target,
			type = e.srcElement.dataset.type;
		
		
		if(type == 'school'){
			chosenSchool = {'name':e.srcElement.innerHTML,'id':tar.id};

			
			$('#schoolCrumb').removeClass('hide').html(chosenSchool.name);               	
			getBuildings(tar.id);


			
		}else if(type == 'building'){
           chosenBuilding = e.srcElement.innerHTML;

           
          
           $('#buildingCrumb').removeClass('hide').html(chosenBuilding);
            	

			
  			
		}
		
		map.setZoom(17);
        pos = new google.maps.LatLng(e.srcElement.dataset.lat,e.srcElement.dataset.lng);
        map.setCenter(pos);

        $('#autocompletelist').html('');
		return false;
	});	
    
});