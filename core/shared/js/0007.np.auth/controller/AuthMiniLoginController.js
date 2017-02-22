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

np.controller.extend ('AuthMiniLoginController', {
    view:   'AuthMiniLoginView',
    model:  function () {
        var user;
        
        user            = np.auth.user ('user');
        user.sending    = false;
        user.error      = false;
        user.success    = false;
        
        return {Login: np.auth.user ('user')};
    },
    
    events: {
        setMail: function (node) {
            var mail;
            
            mail    = node.get ('email');
            
            this.set ('email', mail);
            
            np.auth.setMail ('user', mail);
        },
        
        setPassword: function (node) {
            var password;
            
            password    = node.get ('password');
            
            this.set ('password', password);

            np.auth.setPassword ('user', password);
        },
        
        submit: function () {
            var _this, email, password;
            
            _this       = this;
            email       = _this.get ('email');
            password    = _this.get ('password');
        
            if (!email.empty () && email.complies ('mail') && !password.empty ()) {
                this.set ('sending', true);

                np.auth.login ()
                .then (function (rsp) {
                    _this.set ('success', true);
                    _this.set ('sending', false);
                })
                .fail (function (error) {
                    _this.set ('password', '');
                    _this.set ('error', error);
                    _this.set ('sending', false);
                });
            }
        },
        
        logout: function () {
            var _this;
            
            _this   = this;

            this.set ('sending', true);
            
            np.auth.logout ()
            .then (function (rsp) {
                _this.set ('logout_success', true);
                _this.set ('sending', false);
            })
            .fail (function (error) {
                _this.set ('logout_error', error);
                _this.set ('sending', false);
            });
        },
        
        stayLoggedIn: function (view) {
            this.set ('stayLoggedIn', !this.get ('stayLoggedIn'));
            
            np.auth.setStayLoggedIn (this.get ('stayLoggedIn'));
        }
    }
});