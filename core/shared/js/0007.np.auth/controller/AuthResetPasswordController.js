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

np.controller.extend ('AuthResetPasswordCondtoller', {
    view:   'AuthResetPasswordView',
    model:  function () {
        var authData;
        
        authData            = np.auth.user ('reset');
        authData.sending    = false;
        
        return {AuthReset: authData};
    },
    
    events: {
        setResetCode: function (node) {
            this.set ('pw_temp', node.get ('pw_temp'));
        },
        
        setPassword: function (node) {
            this.set ('password', node.get ('password'));
        },
        
        setPasswordConfirmation: function (node) {
            this.set ('password_confirmation', node.get ('password_confirmation'));
        },
        
        submit: function (view) {
            var _this;
            
            _this   = this;
            
            this.set ('sending', true);
            
            np.auth.setNewPassword (this.get ('pw_reset'), this.get ('pw_temp'), this.get ('password'))
            .then (function () {
                _this.set ('success', true);
                _this.set ('sending', false);
                
                view.rerender ('UserResetPasswordView');
            })
            .fail (function (error) {
                _this.set ('error', error);
                _this.set ('sending', false);
            });
        }
    }
});