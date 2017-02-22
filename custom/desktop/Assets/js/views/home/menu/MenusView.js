np.view.extend ('MenusView', (function () {
    var smController, menuScene, menuTween;
    
    menuScene       = false;
    smController    = false;
    
    function destroyController () {
        if (menuScene)      { menuScene.destroy (true);     }
        if (smController)   { smController.destroy (true);  }
    }
    
    function createController () {
        // init controller for pinning the menu on scroll out of head
        smController    = new ScrollMagic.Controller ();

        menuTween       = new TimelineMax ();
        menuTween
        .to ('#logo a', 0.5, {
            css:  {
                top:        '-16px'
            }
        }, 0)
        .to ('#logo img:first-child', 0.5, {
            css:  {
                transform:  'scale(0.5)',
                top:        '10px',
                left:       '-60px'
            }
        }, 0)
        .to ('#logo img:last-child', 0.5, {
            css:  {
                transform:  'scale(0.4)',
                top: '-20px',
                left: '-76px'
            }
        }, 0)
        .to ('#logo div', 0.5, {
            css: {
                'line-height':  '14px',
                'font-size':    '14px',
                'top':          '-20px'
            }
        }, 0)
        .to ('#menu .menu-area.head', 0.5, {
            css: {
                width: '134px'
            }
        }, 0)
        .to ('#menu .menu-area', 0.5, {
            css: {
                height: '86px'
            }
        }, 0)
        .to ('#menu .menu-area .menu-list', 0.5, {
            css: {
                'line-height': '86px'
            }
        }, 0);

        menuScene       = new ScrollMagic.Scene ({triggerElement: 'main', triggerHook: "onLeave", offset: -124, duration: 223})
        .setTween (menuTween)
        .addTo (smController);
    }

    return {
        orientationChange: function () {
            destroyController ();
            createController ();
            
            $(window).scrollTop (0);
        }.observes ('orientation.change').on ('change'),
        
        windowSize: function () {
            destroyController ();
            createController ();
            
            $(window).scrollTop (0);
        }.observes ('window.size').on ('change'),
        
        routeChanged: function () {
            destroyController ();
            createController ();
            
            $(window).scrollTop (0);
        }.observes ('route.change').on ('change')
    };
})());