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

np.controller.extend ('AdminUsersOverviewSortableController', {
    view:   'AdminUsersOverviewSortableView',
    model:  function () {
        return {
            AdminUserSortable: {
                id:             -1,
                sortByID:       np.pagination.getSortOrder ('id'),
                sortByRole:     np.pagination.getSortOrder ('role'),
                sortByGender:   np.pagination.getSortOrder ('gender'),
                sortByName:     np.pagination.getSortOrder ('name'),
                sortByPrename:  np.pagination.getSortOrder ('prename'),
                sortByMail:     np.pagination.getSortOrder ('email')
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

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
        },

        sortByRole: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByRole');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByRole', sortOrder);

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/role/'+sortOrder+'/'+search);
        },

        sortByGender: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByGender');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByGender', sortOrder);

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/gender/'+sortOrder+'/'+search);
        },

        sortByName: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByName');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByName', sortOrder);

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/name/'+sortOrder+'/'+search);
        },

        sortByPrename: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByPrename');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByPrename', sortOrder);

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/prename/'+sortOrder+'/'+search);
        },

        sortByMail: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByMail');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByMail', sortOrder);

            np.model.Users.flush ();
            np.routeTo ('#/admin/usermanagement/users/'+np.pagination.getPage ()+'/email/'+sortOrder+'/'+search);
        }
    }
});