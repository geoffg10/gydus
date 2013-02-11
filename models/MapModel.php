<?php
/**
  * Project Aquilex
  * @author  Renee Blunt <renee.blunt@gmail.com>
  * December 13, 2012
  *
  */
  
require('../core/Database.php');

/**
  * This class handles all of the the CRUD calls for the maps locations
  * it handles campuses, buildings, and rooms
  */
Class MapModel extends Database{
	/**
      * getCampuses method will get all campuses that have been saved
      *	in the database by the google id
      *
      * @param associative array $data is expecting the google_id
      *
      * @return associative array of all campuses in the database with campus_id, latitude, longitude, google_id, type
      */
	public function getAllCampuses(){
		$sqlst = "SELECT c.id, c.name, c.latitude, c.longitude, c.google_id, ct.type FROM campuses c LEFT JOIN campus_types ct on(c.campus_type_id = ct.id)";
		$st = $this->db->prepare($sqlst);
		$st->execute();
		return $st->fetchAll();
	}
	/**
      * getCampuses method will get all campuses that have been saved
      *	in the database by the google id
      *
      * @param associative array $data is expecting the google_id
      *
      * @return associative array of all campuses in the database with campus_id, latitude, longitude, google_id, type
      */
	public function getCampuses($data){
		$sqlst = "SELECT c.id, c.name, c.latitude, c.longitude, c.google_id, ct.type FROM campuses c LEFT JOIN campus_types ct on(c.campus_type_id = ct.id) WHERE google_id = :google_id";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":google_id"=>$data['google_id']));
		return $st->fetchAll();
	}
	/**
      * getBuildings method will get all buildings that have been saved
      *	in the database by the campus id
      *
      * @param associative array $data is expecting the campus_id
      *
      * @return associative array of all buildings in the database with building_id, campus_id, latitude, longitude, and name
      */
	public function getBuildings($data){
		$sqlst = "SELECT b.id AS building_id, b.campus_id, b.latitude, b.longitude, b.name
					FROM buildings b
					WHERE campus_id = :campus_id";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":campus_id"=>$data['campus_id']));
		return $st->fetchAll(); //get all responses
	}
	/**
      * getRooms method will get all rooms that have been saved
      *	in the database by the building id
      *
      * @param associative array $data is expecting the building_id
      *
      * @return associative array of all rooms in the database with room_id, building_id, latitude, longitude, name, and type
      */
	public function getRooms($data){
		$sqlst = "SELECT r.id AS room_id, r.building_id, r.latitude, r.longitude, r.name, rt.type
						FROM rooms r
						LEFT JOIN room_types rt on (r.room_type_id = rt.id)
						WHERE building_id = :building_id";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":building_id"=>$data['building_id']));
		return $st->fetchAll(); //get all responses
	}
	/**
      * addCampus method will add a campus to the campuses table
      *	
      *
      * @param associative array $data is expecting the name, longitude, latitude, added_by_id, and google_id
      *
      * @return associative array of campus_id
      */
	public function addCampus($data){
		$sqlst = "INSERT INTO campuses(name, longitude, latitude, google_id)VALUES(:name, :longitude, :latitude, :google_id)";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":name"=>$data['name'],":longitude"=>$data['longitude'], ":latitude"=>$data['latitude'], ":google_id"=>$data['google_id']));
		$id = $this->db->lastInsertId();
		return $id;
	}
	/**
      * addBuilding method will add a building to the buildings table
      *	
      *
      * @param associative array $data is expecting the campus_id, latitude, longitude, name, added_by_id
      *
      * @return associative array of building_id
      */
	public function addBuilding($data){
		$sqlst = "INSERT INTO buildings (campus_id, latitude, longitude, name, added_by_id) VALUES(:campus_id, :latitude, :longitude, :name, :added_by_id)";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":name"=>$data['name'],":longitude"=>$data['longitude'], ":latitude"=>$data['latitude'], ":added_by_id"=>$data['added_by_id'], ":campus_id"=>$data['campus_id']));
		$id = $this->db->lastInsertId();
		return $id;		
	}
	/**
      * addRoom method will add a room to the rooms table
      *	
      *
      * @param associative array $data is expecting the building_id, latitude, longitude, name, added_by_id
      *
      * @return associative array of building_id
      */
	public function addRoom($data){
		$sqlst = "INSERT INTO rooms (building_id, latitude, longitude, name, added_by_id) VALUES(:building_id, :latitude, :longitude, :name, :added_by_id)";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":building_id"=>$data['building_id'], ":latitude"=>$data['latitude'], ":longitude"=>$data['longitude'], ":name"=>$data['name'], ":added_by_id"=>$data['added_by_id']));
		$id = $this->db->lastInsertId();
		return $id;		
	}
	/**
      * searchSchools method will search for schools beginning with the searchVal, wildcard search
      *	
      *
      * @param associative array $data is expecting the value
      *
      * @return associative array of campuses
      */
	public function searchSchools($data){
		$searchVal = $data['value'].'%';
		$sqlst = "SELECT * FROM campuses WHERE name LIKE :v";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":v"=>$searchVal));
		return $st->fetchAll();
	}	
	/**
      * searchBuildings method will search for schools beginning with the searchVal, wildcard search
      *	
      *
      * @param associative array $data is expecting the value
      *
      * @return associative array of buildings
      */	
	public function searchBuildings($data){
		$searchVal = $data['value'].'%';
		$sqlst = "SELECT * FROM buildings WHERE campus_id = :id and name LIKE :v";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":id"=>$data['id'],":v"=>$searchVal));
		return $st->fetchAll();
	}
}
?>