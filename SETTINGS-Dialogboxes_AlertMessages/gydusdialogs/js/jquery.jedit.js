/*
	jEdit edit-in-place plugin v1.0
	author: Jarvis Jardin

*/

(function(){
	$.fn.jedit = function(options){
		var opts = $.extend({},$.fn.jedit.defaults, options)
		
		return this.each(function(){
			var elem = $(this);
			var	input;
			 
			if(opts.entryType === 'input'){
				input = $('<input class="jedit-input" value="" type="text" />').insertBefore(elem).hide()
			}else if(opts.entryType === 'textarea'){
				input = $('<textarea class="jedit-textarea" value="" type="text"></textarea>').insertBefore(elem).hide()
			};
		
				console.log(input);
			
			if(opts.loader){
				var loader = $('<img src="'+opts.loader+'" class="jedit-loader"/>').insertBefore(elem).hide();
				
			}else{
				var loader = $('<span class="jedit-loader">SAVING</span>').insertBefore(elem).hide();
			};
			
			var	allData = $.extend({},opts.otherData);	
			
			
			var saveFn = function(){
				
				if(elem.text() === input.val()){
					closeFn();
					return;
				};
			
				allData[opts.dataName] = input.val()
				
				loader.show();
				input.hide();
				
				$.ajax({
					url: opts.url,
					type: opts.type,
					dataType: opts.dataType,
					data: allData,
					success: function(){
								
						elem.text(input.val());
						closeFn();
					}
				});
			};
			
			var closeFn = function(){
				input.hide();
				elem.show();
				loader.hide();
			};	
			
			elem.on('click', function(){
				elem.hide();
				input.show()
					.val(elem.text())
					.width(elem.width() - 10)
					.focus()
				;
				
				if(opts.entryType === 'textarea'){
					input.height(elem.height());	
				};
			
			});
			
			input.on('keyup', function(e){
				if(e.which===27){
					//cancel
					
					closeFn();
				}else if(e.which === 13){
					//save
					saveFn();
				};
			
			});
			
			input.on('blur', function(e){
				closeFn();
			});
		
		});//end each 
	
	}//end jedit
	
	$.fn.jedit.defaults = {
		type:'post',
		dataType:'json',
		entryType: 'input'
	
	};//end defaults	

})(jQuery);