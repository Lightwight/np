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

np.controller.extend ('AuthMobileNavLoginController', {
    view:   'AuthMobileNavLoginView',
    model:  function () {
        var user;
        
        user            = np.auth.user ('user');
        user.sending    = false;
        user.error      = false;
        user.success    = false;
        
        return {Login: np.auth.user ('user')};
    },
    
    events: {
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
        }
    }
});