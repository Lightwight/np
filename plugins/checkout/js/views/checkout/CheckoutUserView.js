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

np.view.extend ('CheckoutUserView', {
    isMale: function (model) {
        if (model.get ('user.gender') === 'male') {
            this.addClass ('active');
        } else {
            this.removeClass ('active');
        }
    }.observes ('user.gender').on ('change'),
    
    isFemale: function (model) {
        if (model.get ('user.gender') === 'female') {
            this.addClass ('active');
        } else {
            this.removeClass ('active');
        }
    }.observes ('user.gender').on ('change'),
    
    givenName: function (model) {
        if (!model.get ('user.name').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('user.name').on ('change'),
    
    emptyName: function (model) {
        if (!model.get ('user.name').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('user.name').on ('change'),
    
    givenPrename: function (model) {
        if (!model.get ('user.prename').empty ()) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('user.prename').on ('change'),
    
    emptyPrename: function (model) {
        if (!model.get ('user.prename').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');            
        }
    }.observes ('user.prename').on ('change'),

    invalidMail: function (model) {
        if (!model.get ('user.email').empty () && !model.get ('user.email').complies ('mail')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('user.email').on ('change'),
    
    validMail: function (model) {
        if (model.get ('user.email').empty () || !model.get ('user.email').complies ('mail')) {
            this.removeClass ('show');
        } else if (!model.get ('user.email').empty ()){
            this.addClass ('show');
        }
    }.observes ('user.email').on ('change'),    
    
    givenMail: function (model) {
        if (!model.get ('user.email').empty ()) {
            this.removeClass ('show');
        } else {
            this.addClass ('show');
        }
    }.observes ('user.email').on ('change'),
    
    invalidMailConfirmation: function (model) {
        var complies, _t;
        
        _t  = this;
        
        if (!model.get ('user.email_confirmation').empty ()) {
            complies    = model.get ('user.email') === model.get ('user.email_confirmation');

            if (!complies) {
                this.qtip ({
                    content:    { text: 'Die E-Mail-Adresse stimmt nicht &uuml;berein.' },
                    style: {
                        classes: 'qtip-dark qtip-rounded qtip-shadow qtip-youtube',
                        tip: {
                            corner: 'bottom center'
                        }
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center',
                        target: _t
                    }
                });
                
                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');  }
                if (this.hasClass ('fadeOut'))   { this.removeClass ('fadeOut');  }
            } else {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                    $('.qtip').remove ();
                }
                
                if (!this.hasClass ('fadeOut'))   { this.addClass ('fadeOut');  }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            }
        } else {
            if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
            if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');     }
        }
    }
    .observes ('user.email_confirmation').on ('change')
    .observes ('user.email').on ('change'),
    
    validMailConfirmation: function (model) {
        var complies;
        
        if (!model.get ('user.email_confirmation').empty ()) {
            complies    = model.get ('user.email') === model.get ('user.email_confirmation');
            
            if (complies) {
                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');  }
                if (this.hasClass ('fadeOut'))   { this.removeClass ('fadeOut');  }
            } else {
                if (!this.hasClass ('fadeOut'))   { this.addClass ('fadeOut');  }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            }
        } else {
            if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
            if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');     }
        }
    }
    .observes ('user.email_confirmation').on ('change')
    .observes ('user.email').on ('change'),    
    
    givenMailConfirmation: function (model) {
        if (!model.get ('user.email_confirmation').empty ()) {
            if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            if (!this.hasClass ('fadeOut')) { this.addClass ('fadeOut');    }
        } else {
            if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut'); }
            if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');     }
        }
    }.observes ('user.email_confirmation').on ('change'),
    
    sendingUser: function (model) {
        if (model.get ('sendingUser')) {
            if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
        } else {
            if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
        }
    }.observes ('sendingUser').on ('change'),
    
    notSendingUser: function (model) {
        if (!model.get ('sendingUser')) {
            if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
        } else {
            if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
        }
    }.observes ('sendingUser').on ('change'),

    toggleBtnUserSettings: function () {
        if (np.auth.loggedIn () && np.checkout.isDifferentUser () && np.checkout.validOrigUser ()) {
            if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
        } else {
            if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
        }
    }.observes ('@each').on ('change')        
});