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

np.controller.extend ('AdminRolesOverviewSortableController', {
    view:   'AdminRolesOverviewSortableView',
    model:  function () {
        return {
            AdminRoleSortable: {
                id:             -1,
                sortByID:       np.pagination.getSortOrder ('id'),
                sortByGroup:    np.pagination.getSortOrder ('group')
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

            np.model.Auth_groups.flush ();
            np.routeTo ('#/admin/usermanagement/roles/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
        },

        sortByGroup: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByGroup');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByGroup', sortOrder);

            np.model.Auth_groups.flush ();
            np.routeTo ('#/admin/usermanagement/roles/'+np.pagination.getPage ()+'/group/'+sortOrder+'/'+search);
        }
    }
});