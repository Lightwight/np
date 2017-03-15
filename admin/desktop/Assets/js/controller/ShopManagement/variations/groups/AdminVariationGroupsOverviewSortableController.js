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

np.controller.extend ('AdminVariationGroupsOverviewSortableController', {
    view:   'AdminVariationGroupsOverviewSortableView',
    model:  function () {
        return {
            AdminVariationGroupsSortable: {
                id:                 -1,
                sortByGroupID:      np.pagination.getSortOrder ('group_id'),
                sortByGroupName:    np.pagination.getSortOrder ('group_name')
            }
        };
    },

    events: {
        sortByGroupID: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByGroupID');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByGroupID', sortOrder);

            np.model.Article_variation_groups.flush ();
            np.routeTo ('#/admin/shopmanagement/variations/groups/'+np.pagination.getPage ()+'/group_id/'+sortOrder+'/'+search);
        },

        sortByGroupName: function () {
            var sortOrder, currOrder, search;

            currOrder   = this.get ('sortByGroupName');
            sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
            search      = np.pagination.getSearch ();

            this.set ('sortByGroupName', sortOrder);

            np.model.Article_variation_groups.flush ();
            np.routeTo ('#/admin/shopmanagement/variations/groups/'+np.pagination.getPage ()+'/group_name/'+sortOrder+'/'+search);
        }
    }
});