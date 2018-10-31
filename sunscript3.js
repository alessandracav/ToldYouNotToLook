(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
								   || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	var h5 = 0
$(window).on('scroll', function () {
    h5 = $(document).scrollTop()/20000;
  	$('h5 > span').text(h5);
    $("#layer3").css({"-webkit-filter": "blur("+h5+"px)","-moz-filter": "blur("+h5+"px)","filter": "blur("+h5+"px)" })     
});
 
	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
			  timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
 
	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

var layers = document.getElementsByClassName('layer');
var pageHeight = document.body.clientHeight;


function getElementScale(elem) {
	var transform = /matrix\([^\)]+\)/.exec(
		window.getComputedStyle(elem)['-webkit-transform']),
		scale = {'x': 1, 'y': 1};
	if( transform ) {
		transform = transform[0].replace(
			'matrix(', '').replace(')', '').split(', ');
		scale.x = parseFloat(transform[0]);
		scale.y = parseFloat(transform[3]);
	}
	return scale;
}

var scaleArray = [];

for ( var i=0; i<layers.length; i++ ){
	scaleArray.push( getElementScale( layers[i] ) );
}

var dolly = function(scrollPos) {
	
	requestAnimationFrame( function(){
	
		for( var i=0; i<layers.length; i++){

			var params = [];

			if ( layers[i].getAttribute('data-params') ){
				params = layers[i].getAttribute('data-params').split(',');
			}

			var inpoint = ( params[0] || 0 );
			var outpoint = ( params[1] || pageHeight );
			var speed = ( params[2] || 200 );

			var scaleVal = (
				(scaleArray[i].x + ( (scrollPos - inpoint) / speed ) )
				);

		
			if(scrollPos >= inpoint && scrollPos <= outpoint){
				
				if(layers[i].classList.contains('hide')){
					layers[i].classList.remove('hide');
				}
				var scaleString = "scale("+scaleVal+")";
				layers[i].style.webkitTransform = scaleString;
				layers[i].style.mozTransform = scaleString;
				layers[i].style.msTransform = scaleString;
				layers[i].style.oTransform = scaleString;
				layers[i].style.transform = scaleString;

			} else { 

				
				if(!layers[i].classList.contains('hide')){
					layers[i].classList.add('hide');
				}
				
			}
		} 
	}); 
} 

var scrollPos = 0,
	touchStart = null,
	scrollEnd = null;

window.addEventListener("scroll", function(event) {

	scrollPos = window.pageYOffset;

	dolly(scrollPos);
	
});

window.addEventListener("touchstart", function(event) {
	touchStart = event.changedTouches[0].screenY;
});

window.addEventListener("touchmove", function(event) {
	event.preventDefault();
	
	var touchMove = event.changedTouches[0].screenY;
	scrollPos = Math.max(scrollEnd+touchStart-touchMove, 0);
	scrollPos = Math.min(scrollPos, pageHeight-window.innerHeight);
	
	dolly(scrollPos);
});

window.addEventListener("touchend", function(event) {
	scrollEnd = scrollPos;
});