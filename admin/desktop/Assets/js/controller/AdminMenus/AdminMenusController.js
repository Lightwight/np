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
        var tmpMenus, menus, currentMenu, parentID;
        
        tmpMenus        = new Array ();
        menus           = new Array ();
        currentMenu     = np.routeController.getRoute ();
        
        // Map menus into object:
        np.model.Admin_menus.findAll ()
        .orderBy ('order', 'asc')
        .each (function (row) {
            var menu;
            
            menu            = row.getAll ();
            menu.open       = currentMenu.indexOf (menu.route) > -1;
            menu.children   = new Array ();
            
            tmpMenus.push (menu);
        });
        
        // Assign child menus to parent menus:
        $.each (tmpMenus, function (inx, menuData) {
            if (menuData.parent > 0) {
                var inx;
                
                inx     = tmpMenus.map (function (o) { return o.id; }).indexOf (menuData.parent);
                tmpMenus[inx].children.push (menuData);
            }
        }); 
        
        // Remove all menus with empty children:
        $.each (tmpMenus, function (inx, menuData) {
            if (menuData.children.length === 0) {
                delete tmpMenus[inx].children;
            }
        });
        
        // Remove all menus on top level which are cild menus:
        $.each (tmpMenus, function (inx, menuData) {
            if (menuData.parent === 0) {
                menus.push (menuData);
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