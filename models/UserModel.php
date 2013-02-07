<?php
/**
  * Project Aquilex
  * @author  Renee Blunt <renee.blunt@gmail.com>
  * December 13, 2012
  *
  */
require('../core/Database.php');

/**
  * This class handles all of the the CRUD calls for the user 
  * it handles email and facebook 
  */
Class UserModel extends Database{
	/**
      * searchEmail method will use a wildcard param to get like emails
      *	like emails will match the user input to the beginning of the email value only
      *
      * @param associative array $data is expecting the email variable
      *
      * @return array of all emails that match the wildcard value
      */
	public function searchEmail($data){ //check email only
		$wildCardEmail = $data['email'].'%'; //create the wildcard variable
		$sqlst = "SELECT user_email FROM users WHERE user_email LIKE :email";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":email"=>$wildCardEmail));
		return $st->fetchAll();
	}
	/**
      * checkUserEmailExists method will check to see if a given email exists in the users table 
      *	like emails will match the user input to the beginning of the email value only
      *
      * @param associative array $data is expecting the email
      *
      * @return either a user_id or a false or a 0
      */
	public function checkUserEmailExists($data){ 
		$sqlst = "SELECT id AS user_id FROM users WHERE user_email = :user_email";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":user_email"=>$data['email']));
		return $st->fetchAll();
			
	}
	public function insertUser($data){
		$sqlst = "INSERT INTO users(user_email, user_pass)VALUES(:user_email, :user_pass)";
		$st = $this->db->prepare($sqlst);
		$results = $st->execute(array(":user_email"=>$data['email'], ":user_pass"=>$data['password']));
		
		return $this->db->lastInsertId();
	}
	/**
      * validateUser method will validate that the given password matches the password in the DB for the provided email
      *	
      *
      * @param associative array $data is expecting the email and password
      *
      * @return an associative array of the user_id will be returned
      */
	public function validateUser($data){
		$sqlst = "SELECT id AS user_id FROM users WHERE user_email =:user_email AND user_pass = :password";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":user_email"=>$data['email'], ":password"=>$data['password']));
		return $st->fetchAll();
	}
	/**
      * checkUserPass method will validate that the given password matches the password in the DB for the provided email
      *	
      *
      * @param associative array $data is expecting the email and password
      *
      * @return an associative array of the user_id will be returned
      */
	public function checkUserPass($data){
		$sqlst = "SELECT id AS user_id FROM users WHERE id = :id AND user_pass = :oldpass";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":id"=>$data['id'], ":oldpass"=>$data['oldpass']));
		return $st->fetchAll();
	}
	/**
      * changePass method will update the user's password where the id matches
      *	this should only be called in current session or if previous password has been verified
      *
      * @param associative array $data is expecting the id of the user
      *
      * @return boolean, if success returns true
      */
	public function changePass($data){
		$sqlst = "UPDATE users SET user_pass = :newpass WHERE id = :id";
		$st = $this->db->prepare($sqlst);
		$result = $st->execute(array(":id"=>$data['id'], ":newpass"=>$data['newpass']));
		return $result;
	}
	/**
      * checkFBUser method will check to see if the FB user already exists in the user table
      *	
      *
      * @param associative array $data is expecting the fb_id (face book id) of the user
      *
      * @return associative array of the id of the user_id
      */
	public function checkFBUser($data){
		$sqlst = "SELECT id AS user_id FROM users WHERE fb_id =:fb_id";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":fb_id"=>$data['fb_id']));
		return $st->fetchAll();
	}
	/**
      * insertFBUser method will insert the FB user data into the users table
      *	
      *
      * @param associative array $data is expecting the fb_id user data as follows
      * fb_id, fb_first_name, fb_middle_name, fb_last_name, fb_gender, fb_link, fb_locale, fb_name, fb_timezone, fb_updated_time, fb_username
      *
      * @return associative array of the id of the user_id
      */
	public function insertFBUser($data){
		$sqlst = "INSERT INTO users(fb_id)VALUES(:fb_id)";
		$st = $this->db->prepare($sqlst);
		$results = $st->execute(array(":fb_id"=>$data['fb_id']));
		
		return $this->db->lastInsertId();
	}
	/**
      * insertFBUser method will insert the FB user data into the users table
      *	
      *
      * @param associative array $data is expecting the fb_id user data as follows
      * fb_id, fb_first_name, fb_middle_name, fb_last_name, fb_gender, fb_link, fb_locale, fb_name, fb_timezone, fb_updated_time, fb_username
      *
      * @return associative array of the id of the user_id
      */
	public function insertFBData($data){
		$sqlst = "INSERT INTO users(fb_id, fb_first_name, fb_middle_name, fb_last_name, fb_gender, fb_link, fb_locale, fb_name, fb_timezone, fb_updated_time, fb_username)VALUES(:fb_id, :fb_first_name, :fb_middle_name, :fb_last_name, :fb_gender, :fb_link, :fb_locale, :fb_name, :fb_timezone, :fb_updated_time, :fb_username)";
		$st = $this->db->prepare($sqlst);
		$results = $st->execute(array(":fb_id"=>$data['fb_id'], ":fb_first_name"=>$data['fb_first_name'], ":fb_middle_name"=>$data['fb_middle_name'], ":fb_last_name"=>$data['fb_last_name'], ":fb_gender"=>$data['fb_gender'], ":fb_link"=>$data['fb_link'], ":fb_locale"=>$data['fb_locale'], ":fb_name"=>$data['fb_name'], ":fb_timezone"=>$data['fb_timezone'], ":fb_updated_time"=>$data['fb_updated_time'], ":fb_username"=>$data['fb_username']));
		
		return $results;
	}
	/**
      * validateFBUser method get the Fb user from the users table by the facebook id
      *	
      *
      * @param associative array of fb_id
      *
      * @return associative array of the user data: id, fb_id, fb_first_name, fb_middle_name, fb_last_name, fb_gender, fb_link, fb_locale, fb_name, fb_timezone, fb_updated_time, fb_username
      */
	private function validateFBUser($data){
		$sqlst = "SELECT * FROM users WHERE fb_id =:fb_id";
		$st = $this->db->prepare($sqlst);
		$st->execute(array(":fb_id"=>$data['fb_id']));
		return $st->fetchAll();
	}
	
}
?>