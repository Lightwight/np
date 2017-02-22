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

np.module ('resize', (function () {
    var $dest, newSize, defaults, custom;

    $dest       = $('html');
    newSize     = 'unknown';
    defaults    = {
        lg: 1200,
        md: 992,
        sm: 768
    };
    
    custom      = false;
    
    function switchClasses (mediaSize) {
        newSize     = mediaSize;

        removeClasses ();
        setSize ();
    }
    
    function removeClasses () {
        if ( $dest.hasClass('media-s-lg') && newSize !== 'lg' )         { $dest.removeClass('media-s-lg');  }
        else if ( $dest.hasClass('media-s-md') && newSize !== 'md' )    { $dest.removeClass('media-s-md');  }
        else if ( $dest.hasClass('media-s-sm') && newSize !== 'sm' )    { $dest.removeClass('media-s-sm');  }
        else if ( $dest.hasClass('media-s-xs') && newSize !== 'xs')     { $dest.removeClass('media-s-xs');  }
    }
    
    function setSize () { 
        $dest.addClass ('media-s-'+newSize); 
    }

    function initCustom () {
        var settings, media;
        
        settings    = np.setup.getSettings ();
        media       = typeof settings.media !== 'undefined' ? settings.media : false;

        custom      = {};

        custom.lg   = media && typeof media.lg !== 'undefined' ? media.lg : defaults.lg;
        custom.md   = media && typeof media.md !== 'undefined' ? media.md : defaults.md;
        custom.sm   = media && typeof media.sm !== 'undefined' ? media.sm : defaults.sm;
    }

    function checkSize () {
        var width,
            mLG, mMD, mSM;

        if (!custom) { initCustom (); }

        width   = $(window).width();
        mLG     = custom.lg;
        mMD     = custom.md;
        mSM     = custom.sm;

        // lg
        if (width >= mLG)       { switchClasses ('lg'); } 
        // md
        else if (width >= mMD)  { switchClasses ('md'); } 
        // sm
        else if (width >= mSM)  { switchClasses ('sm'); } 
        // xs
        else                    { switchClasses ('xs'); } 
    }
    
    $(window).resize(function() {checkSize();});
    $(window).on('orientationchange', function() {checkSize ();});
    $(document).ready(function() {checkSize();});
    
    return {
        check:  function () { checkSize(); }
    };
}()));
