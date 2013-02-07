/*
	jAcc: Accordion
	Compatibility: jQuery 1.4+
	Author: Mike Smotherman
	codeinfused.com
*/


(function(){

	$.fn.jacc = function(options){
		
		var opts = $.extend({
		
			easing:'swing',
			duration: 400,
			multi:false,
			show:0
		
		}, options, {});
		this.each(function(){
		
		
			var acc = $(this);
			var clickables = acc.children(opts.clickable);
			var contents = acc.children(opts.content);
			
			if(opts.show === false){
				contents.hide();
			}else{
				contents.hide().eq(0).show();

			}
			
			
			clickables.on('click' , function(){
				var target = $(this).next();
				
				var isAnimated = target.is(':animated');
				
				if(isAnimated){
					return false;
				};
				
				if(opts.multi){
					target.slideToggle(opts.duration, opts.easing);
				}else{
					contents.not(target).slideUp(opts.duration, opts.easing);
					target.slideDown(opts.duration, opts.easing);
				};
				return false;
			
			});
		
		})//end eac
		
	
	};//end of jacc



})();