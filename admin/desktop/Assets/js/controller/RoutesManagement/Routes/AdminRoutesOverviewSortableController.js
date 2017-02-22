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

np.controller.extend ('AdminRoutesOverviewSortableController', {
    view:   'AdminRoutesOverviewSortableView',
    model:  function () {
        return {
            AdminRouteSortable: {
                id:             -1,
                sortByID:       np.pagination.getSortOrder ('id'),
                sortByTitle:    np.pagination.getSortOrder ('title'),
                sortByRoute:    np.pagination.getSortOrder ('route'),
                sortByScope:    np.pagination.getSortOrder ('scope')
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

            np.model.Routes.flush ();
            np.routeTo ('#/admin/routesmanagement/routes/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
        },

        sortByTitle: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByTitle');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByTitle', sortOrder);

            np.model.Routes.flush ();
            np.routeTo ('#/admin/routesmanagement/routes/'+np.pagination.getPage ()+'/title/'+sortOrder+'/'+search);
        },

        sortByRoute: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByRoute');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByRoute', sortOrder);

            np.model.Routes.flush ();
            np.routeTo ('#/admin/routesmanagement/routes/'+np.pagination.getPage ()+'/route/'+sortOrder+'/'+search);
        },

        sortByScope: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByScope');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByScope', sortOrder);

            np.model.Routes.flush ();
            np.routeTo ('#/admin/routesmanagement/routes/'+np.pagination.getPage ()+'/scope/'+sortOrder+'/'+search);
        }
    }
});