jQuery(document).ready(function($){
	//update this value if you change this breakpoint in the style.css file (or _layout.scss if you use SASS)
	var MqL = 1070;
	var shouldContinue = true; 
	
	//on desktop, switch from product intro div to product tour div
	$('a[href="#cd-product-tour"]').on('click', function(event){
		$('header').addClass('slide-down');
		$('.cd-main-content').addClass('is-product-tour');
	});

	//update the slider - desktop only
	$('.cd-prev').on('click', function(event){
		event.preventDefault();
		var activeSlide = $('.cd-active');
		if(activeSlide.is(':first-child')) {
			//in this case - switch from product tour div to product intro div
			showProductIntro();
		} else {
			updateSlider(activeSlide, 'prev'); 
		}
	});
	$('.cd-next').on('click', function(event){
		var activeSlide = $('.cd-active');
		updateSlider(activeSlide, 'next'); 
	});

	$(document).keyup(function(event){
		if(event.which=='37' && $('.cd-main-content').hasClass('is-product-tour') ) {
			var activeSlide = $('.cd-active');
			if(activeSlide.is(':first-child')) {
				//in this case - switch from product tour div to product intro div
				showProductIntro();
			} else {
				updateSlider(activeSlide, 'prev'); 
			}
		} else if(event.which=='39' && $('.cd-main-content').hasClass('is-product-tour') && shouldContinue) {
			var activeSlide = $('.cd-active');
			updateSlider(activeSlide, 'next');
		}
	});

	$(window).on('resize', function(){
		window.requestAnimationFrame(function(){			
			( $('.cd-main-content').hasClass('is-product-tour') ) ? $('header').addClass('slide-down') : $('header').removeClass('slide-down');
		});
	});
	$(window).on('scroll', function(){
		window.requestAnimationFrame(function(){
			if($(window).width() < MqL && $(window).scrollTop() < $('#cd-product-tour').offset().top - 30 ) {
				$('header').removeClass('slide-down');
			} else if ($(window).width() < MqL && $(window).scrollTop() >= $('#cd-product-tour').offset().top - 30 ){
				$('header').addClass('slide-down');
			}
		});
	});

	function showProductIntro() {
		$('header').removeClass('slide-down');
		$('.cd-main-content').removeClass('is-product-tour');
	}

	function updateSlider(active, direction) {
		var selected;
		if( direction == 'next') {
			selected = active.next();
			//on Firefox CSS transition/animation fails when parent element changes visibility attribute
			//so we have to change .cd-single-item childrens attributes after having changed its visibility value
	           	active.removeClass('cd-active').addClass('cd-hidden').next().removeClass('cd-move-right').addClass('cd-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	           		active.addClass('cd-not-visible');
	           	});
		} else {
			selected = active.prev();
			//on Firefox CSS transition/animation fails when parent element changes visibility attribute
			//so we have to change .cd-single-item childrens attributes after having changed its visibility value
	           	active.removeClass('cd-active').addClass('cd-move-right').prev().addClass('cd-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
	           		active.addClass('cd-not-visible');
	           	});
		}
		//update visible slider
		selected.removeClass('cd-not-visible');
		//update slider navigation (in case we reached the last slider)
        updateSliderNav(selected);
	}

	function updateSliderNav(selected) {
		( selected.is(':last-child') ) ? handleLastSlide(selected) : continueMovingSlides();
		$('.cd-loader').stop().hide().css('width', 0);
	}
	
	function continueMovingSlides() {
		// enable next occurence happening with right arrow input
		shouldContinue = true;
		$('.cd-next').removeClass('cd-inactive');
	}
	
	function handleLastSlide(selected) {
		// prevent next occurence happening with right arrow input
		shouldContinue = false;
		// deactivate the next button
		$('.cd-next').addClass('cd-inactive');
	}	
});