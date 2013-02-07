<?php
/**
  * Project Aquilex
  * @author  Renee Blunt <renee.blunt@gmail.com>
  * December 13, 2012
  *
  */
require("../models/UserModel.php");
/**
  * This class handles all of the logic for loggin in and account management 
  * it uses the UserModel for all DB calls
  */
Class UserController{
	private $userModel;
	public function __construct(){
		session_start();
		$this->userModel = new UserModel();
	}
	/**
      * fblogin method will check to see if the user already exists in the users table 
      * if the user exists than it will return the user_id
      * if the user doesn't exist than their row will be inserted and return the user_id
      *
      *
      * @return the following successful messages: user_added w/user_id, user_found w/user_id; fail messages: multiple_users, expecting $_POST[fb_id], use post
      */
	public function fblogin(){
		//
		
		
		if(isset($_POST)){
			// check to make sure that the variable being used is fb_id and that it is not empty
			if(isset($_POST['fb_id']) && $_POST['fb_id'] != ""){
				//check to see if the FB user exists in the user's table
				$checkFBUserResult = $this->userModel->checkFBUser($_POST);
				
				if(count($checkFBUserResult) === 0){
					//if the user doesn't exist it will run an insert and return the user_id	
					$insertFBUser = $this->userModel->insertFBUser($_POST);
					if($insertFBUser){
						$this->userModel->insertFBData($_POST);
					}
					loggedIn($insertFBUser);
					echo json_encode(array('message'=>'user_added', 'result'=>array('user_id'=>$insertFBUser)));
				}elseif(count($checkFBUserResult) === 1){
					//if there is one user it will return the user_id
					loggedIn($checkFBUserResult[0]['user_id'])
					echo json_encode(array('message'=>'user_found', 'result'=>array('user_id'=>$checkFBUserResult[0])));
				}else{
					//if there are multiple users than we have some bad data :(
					echo json_encode(array('message'=>'multiple_users', 'result'=>'no bueno'));
				}
			}else{
				// didn't get the expected datatype
				echo json_encode(array('message'=>'expecting $_POST[fb_id]'));
			}
		}else{
			// send message that we should be receiving a $_POST
			echo json_encode(array('message'=>'use post'));
		}
	}
	/**
      * searchEmail method is a wildcard search for email adresses that start with the user input 
      * 
      * uses $_POST
      * expecting ['email']
      *
      * @return array of emails in the users table
      */
	public function searchEmail(){
		if(isset($_POST)){
			//the email var is set and not empty
			if(isset($_POST['email']) && $_POST['email'] !=''){
				//search for the email using the email (uses a like keyword%)
				$searchEmailArray = $this->userModel->searchEmail($_POST);
				//this will return emails that match in an array, even array[0]
				echo json_encode(array('message'=>'email_search', 'result'=>$searchEmailArray));
			}else{
				echo json_encode(array('message'=>'["email"] must be set and not be empty'));
			}
		}else{
			// send message that we should be receiving a $_POST
			echo json_encode(array('message'=>'use post'));
		}
	}
	/**
      * userlogin method will check if the input email exists, if not it will insert the user into the users table
      *  if the user does exist then it will validate the email and password
      *
      * uses $_POST
      * expecting ['email'] and ["password"]
      *
      * @return the following successful messages: user_added w/user_id, validated w/user_id; fail messages: fail_validation, $_POST["email"] and $_POST["password"] must be set and not be empty, use post
      */
	public function userlogin(){
	
		if(isset($_POST)){
			//email and password must be set and not empty
			if(isset($_POST['email']) && isset($_POST['password']) && $_POST['email']!='' && $_POST['password'] !=''){
				//sha1 the password
				$_POST['password'] = sha1($_POST['password']);
				//first make sure the email exists
				$checkEmailExists = $this->userModel->checkUserEmailExists($_POST);
				
				//email doesn't exist so insert user
				if(count($checkEmailExists) === 0){
					//create account with existing post data
					$insertUser = $this->userModel->insertUser($_POST);
					$this->loggedIn($insertUser['user_id']);
					echo json_encode(array('message'=>'user_added'));
				
					
				}elseif(count($checkEmailExists) === 1){ //there is one match for email user_id, now check password
					
					$validatePassword = $this->userModel->validateUser($_POST);
					
					if(count($validatePassword) === 1){ //pass matches
						//send the user_id // for testing, should set it to session
						$this->loggedIn($validatePassword[0]['user_id']);
						echo json_encode(array('message'=>'validated'));
						
					}else{
						//password didn't match
						echo json_encode(array('message'=>'fail_validation', 'result'=>"password doesn't match"));
						}
					
				}else{
					//if there are multiple users than we have some bad data :(
					echo json_encode(array('message'=>'multiple_users', 'result'=>'no bueno'));	
				}
				
			}else{
				echo json_encode(array('message'=>'$_POST["email"] and $_POST["password"] must be set and not be empty'));
			}
		}else{
			echo json_encode(array('message'=>'use post'));
		}		
	}
	/**
      * updatepass method will check if the old password matches the user account first
      *  if the account matches the password will be updated
      *
      * uses $_POST, and $_SESSION
      * expecting ['oldpass'] ['newpass'] ['id']
      *
      * @return a successful message: update_password; fail messages: not_successful, invalid_password, $_POST["oldpass"] and $_POST["newpass"] must be set and not be empty, use post
      */	
	public function updatepass(){
		if(isset($_POST)){
			//oldpass and newpass must be set and not be empty
			if(isset($_POST['oldpass']) && isset($_POST['newpass']) && $_POST['oldpass']!='' && $_POST['newpass']!=''){
				//sha1 both passwords and set post[id] to the session id
				$_POST['newpass'] = sha1($_POST['newpass']);
				$_POST['oldpass'] = sha1($_POST['oldpass']);
				
				$_POST['id'] = $_SESSION['user_id']; //make this the session
				
				$checkpass = $this->userModel->checkUserPass($_POST);
				
				if(count($checkpass) === 1){//old password matches current account, now update it
					$updatepass = $this->userModel->changePass($_POST); //returns a true false
					
					if($updatepass){ //if successful
						echo json_encode(array('message'=>'update_password', 'result'=>'password updated'));
					}else{//oh no there was an error!
						echo json_encode(array('message'=>'not_successful', 'result'=>'issue with update'));
					}
				}else{
					echo json_encode(array('message'=>'invalid_password', 'result'=>'try old password again'));
				}
			}else{
				echo json_encode(array('message'=>'$_POST["oldpass"] and $_POST["newpass"] must be set and not be empty'));
			}
		}else{
			echo json_encode(array('message'=>'use post'));
		}		
	}
	/**
      * loggedIn is a private method will create user_id in the current session upon a successful login or user creation
      *  
      *
      * 
      * expecting no datatype but should be an int
      *
      * @return none
      */
	private function loggedIn($id){
		
		$_SESSION['user_id'] = $id;
	}
	/**
      * logout method will unset the user_id in the session
      *  
      *
      * @return json message logged_out
      */
	public function logout(){
		
		if(isset($_SESSION['user_id'])){
			session_unset($_SESSION['user_id']);
		}
		echo json_encode(array('message'=>'logged_out'));
	}
	/** TODO
      * deleteaccount method will disable the user in the DB
      *  
      *
      * @return json message success
      */
	public function deleteaccount(){

	}
}
?>