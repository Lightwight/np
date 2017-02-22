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

np.view.extend ('CheckoutBillingView', {
    givenStreet: function (model) {
        if (!model.get ('billing.street').empty ()) {
            if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut'); }
            if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');     }
        } else {
            if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            if (!this.hasClass ('fadeOut')) { this.addClass ('fadeOut');    }            
        }
    }.observes ('billing.street').on ('change'),
    
    emptyStreet: function (model) {
        if (!model.get ('billing.street').empty ()) {
            if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            if (!this.hasClass ('fadeOut')) { this.addClass ('fadeOut');    }            
        } else {
            if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut'); }
            if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');     }
        }
    }.observes ('billing.street').on ('change'),
    
    givenPostal: function (model) {
        if (!model.get ('billing.postal').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('billing.postal').on ('change'),
    
    emptyPostal: function (model) {
        if (!model.get ('billing.postal').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('billing.postal').on ('change'),
    
    givenCity: function (model) {
        if (!model.get ('billing.city').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('billing.city').on ('change'),
    
    emptyCity: function (model) {
        if (!model.get ('billing.city').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('billing.city').on ('change'),
    
    toggleBtnBillingSettings: function () {
        if (np.auth.loggedIn () && np.checkout.isDifferentBilling () && np.checkout.validOrigBilling ()) {
            if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
        } else {
            if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
        }
    }.observes ('@each').on ('change')
});