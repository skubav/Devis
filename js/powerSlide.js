(function($){

	$.fn.powerSlide = function(options) {  

		var opt = {
			'width': 908, // Width and height of the images
			'height': 340,
			'position': 'bottom', // Position of the navigation
			'bullets': false, // Show numbering navigation
			'thumbs':  true, // Show thumbnail navigation
			'row': 10, // Thumbnails per row
			'auto': true, // Auto rotate
			'autoSpeed': 4000,
			'fadeSpeed': 1000
		};

		this.each(function() {        
		
			if (options) { 
				$.extend(opt, options);
			}

			/* Container and wrapper
			-----------------------------------------------*/
			$(this).children().wrapAll('<div class="powerSlide" />');
			var container = $(this).find('.powerSlide');
			container.find('img').wrapAll('<div class="wrapper" />');
			var wrapper = container.find('.wrapper');


			/* Previous & next buttons
			-----------------------------------------------*/
			wrapper.append('<a href="#" class="prev">Prev</a><a href="#" class="next">Next</a>');


			/* Navigation & captions
			-----------------------------------------------*/
			switch (opt.position) { // Navigation position
					case 'top': container.prepend('<div class="nav" />'); break;
					case 'bottom': container.append('<div class="nav" />'); break;
			}

			var nav = container.find('.nav');

			wrapper.find('img').each(function(i){

				i += 1; // Start numbers at 1

				if (opt.bullets === true) { // Bullet navigation
						nav.append('<a href="#">'+ i +'</a>'); 
				}

				if (opt.thumbs === true) { // Thumbnail navigation
						nav.addClass('thumbs').append(
							'<img class="thumb" src="'+
							$(this).attr('src') +'" alt=""/>'); 
				}

				// Captions
				var title = $(this).attr('title');
				$(this).wrapAll('<div class="image" />');
				if (title !== undefined) {
						$(this).attr('title', '');
						$(this).after('<p>'+ title +'</p>');
				}
			});			
			
			
			/* Slider Object
			-----------------------------------------------*/		
			var Slider = function(){

			this.imgs = wrapper.find('div.image');
			this.imgCount = (this.imgs.length) - 1; // Match index
			this.navPrev = wrapper.find('a.prev');
			this.navNext = wrapper.find('a.next');
			this.bullets = container.find('.nav a');
			this.thumbs = container.find('.nav img.thumb');
			this.captions = this.imgs.find('p');

			this.getCurrentIndex = function(){ // Index
					return this.imgs.filter('.current').index();
			};

			this.go = function(index){ // Rotate images
					this.imgs
						.removeClass('current')
						.fadeOut(opt.fadeSpeed)
						.eq(index)
						.fadeIn(opt.fadeSpeed)
						.addClass('current');
					this.bullets
						.removeClass('current')
						.eq(index)
						.addClass('current');
					this.thumbs
						.removeClass('current')
						.eq(index)
						.addClass('current');
			};
	
			this.next = function(){
					var index = this.getCurrentIndex();
					if (index < this.imgCount) {
						this.go(index + 1); // Go next
					} else {
						this.go(0); // If last go first
					}
			};
	
			this.prev = function(){
					var index = this.getCurrentIndex();
					if (index > 0) {
						this.go(index - 1); // Go previous
					} else {
						this.go(this.imgCount); // If first go last
					}
			};	
	
			this.init = function(){ // Init
				wrapper
					.width(opt.width)
					.height(opt.height); /* Set width and height */
				
				this.imgs.hide().first().addClass('current').show(); /* Set current image */
				this.bullets.first().addClass('current');
				this.thumbs.first().addClass('current');
				
				// Dimensions for thumbnails and captions
				var padding = wrapper.css('padding-left').replace('px', '');
				var captionsPadding = this.captions.css('padding-left').replace('px', '');
				nav.width(opt.width);
				if (opt.thumbs === true) { // thumbs
					var thumbBorder = this.thumbs.css('border-left-width').replace('px', '');
					var thumbMargin = this.thumbs.css('margin-right').replace('px', '');
					var thumbMaxWidth = opt.width/opt.row;
					this.thumbs.width( (thumbMaxWidth - (thumbMargin * 2)) - (thumbBorder * 2) );
				}
				this.captions // captions
					.width(opt.width - (captionsPadding * 2) + 'px')
					.css('margin-bottom', padding + 'px');
				this.navNext.css('margin-right', padding + 'px');

			};

			};
			
			var slider = new Slider();
			slider.init();		
			
			
			/* Mouse Events
			-----------------------------------------------*/
			wrapper.hover(function(){ // Hover image wrapper
				slider.captions.stop(true, true).fadeToggle();
				slider.navNext.stop(true, true).fadeToggle();
				slider.navPrev.stop(true, true).fadeToggle();
			});
			slider.navNext.click(function(e){ // Click next button
				e.preventDefault();
				slider.next(); 
			});
			slider.navPrev.click(function(e){ // Click previous button
				e.preventDefault();
				slider.prev();
			});
			slider.bullets.click(function(e){  // Click numbered bullet
				e.preventDefault(); slider.captions.hide();
				slider.go($(this).index());
			});
			slider.thumbs.click(function(){ // Click thumbnail
				slider.captions.hide();
				slider.go($(this).index());
			});
			
			
			
			/* Auto Rotate	
			-----------------------------------------------*/			
			if (opt.auto === true) {

				var timer = function(){
						slider.next();
						slider.captions.hide();
				};
				var interval = setInterval(timer, opt.autoSpeed);
	
				// Pause when hovering image
				wrapper.hover(function(){clearInterval(interval);}, function(){interval=setInterval(timer, opt.autoSpeed);});

				// Reset timer when clicking thumbnail or bullet
				slider.thumbs.click(function(){clearInterval(interval); interval=setInterval(timer, opt.autoSpeed);});
				slider.bullets.click(function(){clearInterval(interval); interval=setInterval(timer, opt.autoSpeed);});	
		
			}
			
		});
	};
})(jQuery);
