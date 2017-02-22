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

np.controller.extend ('AdminUpdateController', {
    view:   'AdminUpdateView',
    model:  function () {
        return {
            AdminUpdate: {
                id:             -1,
                updateable:     false,
                new_version:    0,
                errorOnUpdate:  false,
                
                sending:        false
            }
        };
    },
    
    events: {
        checkForUpdate: function () {
            var _t;
            
            _t  = this;

            np.update.checkForUpdate ()
            .then (function (response) {
                _t.set ('new_version', response.new_version);
                _t.set ('updateable', response.updateable);
            })
            .fail (function () {
                /*TODO: Something went wrong*/
            });
        },
        
        update: function () {
            var _t;
            
            _t  = this;
            
            _t.set ('sending', true);
            
            np.update.update ()
            .then (function (response) {
                _t.set ('sending', false);
                _t.set ('errorOnUpdate', false);
                
//                _t.set ('new_version', response.new_version);
//                _t.set ('updateable', response.updateable);
            })
            .fail (function () {
                _t.set ('sending', false);
                _t.set ('errorOnUpdate', true);
                /*TODO: Something went wrong*/
            });
        }
    }
});