/*
*   This software called - np - is a lightwight MVP Framework for building web applications and
*   was developed by Christian Peters
*
*   Copyright (C) 2016 Christian Peters
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Contact: Christian Peters <c.peters.eshop@gmail.com>
*/

np.module ('client', (function () {
    var currentSize, clientDeviceType,
        isLG, isMD, isSM, language;
    
    $(document).ready (function () {
        clientDeviceType    = np.INITIAL_DATA.client_device;

        if (typeof $.browser.msie !== 'undefined' && $.browser.msie === true) {
            $('html').addClass ('np-browser-msie');
        } else if (typeof $.browser.mozilla !== 'undefined' && $.browser.mozilla === true) {
            $('html').addClass ('np-browser-moz');
        } else if (typeof $.browser.webkit !== 'undefined' && $.browser.webkit === true) {
            $('html').addClass ('np-browser-webkit');
        }
    });

    function _isMobile ()   { return clientDeviceType === 'mobile';     }
    function _isTablet ()   { return clientDeviceType === 'tablet';     }
    function _isDesktop ()  { return clientDeviceType === 'desktop';    }
    
    function _isTouchDevice () {
        var emulateTouchDevice;
            
        emulateTouchDevice  = typeof np.setup.config.emulateTouchDevice !== 'undefined' 
                              && np.setup.config.emulateTouchDevice === true;

        return $.browser.mobile === true || $.browser.android === true 
               || $.browser.blackberry === true || $.browser.ipad === true 
               || $.browser.iphone === true || $.browser.ipod === true 
               || $.browser.kindle === true || $.browser.playbook === true 
               || $.browser['windows phone'] === true || emulateTouchDevice;        
    }
    
    function _getLanguage () {
        return language;
    }
    
    isLG    = $('html').hasClass ('media-s-lg');
    isMD    = $('html').hasClass ('media-s-md');
    isSM    = $('html').hasClass ('media-s-sm');
    
    currentSize = isLG ? 'lg' : (isSM ? 'sm' : (isMD ? 'md' : 'xs'));

    $('html').addClass ((_isTouchDevice () ? 'np-touch' : ''));
    
    $(window).on ('resize orientationchange', function () {
        var oldSize, newSize, newHeight;

        isLG        = $('html').hasClass ('media-s-lg');
        isSM        = $('html').hasClass ('media-s-sm');
        isMD        = $('html').hasClass ('media-s-md');

        newSize     = isLG ? 'lg' : (isSM ? 'sm' : (isMD ? 'md' : 'xs'));
        newHeight   = $(window).height ();
        
        if (newSize !== currentSize) {
            oldSize     = currentSize;
            currentSize = newSize;
            
            np.observable.triggerSystemEvent ('window.size', newSize);
        }
        
        np.observable.triggerSystemEvent ('window.resize');
        np.hook ('resize', {deviceSize: currentSize});
    });
    
    $(window).on ('orientationchange', function () {
         np.observable.triggerSystemEvent ('orientation.change', true);
         np.hook ('orientationchange', true);
    });
    
    return {
        isXS: function () {
            return $('html').hasClass ('media-s-xs');
        },
        
        isSM: function () {
            return $('html').hasClass ('media-s-sm');
        },
        
        isMD: function () {
            return $('html').hasClass ('media-s-md');
        },
        
        isLG: function () {
            return $('html').hasClass ('media-s-lg');
        },
        
        isTouchDevice: function () {
            return _isTouchDevice ();
        },
        
        isMobile: function () {
            return _isMobile ();
        },
        
        isTablet: function () {
            return _isTablet ();
        },
        
        isDesktop: function () {
            return _isDesktop ();
        },
        
        isPortrait: function () {
            return $(window).width () < $(window).height ();
        },
        
        isLandscape: function () {
            return $(window).width () > $(window).height ();
        },
        
        setLanguage: function (lang) {
            $('html').addClass ('np-lang-'+lang.toLowerCase ());
            $('html').attr ('lang', lang.toLowerCase ());
            
            language    = lang;
        },
        
        getLanguage: function () {
           return _getLanguage (); 
        }
    };
}()));