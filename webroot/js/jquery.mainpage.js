/*  
The completer	
Author: Geoffrey Ganga
*/

(function($){

		
	var init = function(){
	
	};
	
	
	init();
	
		
	
	

	

		
		
	
//-----------account settings	



//when the user clicks on the account settings option from the drop down menu
	// show the account settings options
	
	$('#accSet').on('click', function(){
		if($('#accnt-settings').hasClass("hide"))
		{
		$('#accnt-settings').slideDown('slow', function() {
	
    // Animation complete.
  });
			/*
$( "#accnt-settings" ).animate({
			  opacity: "show"
			}, "slow" );
*/

			
		}else{
			$('#accnt-settings').addClass("hide")
		}
		
		
	})// end of account settings options showing up
	
	
	//when the user clicks on the change password
		// show the change password form
	
		$('#cPass').on('click', function(){
		if($('#chngpw').hasClass("hide"))
		{
/* 			$('#chngpw').removeClass("hide") */
			  $("#accnt-settings").hide("slow",function(){
					$( "#chngpw" ).animate({
						opacity: "show"
						}, "slow" );
				});
				
				
			//$('#accnt-settings').addClass("hide")
			
		}else{
			$('#chngpw').addClass("hide")
			$('#accnt-settings').removeClass("hide")

		}
		
		
	})// end of change password option
	
	
	
	//when the user clicks on the cancel buton
		// hide the change password form
			//goes back to the account settings menu
		$('#cancelchangepw').on('click', function(){
		if($('#accnt-settings').hasClass("hide"))
		{
		
		$("#chngpw").hide("slow",function(){
					$( "#accnt-settings" ).animate({
						opacity: "show"
						}, "slow" );
				});
			/*
$('#accnt-settings').removeClass("hide")
			$('#chngpw').addClass("hide")
*/

			


			
		}else{
			$('#chngpw').removeClass("hide")
						$('#accnt-settings').addClass("hide")

		}
		
		
	})// end of canceling changing password
	
	
	
	//if user clicks delete account
		//alert comes up to delete
	
	$('#dPass').on('click', function(){
		if($('#deleteModel').hasClass("hide"))
		{
		
		$("#accnt-settings").hide("slow",function(){
					$( "#deleteModel" ).animate({
						opacity: "show"
						}, "slow" );
				});
			/*
$('#accnt-settings').removeClass("hide")
			$('#chngpw').addClass("hide")
*/

			


			
		}else{
			$('#accnt-settings').removeClass("hide")
						$('#deleteModel').addClass("hide")

		}
		
		
	})// end of delete model popup
	
	
	
	// when delete modal comes up and user clicks no
		//sends them back to account settings
	
	
	$('#no-delete').on('click', function(){
		if($('#accnt-settings').hasClass("hide"))
		{
		
		$("#deleteModel").hide("slow",function(){
					$( "#accnt-settings" ).animate({
						opacity: "show"
						}, "slow" );
				});
	
		}else{
			$('#deleteModel').removeClass("hide")
						$('#accnt-settings').addClass("hide")

		}

		
		
	})// end of  cancel delete model popup
	
	
	
	
	// when delete modal comes up and user clicks yes
		//sends them back to account settings
			//displays a message saying the account has been delted
	
	
	$('#yes-delete').on('click', function(){
		if($('#accountDelted').hasClass("hide"))
		{
		
		$("#deleteModel").hide("slow",function(){
					$( "#accnt-settings" ).animate({
						opacity: "show"
						}, "slow", function(args) { $("#accountDelted").fadeIn().delay(1000).fadeOut() } );
				});
	
		}else{
			$('#deleteModel').removeClass("hide")
						$('#accountDelted').addClass("hide")

		}

		
		
	})// end of  cancel delete model popup
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//when the user clicks close on the account settings menu
		//hide the account settings menu
	
	$('#settingsBack').on('click', function(){
	$('#accnt-settings').slideUp('slow', function() {
	
    // Animation complete.
  });
		/*
$("#accnt-settings").hide("slow",function(){
					
				});
*/
			//$('#accnt-settings').addClass("hide")

	})// end of closing account settings


	$('#').on('click', function(){
		$("#chngpw").hide("slow",function(){
					$("#active-account").fadeIn().delay(2000).fadeOut();


				});

/* $("#active-account").fadeIn().delay(2000).fadeOut(); */
})

/* login form display */


$('#log-me-in').on('click', function(){
		if($('#aquilex-login').hasClass("hide"))
		{
			$('#aquilex-login').removeClass("hide")
		}else{
			//$('#aquilex-login').addClass("hide")
		}
		
		
	})// end of canceling changing password
	
	
// CANCEL THE LOGIN 	
$('#cancel-login').on('click', function(){
		if($('#aquilex-login').hasClass("hide"))
		{
			$('#aquilex-login').removeClass("hide")
		}else{
			$('#aquilex-login').addClass("hide")
		}
		
		
	})// end of canceling changing password
	
})(jQuery); // end private scope




