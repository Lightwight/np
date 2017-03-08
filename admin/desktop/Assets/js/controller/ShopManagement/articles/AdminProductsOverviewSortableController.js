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

np.controller.extend ('AdminProductsOverviewSortableController', (function () {
    function getFilter () {
        var search, map;
        
        map     = {
            all:            0,
            'not-deleted':  1,  
            deleted:        2
        };
        
        search  = np.pagination.getSearch ().split ('/').slice (1);
        
        return search.length > 0 && typeof map[search[0]] !== 'undefined' ? map[search[0]] : 1;
    }
    
    return {
        view:   'AdminProductsOverviewSortableView',
        model:  function () {
            return {
                AdminArticlesSortable: {
                    id:                 -1,
                    sortByProductID:    np.pagination.getSortOrder ('id'),
                    sortByName:         np.pagination.getSortOrder ('name'),
                    sortByCategory:     np.pagination.getSortOrder ('category'),
                    sort:               {sortOrder: np.pagination.getSortOrder ('id'), column: 'id'},
                    filter:             getFilter ()
                }
            };
        },

        events: {
            sortByProductID: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sort');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByProductID', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'id'});

                np.model.Products.flush ();
                np.routeTo ('#/admin/shopmanagement/articles/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
            },

            sortByName: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByName');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByName', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'name'});

                np.model.Products.flush ();
                np.routeTo ('#/admin/shopmanagement/articles/'+np.pagination.getPage ()+'/name/'+sortOrder+'/'+search);
            },

            sortByCategory: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByCategory');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByCategory', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'category'});

                np.model.Products.flush ();
                np.routeTo ('#/admin/shopmanagement/articles/'+np.pagination.getPage ()+'/category/'+sortOrder+'/'+search);
            }
        }
    };
})());