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

np.controller.extend ('AdminMenuSubChildController', {
    view:   'AdminMenuSubChildView',
    model:  function () {
        return {
            AdminMenuSubChild: this
        };
    },
    
    events: {
        openLink: function (model) {
            var observables, childMenus;
            
            if (!this.get ('open')) {
                observables = np.observable.getObservables ();

                if (typeof observables.actionEvents.AdminMenuSubChild !== 'undefined') {
                    childMenus  = observables.actionEvents.AdminMenuSubChild;

                    $.each (childMenus, function (inx, val) {
                        np.observable.update ('AdminMenuSubChild', parseInt (inx, 10), 'open', false);
                    });
                }

                this.set ('open', true);
            }
        }
    }
});