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

np.controller.extend ('ProductsRecentController', {
    view:       'ProductsRecentView',
    orderBy:    'rank desc',

    model:  function () {
        var products, prBookmark, splitted, inx;
        
        products    = new Array ();
        
        prBookmark  = np.route.getBookmarkItem (true);
        splitted    = prBookmark.split ('/');
        
        prBookmark  = '/shop/'+splitted[1];
        
        inx         = 0;
        
        np.model.Products.findAll (0).each (function (row) {
            if (row.getBookmark () !== prBookmark && row.getStock () > 0 && inx < 10) {
                products.push (row.getAll ());
                
                inx++;
            }
        });
        
        return {Products: products};
    }
});