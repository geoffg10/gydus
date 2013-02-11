<?php
	class loginModel{
		
		
		public function checkEmail($data){ //check email only
			$wildEmail = $data['email'].'%';
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "select user_email from users where user_email like :user_email";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":user_email"=>$wildEmail));
			$resultData = $st->fetchAll(); //get all responses
			$emails = array();
			
			foreach($resultData as $value){
				array_push($emails, $value);
			}
			return array('success'=>'emails searched', 'emails'=>$resultData);//$message = array('user emails'=>$emails);
		}
		
		public function checkUser($data){  //first step is to check if the email exists in the table
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "select * from users where user_email =:user_email";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":user_email"=>$data['email']));
			$resultData = $st->fetchAll(); //get all responses
			
			if($st->rowCount() > 0){ //if the email exists than 
				//there is a record
				$validateUser = $this->validateUser($data);
				return $validateUser;
			}else{
				$insertResult = $this->insertUser($data); //there isn't a record
				return $insertResult;
			}
			
		} //close check User
		public function checkUserPass($data){
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "SELECT id FROM users WHERE id = :id AND user_pass = :oldpass";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":id"=>$data['id'], ":oldpass"=>$data['oldpass']));
			$resultData = $st->fetchAll(); //get all responses
			
			if($st->rowCount() > 0){ //if the email exists than 
				//there is a record
				$updatePass = $this->changePass($data);
				return $updatePass;
			}else{
				return 'wrong password';
			}
		}
		private function changePass($data){
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "UPDATE users SET user_pass = :newpass WHERE id = :id";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":id"=>$data['id'], ":newpass"=>$data['newpass']));
			return 'password updated';
		}
		public function checkFBUser($data){
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "select * from users where fb_id =:fb_id";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":fb_id"=>$data['fb_id']));
			$resultData = $st->fetchAll(); //get all responses
			if($st->rowCount() > 0){ //if the email exists than 
				//there is a record
				return array('success'=>'logged in', 'userid'=>$resultData[0]['id']);
			}else{
				$insertResult = $this->insertFBUser($data); //there isn't a record
				return $insertResult;
			}
		}
		
		private function insertUser($data){  
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "INSERT INTO users(user_email, user_pass)values(:user_email, :password)";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":user_email"=>$data['email'], ":password"=>$data['password']));
			$id = $db->lastInsertId();
			$usermessage = array('success'=>'user added', 'userid'=>$id);
			return $usermessage;
		} //close insert user
		
		private function insertFBUser($data){  
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "insert into users(fb_id, fb_first_name, fb_middle_name, fb_last_name, fb_gender, fb_link, fb_locale, fb_name, fb_timezone, fb_updated_time, fb_username)values(:fb_id, :fb_first_name, :fb_middle_name, :fb_last_name, :fb_gender, :fb_link, :fb_locale, :fb_name, :fb_timezone, :fb_updated_time, :fb_username)";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":fb_id"=>$data['fb_id'], ":fb_first_name"=>$data['fb_first_name'], ":fb_middle_name"=>$data['fb_middle_name'], ":fb_last_name"=>$data['fb_last_name'], ":fb_gender"=>$data['fb_gender'], ":fb_link"=>$data['fb_link'], ":fb_locale"=>$data['fb_locale'], ":fb_name"=>$data['fb_name'], ":fb_timezone"=>$data['fb_timezone'], ":fb_updated_time"=>$data['fb_updated_time'], ":fb_username"=>$data['fb_username']));
			
			$id = $this->validateFBUser($data);
			return $id;
		} //close insertFB user
		
		private function validateFBUser($data){
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "select * from users where fb_id =:fb_id";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":fb_id"=>$data['fb_id']));
			$resultData = $st->fetchAll(); //get all responses
			
			
			if($st->rowCount() > 0){
				//there is a record
				return array('success'=>'logged in', 'userid'=>$resultData[0]['id']);
			}else{
				 //there isn't a record
				return array('success'=>"not found");
			}
		}//close validate user
		
		private function validateUser($data){
			$db = new \PDO("mysql:hostname=127.0.0.1;port=8889;dbname=aquilex", "root", "root");
			$sqlst = "select * from users where user_email =:user_email and user_pass = :password";
			$st = $db->prepare($sqlst);
			$results = $st->execute(array(":user_email"=>$data['email'], ":password"=>$data['password']));
			$resultData = $st->fetchAll(); //get all responses
			
			
			if($st->rowCount() > 0){
				//there is a record
				return array('success'=>'logged in', 'userid'=>$resultData[0]['id']);
			}else{
				 //there isn't a record
				return array('success'=>"password doesn't match");
			}
		}//close validate user
		
	}
?>