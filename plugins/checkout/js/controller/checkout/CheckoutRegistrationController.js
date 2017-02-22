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

np.controller.extend ('CheckoutRegistrationController', {
    view: 'CheckoutRegistrationView',
    model: function () {
        return {Register: np.auth.user ('register')};
    },
    
    events: {
        setMail: function (node) {
            var mail;
            
            mail    = node.get ('email');
            
            this.set ('email', mail);
            np.auth.setMail ('register', mail);
        },
        
        setMailConfirmation: function (node) {
            this.set ('email_confirmation', node.get ('email_confirmation'));
        },
        
        setPassword: function (node) {
            var password;
            
            password    = node.get ('password');
            
            this.set ('password', password);
            np.auth.setPassword('register', password);
        },
        
        setPasswordConfirmation: function (node) {
            this.set ('password_confirmation', node.get ('password_confirmation'));
        },

        register: function () {
            var _this, validMail, validMailConfirmation,
            validPassword, validPasswordConfirmation,
            len, strength;
    
            _this                   = this;
    
            len                     = this.get ('password').length;
            strength                = this.get ('password').strength ();

            validMail               = this.get ('email').complies ('mail');
            validMailConfirmation   = this.get ('email') === this.get ('email_confirmation');

            validPassword               = len >= 4 && strength >= 2;
            validPasswordConfirmation   = this.get ('password') === this.get ('password_confirmation');
    
            if (validMail && validMailConfirmation && validPassword && validPasswordConfirmation) {
                _this.set ('sending', true);

                np.auth.register ()
                .then (function () {
                    _this.set ('sending', false);
                    _this.set ('success', true);
                })
                .fail (function (error) {
                    _this.set ('sending', false);
                    _this.set ('error', error);
                });
            }
        }
    }
});