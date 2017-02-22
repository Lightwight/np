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

np.view.extend ('ProductsSearchToggleView', function () {
    function destroyQTips () {
        $('.variations').each (function () {
            if ($(this).qtip ('api')) { 
                $(this).qtip ('api').hide ();    
                $(this).qtip ('api').disable ();    
            }
        });
        
        $('.product .amount input[data-bind="amount"]').each (function () {
            if ($(this).qtip ('api')) { 
                $(this).qtip ('api').hide ();    
                $(this).qtip ('api').disable ();    
            }
        });

        $('.qtip').remove ();        
    }
    
    return {
        toggleList: function (model) {
            var productListView;
            
            destroyQTips ();
            
            productListView     = $('main .main-content .products-list');

            if (model.get ('list')) {
                if (!this.hasClass ('active'))                  { this.addClass ('active');                     }
                if (productListView.hasClass ('no-display'))    { productListView.removeClass ('no-display');   }
            } else {
                if (this.hasClass ('active'))                   { this.removeClass ('active');                  }
                if (!productListView.hasClass ('no-display'))   { productListView.addClass ('no-display');      }
            }
        }.observes ('list').on ('change'),

        toggleLarge: function (model) {
            var productSpreadView;

            destroyQTips ();
            
            productSpreadView   = $('main .main-content .products-spread');

            if (!model.get ('list')) {
                if (!this.hasClass ('active'))                  { this.addClass ('active');                     }
                if (productSpreadView.hasClass ('no-display'))  { productSpreadView.removeClass ('no-display'); }
            } else {
                if (this.hasClass ('active'))                   { this.removeClass ('active');                  }
                if (!productSpreadView.hasClass ('no-display')) { productSpreadView.addClass ('no-display');    }
            }
        }.observes ('list').on ('change'),
        
        activateSkrollr: function () {
            if (!np.client.isMobile ()) {
                np.skrollr.refresh ();                 
            } else {
                np.skrollr.destroy ();
                $('#productToggleContainer').css ('top', '');
            }
        }.observes ('window.size').on ('change')
    };
}());