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

np.controller.extend ('ProductsSearchResultController', (function () {
    function getSearchTerm () {
       return np.route.getRoute ().split ('/')[2];
    }
    
    function getOrder () {
        var route, orderBy, sortOrder;
        
        route   = np.route.getRoute ().split ('/');
        
        orderBy     = typeof route[4] !== 'undefined' ? route[4] : 'search_rank';
        sortOrder   = typeof route[5] !== 'undefined' ? route[5] : 'desc';
    
        return {orderBy: orderBy, sortOrder: sortOrder};
    }
    
    function sortProducts (products) {
        var order, orderBy, sortOrder;
        
        order       = getOrder ();
        orderBy     = order.orderBy;
        sortOrder   = order.sortOrder;
        
        products    = products.sort (function (a, b) {
            return sortOrder === 'desc' ? a[orderBy] < b[orderBy] : a[orderBy] > b[orderBy];
        });

        return products;
    }
    
    return {
        view:       'ProductsSearchResultView',
        model:  function () {
            var sLen, i, search, assigned, products;

            search      = getSearchTerm ().split ('-');
            sLen        = search.length;
            
            products    = new Array ();
            assigned    = new Array ();

            if ($.isArray (search)) {
                $.each (search, function (inx, searchValue) {
                    np.model.Products.findLikeManufacturerSlug (searchValue).each (function (row) {
                        if (assigned.indexOf (row.getArticleId ()) === -1) {
                            products.push (row.getAll ());

                            assigned.push (row.getArticleId ());
                        }
                    });

                    np.model.Products.findLikeName (searchValue).each (function (row) {
                        if (assigned.indexOf (row.getArticleId ()) === -1) {
                            products.push (row.getAll ());

                            assigned.push (row.getArticleId ());
                        }
                    });

                    np.model.Products.findLikeArticleId (searchValue).each (function (row) {
                        if (assigned.indexOf (row.getArticleId ()) === -1) {
                            products.push (row.getAll ());

                            assigned.push (row.getArticleId ());
                        }
                    });

                    np.model.Products.findLikeBookmark (searchValue).each (function (row) {
                        if (assigned.indexOf (row.getArticleId ()) === -1) {
                            products.push (row.getAll ());

                            assigned.push (row.getArticleId ());
                        }
                    });

                    np.model.Products.findLikeCategory (searchValue).each (function (row) {
                        if (assigned.indexOf (row.getArticleId ()) === -1) {
                            products.push (row.getAll ());

                            assigned.push (row.getArticleId ());
                        }
                    });                    
                });
            }
            
            return {Products: sortProducts (products)};
        }
    };
})());