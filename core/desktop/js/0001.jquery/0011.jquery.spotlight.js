function test () {}
/**
 * jQuery Spotlight
 *
 * Project Page: http://github.com/
 * Original Plugin code by Gilbert Pellegrom (2009)
 * Licensed under the GPL license (http://www.gnu.org/licenses/gpl-3.0.html)
 * Version 2.0.1 (2014)
 */

/*
 * jQuery Spotlight
 * 
 * Project Page: http://github.com/
 * Original Plugin code by Gilbert Pellegrom (2009)
 * Modified Plugin code by Christian Peters (2015)
 * 
 * jQuery Spotlight (modified): 
 * Fit to np-framework and fixed event-delegation (show/hide spotlight events)
 * 
 * Version 0.0.1 (2015)
 */
 
 (function ($){
     $.fn.spotlightClose = function () {
//         console.log ('close');
     };
 }(jQuery));
 
 (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.spotlight = (function () {
        var settings, parent, context, overlay, _this;
        
        /*
         * prepareSettings
         * 
         * @returns {undefined}
         */
        function prepareSettings (options) {
            return $.extend ({}, {
                // Default settings
                opacity:    .5,
                speed:      400,
                color:      '#333',
                animate:    true,
                easing:     '',
                exitEvent:  'click',
                onShow:     function () {},
                onHide:     function () {},
                
                spotlightZIndex:        100,
                spotlightElementClass:  'spotlight-background',
                parentSelector:         'html',
                paddingX:               0,
                paddingY:               0
            }, options);            
        }
        
        function prepareMethod (options)    { return typeof options === 'string' ? options : 'create';  }
        
        /*
         * Moved out of return function. 
         * Reason: jquery proxies the closeOverlay for each single 
         * spotlight which causes different guids. So the document.off ()-function
         * wouldnt work properly:
         */ 
        function closeOverlay (internal) {
            var curOverlay, promise;
            
            internal    = typeof internal === 'boolean' ? internal : false;
            
            $(document).off (settings.exitEvent, 'body, button', closeOverlay);
            
            promise     = np.Promise ();
            curOverlay  = $('canvas#spotlight');
            
            if (curOverlay.length > 0) { 
                $('.spotlight-blink').each (function () { $(this).removeClass ('spotlight-blink');  });
                
                // Trigger the onHide callback
                settings.onHide.call(this);

                if (settings.animate && !internal) {
                    curOverlay.animate({opacity: 0}, settings.speed, settings.easing, function () {
                        curOverlay.remove();
                        curOverlay = null;

                        promise.then ();
                    });
                } else {
                    curOverlay.remove();
                    curOverlay = null;

                    promise.then ();
                }
            } else {
                promise.then ();
            }
            
            return promise;
        }
        
        function createOverlay () {
            var cssConfig, promise;
            
            promise = np.Promise ();

            // Before create, remove current overlay:
            closeOverlay (true).then (function () {
                var pW, pH;
                
                // Add the overlay element
                overlay     = $('<canvas></canvas>');
                overlay.addClass (settings.spotlightElementClass );
                overlay.attr ('id', 'spotlight');

                parent      = $(settings.parentSelector);

                pW          = parent.outerWidth (true);
                pH          = parent.outerHeight (true);

                parent.append (overlay);

                // Set the CSS styles
                cssConfig = {
                    position:   'absolute',
                    top:        0,
                    left:       0,
                    height:     '100%',
                    width:      '100%',
                    zIndex:     settings.spotlightZIndex
                };

                if (settings.parentSelector === 'html') { parent.css ('height', '100%');    }

                overlay.css (cssConfig);

                handleResize ();

                $(window).resize (handleResize);

                context = overlay[0].getContext ('2d');

                fillOverlay ();
                
                promise.then ();
            });
            
            return promise;
        }
        
        /**
         * Colour in the overlay and clear all element masks
         */
        function fillOverlay () {
            context.fillStyle   = settings.color;

            context.fillRect (0, 0, parent.innerWidth (), parent.innerHeight ());

            _this.each (function () {
                if (!$(this).hasClass ('spotlight-blink'))  { $(this).addClass ('spotlight-blink'); }
            });
        }

        /**
         * Handle resizing the window
         *
         * @param e
         */
        function handleResize (e) {
            overlay.attr ('width', parent.innerWidth ());
            overlay.attr ('height', parent.innerHeight ());

            if (typeof context !== 'undefined') { fillOverlay ();   }
        }
        
        function tick () {
            if ($('canvas#spotlight').length > 0) {
                // Set up click to close
                $(document).on (settings.exitEvent, 'body, button', closeOverlay);
            } else {
                np.tick (tick);
            }
        }
        
        // CP: Return the sptolight plugin functionality:
        return function (options) {
            var method;

            _this           = $(this);
            settings        = prepareSettings (options);
            method          = prepareMethod (options);

            switch (method) {
                case 'close':
                case 'destroy':
                    closeOverlay ().then (function () {});
                    
                    return;
                case 'create':
                    createOverlay ().then (function () {
                        // Trigger the onShow callback
                        settings.onShow.call (this);
                        
                        // Fade in the spotlight
                        if (settings.animate) {
                            overlay.animate ({opacity: settings.opacity}, settings.speed, settings.easing, function () {
                                // Set up click to close
                                np.tick (tick);
                            });
                        } else {
                            overlay.css ('opacity', settings.opacity);

                            // Set up click to close
                            np.tick (tick);
                        }                        
                    });
            }

            // Returns the jQuery object to allow for chainability.
            return this;
        };
    }());
}));