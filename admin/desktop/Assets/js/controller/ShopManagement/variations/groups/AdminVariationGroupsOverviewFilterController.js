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

np.controller.extend ('AdminVariationGroupsOverviewFilterController', (function () {
    function getFilter () {
        var map, sTerms, search;
        
        map     = new Array ('all', 'not-deleted', 'deleted');
        
        sTerms  = np.pagination.getSearch ();
        search  = sTerms.split ('/').slice (1);
        
        if (search.length === 0) {
            search  = new Array ();
            
            search.push (sTerms);
        }

        return search.length > 0 && $.inArray (search[0], map) > -1 ? search[0] : 'not-deleted';
    }

    return {
        view:   'AdminVariationGroupsOverviewFilterView',
        model:  function () {
            return {
                AdminVariationGroupsFilter: {
                    id:     -1,
                    filter: getFilter (),
                    sort:   {sortOrder: np.pagination.getSortOrder ('id'), column: 'id'}
                }
            };
        },
        
        events: {
            setFilter: function (view) {
                var filter, sort, sortOrder, sortColumn, currOrder, search, sAppend;

                filter          = view.get ('pr_filter');
                sAppend         = filter === 'all' ? '' : '/'+filter;
                sort            = this.get ('sort');
                currOrder       = sort.sortOrder;
                sortColumn      = sort.column;
                sortOrder       = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search          = np.pagination.getSearch ();

                if (search.empty ()) { search  = 'all'; }
                else {
                    search  = search.split ('/')[0];
                }

                np.model.Article_variation_groups.flush ();
                np.routeTo ('#/admin/shopmanagement/variations/groups/'+np.pagination.getPage ()+'/'+sortColumn+'/'+sortOrder+'/'+search+sAppend);
            }
        }
    };
})());