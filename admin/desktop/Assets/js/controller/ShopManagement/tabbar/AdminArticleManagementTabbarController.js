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

np.controller.extend ('AdminArticleManagementTabbarController', {
    view:   'AdminArticleManagementTabbarView',
    model:  function () {
        var currentMenu, menus;

        currentMenu = '/'+np.route.getBookmarkItem (true);
        menus       = new Array ();

        np.model.Admin_menus.findLikeRoute ('/admin/shopmanagement/')
        .each (function (row) {
            var menu;
    
            menu        = row.getAll ();
            menu.active = menu.route === currentMenu;

            menus.push (menu);
        });

        return {
            AdminArticleManagementTabbar: {
                id:     -1,
                menus:  menus
            }
        };
    }
});