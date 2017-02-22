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

np.controller.extend ('AdminArticleCategoriesOverviewSearchController', {
    view:   'AdminArticleCategoriesOverviewSearchView',
    model:  function () {

        return {
            AdminArticleCategoriesSearch: {
                id:         -1,
                search:     np.pagination.getSearch (),
                sentSearch: np.pagination.getSearch ()
            }
        };
    },

    events: {
        search: function (view) {
            var sort, sortBy, sortOrder, search;

            search      = view.get ('search');

            if (search.length > 0) {
                sort        = np.pagination.getSort ();

                sortBy      = sort.sortBy ? '/'+sort.sortBy : '/keybeschreibung';
                sortOrder   = sort.sortOrder ? '/'+sort.sortOrder : '/asc';

                this.set ('sentSearch', search);

                np.model.Article_categories.flush ();
                np.routeTo ('#/admin/shopmanagement/categories/1'+sortBy+sortOrder+'/'+search);
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

            sortBy      = sort.sortBy ? '/'+sort.sortBy : '/keybeschreibung';
            sortOrder   = sort.sortOrder ? '/'+sort.sortOrder : '/asc';

            np.model.Article_categories.flush ();
            np.routeTo ('#/admin/shopmanagement/categories/1'+sortBy+sortOrder);
        }
    }
});