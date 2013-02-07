<?php
	//load the Settings
	require("Settings.php");
	
	//the url that was called
	$url = $_SERVER["REQUEST_URI"];
	
	//split on the quetion mark if there is one
	//removes the get variable
	$url = preg_split("/[?]/", $url);
	
	//remove ending slash
	$url = substr($url[0], 1);
	
	//put into an array all the pieces
	$url = explode("/", $url);
	
	//create base url variable
	$base_url = '';
	
	//see if host name is in the server variable
	if($_SERVER['HTTP_HOST']){
		
		// add the protocol and the host name to the base url
		$base_url .= "http://".$_SERVER['HTTP_HOST'];
	}
	
	// see if script name is in the server variable
	if($_SERVER['SCRIPT_NAME']){
		
		//add the directory to the base url
		$base_url .= str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
	}
	
	//make sure there is an ending slash and then return it
	$base_url = rtrim($base_url, '/').'/';
	
	// get the base directory and put it into an array
	$baseDir = preg_split("[/]", $base_url);
	
	//variable for the request that was made
	$request = array();
	
	//compare the base and the url
	foreach($url as $string){
		
		//check if hte string is in the base, if not
		if(!in_array($string, $baseDir)){
			
			//push the string in the request
			array_push($request, $string);
		}
	}
	

	
	if(!isset($request[0])){
		$request[0] = "Map";
		$request[1] = "index";
	}
	
	//file name of our controller
	$controllerName = ucfirst($request[0]."Controller");
	
	// include the controller
	include("../controllers/$controllerName.php");
	
	// instantiate the controller
	$controller = new $controllerName;
	
	// call the method
	$controller->$request[1]();
?>