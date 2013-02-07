<?php

class controllerModel{
	
	public function getController($pagename=''){
		require_once("controllers/".$pagename.".php");
		}	
}
?>