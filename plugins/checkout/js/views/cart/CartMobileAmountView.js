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

np.view.extend ('CartMobileAmountView', (function () {
    var tim;
    
    tim = false;
    
    return {
        hasProducts: function (model) {
            var _this;
            
            _this   = this;
            
            if (parseInt (model.get ('amount')) > 0) {
                if (!this.hasClass ('visible'))             { this.addClass ('visible');                }
                if (this.hasClass ('zoom-in-out-trans'))    { this.removeClass ('zoom-in-out-trans');   }
                
                if (tim)    { window.clearTimeout (tim);    }
                
                tim = window.setTimeout (function () { _this.addClass ('zoom-in-out-trans'); }, 250);
            } else {
                if (this.hasClass ('zoom-in-out-trans'))    { this.removeClass ('zoom-in-out-trans');   }
                if (this.hasClass ('visible'))              { this.removeClass ('visible');             }
            }
            
            this.html (model.get ('amount'));
        }.observes ('amount').on ('change')
    };
}()));