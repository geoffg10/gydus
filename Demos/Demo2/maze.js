$(function() {

        tile = [];
        tile[0] = 'walk';
        tile[1] = 'wall';
        tile[2] = 'wall';
        tile[3] = 'wall';
        
        tile[4] = 'walk';
        tile[5] = 'walk';
        tile[6] = 'wall';
        tile[7] = 'wall';
        
        tile[8] = 'wall';
        tile[9] = 'walk';
        tile[10] = 'wall';
        tile[11] = 'wall';
        
        tile[12] = 'wall';
        tile[13] = 'walk';
        tile[14] = 'walk';
        tile[15] = 'walk';
        
        tile[16] = 'wall';
        tile[17] = 'wall';
        tile[18] = 'wall';
        tile[19] = 'wall';

        $.each(tile, function(k, v) {
                if (k % 4 == 0) {
                        $("#map").append('<div class="'+ v +' clear" id="' + k + '"></div>');
                }
                else {
                        $("#map").append('<div class="'+ v +'" id="' + k + '"></div>');
                }
        });
        

        var player = '<div class="player"></div>';
        $("#map").append(player);       
        
        
        // Left 37
        // Up 38
        // Right 39
        // Down 40
        $(document).keydown(function(e) {
        
                /** Get the current position */
                var position = $(".player").position();
                
                switch(e.keyCode) {                     
                        case 37:
                                $("#output").html(37);
                                $(".player").css('left', position.left - 20 +'px');
                                break;
                        case 38:
                                $("#output").html(38);
                                $(".player").css('top', position.top - 20 +'px');
                                break;
                        case 39:
                                $("#output").html(39);
                                $(".player").css('left', position.left + 20 +'px');
                                break;
                        case 40:
                                $("#output").html(40);
                                $(".player").css('top', (position.top + 20) + 'px');
                                break;
                }
                //alert(e.keyCode);
        });


});