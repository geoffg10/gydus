<?php
/**
  * Project Aquilex
  * @author  Renee Blunt <renee.blunt@gmail.com>
  * December 13, 2012
  *
  */
require("../models/MapModel.php");
/**
  * This class handles all of the logic for map data
  * it uses the MapModel for all DB calls
  */
Class MapController{
	
	private $mapModel;
	
	public function __construct(){
		session_start();
		$this->mapModel = new MapModel();
	}
	/**
      * index method loads the pages to make the site work
      * 
      * TODO find out why that break tag is needed to show the map
      *
      *
      * 
      */		
	public function index(){ //instantiate views
		echo "<br/>";
		include('../views/header.html');
		include('../views/map.html');
		include('../views/googleFooter.html');
	}
	/**
      * getallcampuses method will get all of the campuses in the campus table
      *  
      * uses $_GET
      * 
      * @return an array of campuses
      */
	public function getallcampuses(){
		if(isset($_GET)){
			$campuses = $this->mapModel->getAllCampuses($_GET);
	
	echo json_encode(array('message'=>'all_campuses', 'result'=>$campuses));
		}else{
			echo json_encode(array('message'=>'use get'));
		}
	}
	/**
      * getcampuses method will get all campuses in the DB by the google_id
      *
      * uses $_POST
      * expecting ['google_id']
      *
      * @return a successful message: campus // id, name, latitude, longitude, google_id, type; fail messages: $_POST["google_id"] must be set and not be empty, use post
      */		
	public function getcampuses(){
		if(isset($_POST)){
			if(isset($_POST["google_id"]) && $_POST["google_id"] != ''){
				$campuses = $this->mapModel->getCampuses($_POST);
				echo json_encode(array('message'=>'campuses', 'result'=>$campuses));
			}else{
				echo json_encode(array('message'=>'$_POST["google_id"] must be set and not be empty'));
			}
		}else{
			echo json_encode(array('message'=>'use post'));
		}
	}
	/**
      * getbuildings method will get all campuses in the DB by the campus_id
      *
      * uses $_POST
      * expecting ['campus_id']
      *
      * @return a successful message: buildings // id, name, latitude, longitude, campus_id; fail messages: $_POST["campus_id"] must be set and not be empty, use post
      */
	public function getbuildings(){
		if(isset($_POST)){
			if(isset($_POST['campus_id']) && $_POST['campus_id']!=''){
				$buildings = $this->mapModel->getBuildings($_POST);
				echo json_encode(array('message'=>'buildings', 'result'=>$buildings));
			}else{
				echo json_encode(array('message'=>'$_POST["campus_id"] must be set and not be empty'));
			}
		}else{
			echo json_encode(array('message'=>'use post'));
		}

	}
	/**
      * getrooms method will get all campuses in the DB by the campus_id
      *
      * uses $_POST
      * expecting ['building_id']
      *
      * @return a successful message: rooms // id, name, latitude, longitude, building_id, type; fail messages: $_POST["building_id"] must be set and not be empty, use post
      */
	public function getrooms(){
		if(isset($_POST)){
			if(isset($_POST['building_id']) && $_POST['building_id']!=''){
				$rooms = $this->mapModel->getRooms($_POST);
				echo json_encode(array('message'=>'rooms', 'result'=>$rooms));			
			}else{
				echo json_encode(array('message'=>'$_POST["building_id"] must be set and not be empty'));
			}
	
		}else{
			echo json_encode(array('message'=>'use post'));
	
		}
		
	}
	/**
      * addcampus method will add a campus using the data from google places
      *
      * uses $_POST
      * expecting campus_id, latitude, longitude, name, added_by_id
      *
      * @return a successful message: campus_added with the campus_id; fail messages: campus_exists, duplicate_campuses, $_POST["name"], $_POST["longitude"], $_POST["latitude"], $_POST["google_id"] all need to be set and not empty, use post
      */	
	public function addcampus(){
		if(isset($_POST)){
			if(isset($_POST['name']) && isset($_POST['longitude']) && isset($_POST['latitude'])  && isset($_POST['google_id']) && $_POST['name']!='' && $_POST['longitude']!='' && $_POST['latitude']!='' && $_POST['google_id']!=''){
				
				// first check to see if the capus exists in the campus table
				$capuses = $this->mapModel->getCampuses($_POST);
				
				if(count($capuses) == 1){ //campus exists, no insert
					echo json_encode(array('message'=>'campus_exists', 'result'=>'campus already exists'));
				}elseif(count($capuses) == 0){ //campus doesn't exist so insert
					$insertCampus = $this->mapModel->addCampus($_POST);
					echo json_encode(array('message'=>'campus_added', 'result'=>array('campus_id'=>$insertCampus)));
				}else{
					//if there are duplicate campuses than we have some bad data :(
					echo json_encode(array('message'=>'duplicate_campuses', 'result'=>'no bueno'));
				}
			}else{
				echo json_encode(array('message'=>'$_POST["name"], $_POST["longitude"], $_POST["latitude"], $_POST["google_id"] all need to be set and not empty'));
			}
			
		}else{
			echo json_encode(array('message'=>'use post'));
		}
		
	}
	/**
      * addbuilding method will add a building using the data from google maps
      *
      * uses $_POST and $_SESSION
      * user must be logged in to add a building
      * expecting building_id, latitude, longitude, name, added_by_id //added_by_id is done by the session
      *
      * @return a successful message: building_added with the building_id; fail messages: must_log_in, duplicate_campuses, $_POST["name"], $_POST["longitude"], $_POST["latitude"],$_POST["campus_id"] all need to be set and not empty, use post
      */
	public function addbuilding(){
		if(isset($_SESSION['user_id'])){
			if(isset($_POST)){
				if(isset($_POST['name']) && isset($_POST['longitude']) && isset($_POST['latitude']) && isset($_POST['campus_id']) && $_POST['name']!='' && $_POST['longitude']!='' && $_POST['latitude']!='' && $_POST['campus_id']!=''){
					
					
					$_POST['added_by_id'] = $_SESSION['user_id'];
					$insertBuilding = $this->mapModel->addBuilding($_POST);
					
					echo json_encode(array('message'=>'building_added', 'result'=>array('building_id'=>$insertBuilding)));
				}else{
					echo json_encode(array('message'=>'$_POST["name"], $_POST["longitude"], $_POST["latitude"],$_POST["campus_id"] all need to be set and not empty'));
				}
				
			}else{
				echo json_encode(array('message'=>'use post'));
			}	
		}else{
			echo json_encode(array('message'=>'must_log_in'));
		}
		
	}
	/**
      * addbuilding method will add a room using the data from google maps
      *
      * uses $_POST and $_SESSION
      * user must be logged in to add a room
      * expecting building_id, latitude, longitude, name, added_by_id //added_by_id is done by the session
      *
      * @return a successful message: room_added with the room_id; fail messages: must_log_in, $_POST["name"], $_POST["longitude"], $_POST["latitude"],$_POST["building_id"] all need to be set and not empty, use post
      */
	public function addroom(){
		if(isset($_SESSION['user_id'])){
			if(isset($_POST)){
				if(isset($_POST['name']) && isset($_POST['longitude']) && isset($_POST['latitude']) && isset($_POST['building_id']) && $_POST['name']!='' && $_POST['longitude']!='' && $_POST['latitude']!='' && $_POST['building_id']!=''){
					
					
					$_POST['added_by_id'] = $_SESSION['user_id'];
					$insertroom = $this->mapModel->addBuilding($_POST);
					
					echo json_encode(array('message'=>'room_added', 'result'=>array('room_id'=>$insertroom)));
				}else{
					echo json_encode(array('message'=>'$_POST["name"], $_POST["longitude"], $_POST["latitude"],$_POST["building_id"] all need to be set and not empty'));
				}
				
			}else{
				echo json_encode(array('message'=>'use post'));
			}	
		}else{
			echo json_encode(array('message'=>'must_log_in'));
		}
		
	}
	/**
      * autosearch method is used for the autosearch it will return an array of schools from the database that match keywords starting with 
      * uses the LIKE in mySQL
      *
      * uses $_POST
      * expecting ['value'] for the search and ['table'] is used to determine which table to search for
      *
      * @return a successful message: 'search School', 'search Building', 'search Room' //successful returns inlcude an array of campus data; fail messages: TODO
      */
	public function autosearch(){
		if(isset($_POST) && isset($_POST['table'])){
			if($_POST['table'] == 'campus'){
		
				$locations = $this->mapModel->searchSchools($_POST);
				
				echo json_encode(array('message'=>'search School', 'result'=>$locations));
		
			}else if($_POST['table'] == 'building'){
			
				$locations = $this->mapModel->searchBuildings($_POST);
				
				echo json_encode(array('message'=>'search Building', 'result'=>$locations));
		
				
			}else if($_POST['table'] == 'rooms'){  //we'll use this later
				$locations = $this->mapModel->searchRooms($_POST);
				
				//echo json_encode(array('message'=>'search', 'result'=>$locations,'post'=>$_POST));
				echo json_encode(array('message'=>'search Room', 'result'=>'SORRY! This Functionally is still being worked on'));
				
				
			}			

		}
	}
}
?>