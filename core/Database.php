<?php
	Class Database{
	
		protected $db = NULL;
		
		public function __construct(){
		
			$this->db = new \PDO("mysql:hostname=".DB_DSN_HOSTNAME.";port=".DB_PORT.";dbname=".DB_NAME, DB_USERNAME, DB_PASSWORD);
			//this line makes sure you get only the column names and not both column names and array index
			$this->db->setAttribute(\PDO::ATTR_DEFAULT_FETCH_MODE, \PDO::FETCH_ASSOC);
			$this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_SILENT);
			
		}
	}
?>