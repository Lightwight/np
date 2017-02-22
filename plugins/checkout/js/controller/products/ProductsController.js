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

np.controller.extend ('ProductsController', (function () {
    function getCategory () {
        return np.route.getRoute ().split ('/').filter (function (value) {return !value.empty ();})[0];
    }
    
    return {
        view:       'ProductsView',

        model:  function () {
            var products, category, sort, limit, page, total,
                offset;

            sort        = np.pagination.getSort ('/alle');
            products    = new Array ();
            category    = getCategory ();
            limit       = np.pagination.getLimit ('Products');
            page        = np.pagination.getPage (1);
            total       = np.pagination.getTotal ('Products');
            offset      = limit * (page-1);

            np.model.Products.findByCategorySlug (category).orderBy (sort.sortBy, sort.sortOrder).limit (offset, limit).each (function (row) {
                products.push (row.getAll ());
            });
            
            return {Products: products};
        }
    };
})());