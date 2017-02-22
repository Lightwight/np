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

np.view.extend ('CheckoutShippingView', {
    isMale: function (model) {
        if (model.get ('shipping.gender') === 'male') {
            if (!this.hasClass ('active'))  { this.addClass ('active');     }
        } else {
            if (this.hasClass ('active'))   { this.removeClass ('active');  }
        }
    }.observes ('shipping.gender').on ('change'),
    
    isFemale: function (model) {
        if (model.get ('shipping.gender') === 'female') {
            if (!this.hasClass ('active'))  { this.addClass ('active');     }
        } else {
            if (this.hasClass ('active'))   { this.removeClass ('active');  }
        }
    }.observes ('shipping.gender').on ('change'),
    
    givenName: function (model) {
        if (!model.get ('shipping.name').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.name').on ('change'),
    
    emptyName: function (model) {
        if (!model.get ('shipping.name').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('shipping.name').on ('change'),
    
    givenPrename: function (model) {
        if (!model.get ('shipping.prename').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.prename').on ('change'),
    
    emptyPrename: function (model) {
        if (!model.get ('shipping.prename').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');            
        }
    }.observes ('shipping.prename').on ('change'),
    
    givenCountry: function (model) {
        if (!model.get ('shipping.country').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.country').on ('change'),
    
    givenStreet: function (model) {
        if (!model.get ('shipping.street').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.street').on ('change'),
    
    emptyStreet: function (model) {
        if (!model.get ('shipping.street').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('shipping.street').on ('change'),
    
    givenPostal: function (model) {
        if (!model.get ('shipping.postal').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.postal').on ('change'),
    
    emptyPostal: function (model) {
        if (!model.get ('shipping.postal').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('shipping.postal').on ('change'),
    
    givenCity: function (model) {
        if (!model.get ('shipping.city').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('shipping.city').on ('change'),
    
    emptyCity: function (model) {
        if (!model.get ('shipping.city').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('shipping.city').on ('change'),
    
    sameBilling: function (model) {
        var custom;

        custom  = model.get ('shipping.customShipping');

        if (!custom) {
            if (!this.hasClass ('active'))  { this.addClass ('active');     }
        } else {
            if (this.hasClass ('active'))   { this.removeClass ('active');  }
        }
    }.observes ('shipping.customShipping'). on ('change'),

    customShipping: function (model) {
        var custom;

        custom  = model.get ('shipping.customShipping');

        if (custom) {
            if (!this.hasClass ('active'))  { this.addClass ('active');     }
        } else {
            if (this.hasClass ('active'))   { this.removeClass ('active');  }
        }
    }.observes ('shipping.customShipping'). on ('change'),
  
    showShippingInputs: function (model) {
        var custom;

        custom  = model.get ('shipping.customShipping');

        if (custom) {
            this.removeClass ('hidden');
        } else {
            this.addClass ('hidden');
        }
    }.observes ('shipping.customShipping').on ('change'),    
    
    toggleBtnShippingSettings: function (model) {
        var customShipping;
        
        customShipping  = model.get ('shipping.customShipping');
        
        if (np.auth.loggedIn () && np.checkout.isDifferentShipping (customShipping) && np.checkout.validOrigShipping ()) {
            if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
        } else {
            if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
        }
    }.observes ('@each').on ('change')
});