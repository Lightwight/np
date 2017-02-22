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

np.controller.extend ('AdminMenusController', {
    view:       'AdminMenusView',
    
    model:  function () {
        var menus, currentMenu, parentID;
        
        menus           = new Array ();
        currentMenu     = np.routeController.getRoute ();

        np.model.Admin_menus.findAll ()
        .each (function (row) {
            var menu;
    
            menu        = np.jsonClone (row.getAll ());
            parentID    = menu.parent;
            menu.open   = menu.route === currentMenu;

            if (parentID === 0) {
                menus.push (menu);
                
                if (typeof menus.children !== 'undefined') { delete menus.children; }
            } else {
                $.each (menus, function (inx, menuData) {
                    if (menuData.id === parentID) {
                        if (typeof menus[inx].children === 'undefined') {
                            menus[inx].children = new Array ();
                        }                        
                        
                        menus[inx].children.push (menu);
                        
                        return false;
                    }
                });
            }
        });
        
        $.each (menus, function (inx, menu) {
            if (typeof menu.children !== 'undefined') {
                menus[inx].children.sort (function (a, b) {
                    return a.order - b.order;
                });
            }
        });
        
        return {
            AdminMenus: {
                id: -1,
                menus: menus
            }
        };
    }
});