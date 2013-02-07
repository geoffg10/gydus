/* 
	Author: Renee Blunt
	Date: December 7, 2012
	Project: MDD - Aquilex
	Project co-auth: Geoffrey Ganga, Jarvis Jardin

	The below code is used for logout and login
	This inlcudes the fbapi for login

*/
$(document).ready(function(){
	var loginView = $("#aquilex-login");
	var userObj = {};
	var fbObj={};
	

//////-----------------------------------------------------  CHECK LOGIN STATE  -------------------------------//////
/*
	run this at any successful login/logout to change the navigation options
*/
	function loginState() {  
	
		var settings = $('#dropDown-settings');
		var login = $('#dropDown-login');
	
		if(settings.hasClass('hide')){
			$('#dropDown-settings').removeClass('hide');
			$('#dropDown-login').addClass('hide');
		}else{
			$('#dropDown-login').removeClass('hide');
			$('#dropDown-settings').addClass('hide');
		}
	}

	
//////-----------------------------------------------------  INIT FB API  -------------------------------//////	
	FB.init({ 
		oauth		: true,
		appId      : '121346758027063', // App ID
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

//////-----------------------------------------------------  INIT FB API  -------------------------------//////	
/*
	gets the user's fb profile picture
    this runs after the storinfo() upon a successful login

*/
    function getImage() {  
	    FB.api("/"+fbObj.username+"/picture", function(imgData){
			fbObj.picture = imgData.data.url; //update the fbObj with the picture url
			if(localStorage){
				localStorage.fbObject = JSON.stringify(fbObj.name); //update local storage with new data
			}
		});
    };
    
    //storeinfo is called on a fblogin click
    //this function will log the user in with FB 
    //it checks to see if the user exists in the DB and if they do it returns the user's id
    //if the user already exists it returns the user's id
    // users FB data is added to the fbObject for localStorage
    function storeFBinfo() {  //this happens when the user clicks the sign in with FB option
		FB.login(function(response){
			if(response.authResponse){
				
				FB.api("/me",function(data){
					fbObj = data; //set global fbObj to true so the change password option can be hidden
					//login to the DB, this will check if the user exists
					//if the user exists than the userid is returned, 
					//it will register the user if they do not exist and will return the created userid
					
					$.ajax({
						type:'POST', 
						url: '../application/user/fblogin',
						data:{
							fb_id:			data.id,
							fb_first_name:	data.first_name || '',
							fb_middle_name:	data.middle_name || '',
							fb_last_name:	data.last_name || '',
							fb_gender:		data.gender || '',
							fb_link:		data.link || '',
							fb_locale:		data.locale || '',
							fb_name:		data.name || '',
							fb_timezone:	data.timezone || '',
							fb_updated_time: data.updated_time || '',
							fb_username: 	data.username || ''
						}, 
						dataType: 'json',
						success: function(response) {
							/*
								user_added and user_found will change the naviation state
								user_added will show a success message
							*/
							if(response.message == 'user_added'){
								loginState();
								loginView.hide("slow",function(){
									$("#active-account").fadeIn().delay(2000).fadeOut();
								});
							}else if(response.message == 'user_found'){
								loginState();
								loginView.addClass("hide");
							}else{
								//something went wrong
							}
					    },error: function(errorResponse) {  
						    //console.log(errorResponse);
						    console.log("errorResponse ",errorResponse);
						    
				    }});
				    //this will get the user's fb profile image to use in the frontend if wanted
				    getImage();
					
				});//close fblogin ajax call
		}else{
				console.log('not authorized');
			}
		});
				
	}; //close storeFBinfo()
//////----------------------------------------------------- LOGOUT USER IN SESSION  -------------------------------//////		
/*
	upon success calls the loginState() which will change the navigation
*/
	function logoutSession() {  
		$.ajax({
			type:'POST', 
			url: '../application/user/logout',
			dataType: 'json',
			success: function(response) {
				// do something with 
				loginState();
		    },error: function(data) {  
			    //console.log(data);
		}});
	}

//////----------------------------------------------------- NOT IN USE -- can use it for autocomplete in the email field  -------------------------------//////	    
    //checks the email when the input field loses focus
    //can change the text when the email is found
	$('input[name="email"]').focusout(function(e){
	
		//console.log($(this).val());
		$.ajax({
			type:'POST', 
			url: '../application/user/searchEmail', 
			data:{
				email: $(this).val()
			}, 
			dataType: 'json',
			success: function(response) {
				// do something with 
				if(response.message == "email_search"){
					//do something with foreach result[i]user_email
				}
		    },error: function(data) {  
			    //console.log(data);
		    }});
	});

//////----------------------------------------------------- click function  Start FB Login   -------------------------------//////		
	
	$('#fbLogin').click(function(e) {  
		//login with FB
		storeFBinfo();
	});
	
	
//////----------------------------------------------------- click function LOGOUT  -------------------------------//////	
	$('#logout').click(function(e) {  
		
		if(localStorage){
			if(localStorage.fbObject){
				FB.logout(function(response){
					console.log("you've logged out ",response);
				});
			}
			localStorage.clear();
		}
		//logoutSession will logout the user and change the navigation
		logoutSession();
		return false;
	});


//////----------------------------------------------------- submit EMAIL LOGIN -------------------------------//////	
	$('#login').submit(function(e) {
		
		$.ajax({
			type:'POST', 
			url: '../application/user/userlogin', 
			data:$(this).serialize(), 
			dataType: 'json',
			success: function(response) {
				/*
					user_added and validated will change the naviation state
					user_added will show a success message
					TODO show error messages on fail_validation
				*/
			
				if(response.message=="user_added"){ //user has been added, display a success message
					//user created
					loginState();
					loginView.hide("slow",function(){
						$("#active-account").fadeIn().delay(2000).fadeOut();
					});
				}else if(response.message=="validated"){ //user has been validated, no message
					//user validated
					loginState();
					loginView.addClass("hide");
				}else if(response.message=="fail_validation"){ //TODO needs a validation error message
					//failed password validation
				}else{
					//wrong or empty variables, didn't use post
				}
		    },error: function(data) {  
			    console.log(data);
		    }});//end ajax
		return false;
	 }); //close submit login

//////----------------------------------------------------- submit CHANGE PASSWORD  -------------------------------//////		 
	 /*
	 	changes the user password
	 	TODO - hide for FB users logged in
	 */
	 $('#changepass').submit(function(e){
		 
		 var oldpass = $('input[name=oldpass]'),
		 	newpass = $('input[name=newpass]')
		 	;
	 	
		 $.ajax({
			type:'POST', 
			url: '../application/user/updatepass',  
			data:{
				oldpass: oldpass.val(),
				newpass: newpass.val()
			}, 
			dataType: 'json',
			success: function(response) {
				console.log(response);
				/*
					check the responses
					if invalid show error message
					if updated then show success message and clear fields
				*/
				
				if(response.message == "invalid_password"){ 
					$("#changepass .control-group").addClass('error alert alert-error').find('span').removeClass('hide');
				}
				if(response.message == "update_password"){ 
					oldpass.val('');
					newpass.val('');
					$("#chngpw").hide("slow",function(){
						$("#active-password").fadeIn().delay(2000).fadeOut();
					});
				}
		    },error: function(data) {  
			    console.log(data);
		    }});
		    return false;
	 });
});