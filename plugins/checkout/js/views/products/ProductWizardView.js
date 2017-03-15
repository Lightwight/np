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

np.view.extend ('ProductWizardView', (function () {
    var bgScenes, smBGController;
    
    bgScenes        = new Array ();
    smController    = false;
    
    function destroyController () {
        $.each (bgScenes, function (inx, bgScene) {
           bgScene.destroy (true);
        });
        
        if (smBGController)   { smBGController.destroy (true);  }
    }
    
    function initBGs () {
        $.each ($('#product-wizard .background.scroll'), function (inx, node) {
            $(node).addClass ('bg-'+(inx+1));
        });
    }
    
    function initSMController () {
        smBGController    = new ScrollMagic.Controller ();
    }
    
    function createTween (classID) {
        var bgTween;
        
        bgTween       = new TimelineMax ();
        bgTween
        .fromTo ('#product-wizard .background.scroll.'+classID+' .img', 0.5, {
            transform:  'translate3d(0px, 0px, 0px)',
            '-moz-transform':  'translate3d(0px, 0px, 0px)',
            '-o-transform':  'translate3d(0px, 0px, 0px)'
        }, 
        {
            transform:  'translate3d(0px, 80px, 0px)',
            '-moz-transform':  'translate3d(0px, 80px, 0px)',
            '-o-transform':  'translate3d(0px, 80px, 0px)'
        }, 0);
        
        return bgTween;
        
    }
    
    function createController () {
        initBGs ();
        initSMController ();
        
        $.each ($('#product-wizard .background.scroll'), function (inx, node) {
            var classID;
            
            classID = $(node).attr ('class').split (' ').filter (function (cName, inx) {
                if (cName.indexOf ('bg-') > -1) {
                    return cName;
                }
            });

            bgScenes.push (new ScrollMagic.Scene ({triggerElement: '#product-wizard .background.scroll.'+classID[0], triggerHook: 'onEnter', duration: "200%"})
            .setTween (createTween (classID[0]))
            .addTo (smBGController));
        });
    }
    
    return {
        didInsert: function () {
            createController ();
        }
    };
})());