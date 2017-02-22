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

np.view.extend ('CheckoutBreadcrumbView', {
    statusStep1: function (model) {
        var step;
        
        step    = parseInt (model.get ('state.step'), 10);
        
        if (step === 1) { this.addClass ('active');     }
        else            { this.removeClass ('active');  }
    }.observes ('state.step').on ('change'),
    
    statusStep2: function (model) {
        var step;
        
        step    = parseInt (model.get ('state.step'), 10);
        
        if (step === 2) { this.addClass ('active');     }
        else            { this.removeClass ('active');  }
    }.observes ('state.step').on ('change'),
    
    statusStep3: function (model) {
        var step;
        
        step    = parseInt (model.get ('state.step'), 10);
        
        if (step === 3) { this.addClass ('active');     }
        else            { this.removeClass ('active');  }
    }.observes ('state.step').on ('change'),
    
    statusStep4: function (model) {
        var step;
        
        step    = parseInt (model.get ('state.step'), 10);
        
        if (step === 4) { this.addClass ('active');     }
        else            { this.removeClass ('active');  }
    }.observes ('state.step').on ('change')
});