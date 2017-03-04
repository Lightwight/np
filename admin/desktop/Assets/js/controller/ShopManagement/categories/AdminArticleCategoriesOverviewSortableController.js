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

np.controller.extend ('AdminArticleCategoriesOverviewSortableController', {
    view:   'AdminArticleCategoriesOverviewSortableView',
    model:  function () {
        return {
            AdminArticleCategoriesSortable: {
                id:                     -1,
                sortByID:               np.pagination.getSortOrder ('id'),
                sortByName:             np.pagination.getSortOrder ('keybeschreibung'),
                sortByKeyOberkategorie: np.pagination.getSortOrder ('keybberkategorie'),
                sortBySort:             np.pagination.getSortOrder ('sort')
            }
        };
    },

    events: {
        sortByID: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByID');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByID', sortOrder);

            np.model.Article_categories.flush ();
            np.routeTo ('#/admin/shopmanagement/categories/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
        },

        sortByName: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByName');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByName', sortOrder);

            np.model.Article_categories.flush ();
            np.routeTo ('#/admin/shopmanagement/categories/'+np.pagination.getPage ()+'/keybeschreibung/'+sortOrder+'/'+search);
        },

        sortBySort: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortBySort');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortBySort', sortOrder);

            np.model.Article_categories.flush ();
            np.routeTo ('#/admin/shopmanagement/categories/'+np.pagination.getPage ()+'/sort/'+sortOrder+'/'+search);
        },

        sortByKeyOberkategorie: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByKeyOberkategorie');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByKeyOberkategorie', sortOrder);

            np.model.Article_categories.flush ();
            np.routeTo ('#/admin/shopmanagement/categories/'+np.pagination.getPage ()+'/keyoberkategorie/'+sortOrder+'/'+search);
        }
    }
});