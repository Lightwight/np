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

np.controller.extend ('AdminArticleWarehousesOverviewSearchController', (function () {
    var model, returnModel, route, defaultSort;
    
    model       = 'Article_warehouse';
    returnModel = 'AdminArticleWarehousesSearch';
    route       = '#/admin/shopmanagement/warehouses/1';
    defaultSort = 'name';
    
    return {
        view:   'AdminArticleWarehousesOverviewSearchView',
        model:  function () {
            var retVal;
            
            retVal                  = {};
            retVal[returnModel]     = {
                id:         -1,
                search:     np.pagination.getSearch (),
                sentSearch: np.pagination.getSearch ()
            };

            return retVal;
        },

        events: {
            search: function (view) {
                var sort, sortBy, sortOrder, search;

                search      = view.get ('search');

                if (search.length > 0) {
                    sort        = np.pagination.getSort ();

                    sortBy      = sort.sortBy ? '/'+sort.sortBy : '/'+defaultSort;
                    sortOrder   = sort.sortOrder ? '/'+sort.sortOrder : '/asc';

                    this.set ('sentSearch', search);

                    np.model[model].flush ();
                    np.routeTo (route+sortBy+sortOrder+'/'+search);
                }
            },

            setSearch: function (view) {
                this.set ('search', view.get ('search'));
            },

            clearSearch: function () {
                var sort, sortBy, sortOrder;

                this.set ('search', '');
                this.set ('sentSearch', '');

                sort        = np.pagination.getSort ();

                sortBy      = sort.sortBy ? '/'+sort.sortBy : '/'+defaultSort;
                sortOrder   = sort.sortOrder ? '/'+sort.sortOrder : '/asc';

                np.model[model].flush ();
                np.routeTo (route+sortBy+sortOrder);
            }
        }
    };
})());