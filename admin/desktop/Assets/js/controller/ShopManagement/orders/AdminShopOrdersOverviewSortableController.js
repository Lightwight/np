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

np.controller.extend ('AdminShopOrdersOverviewSortableController', (function () {
    function getFilter () {
        var search, map;
        
        map     = {
            all:            0,
            'new':          1,  
            processing:     2,
            delivered:      3,
            paid:           4,
            not_paid:       5,
            finished:       6,
            failed:         7
        };
        
        search  = np.pagination.getSearch ().split ('/').slice (1);
        
        return search.length > 0 && typeof map[search[0]] !== 'undefined' ? map[search[0]] : 1;
    }
    
    return {
        view:   'AdminShopOrdersOverviewSortableView',
        model:  function () {
            return {
                AdminOrdersSortable: {
                    id:                 -1,
                    sortByOrderID:      np.pagination.getSortOrder ('id'),
                    sortByName:         np.pagination.getSortOrder ('name'),
                    sortByMail:         np.pagination.getSortOrder ('email'),
                    sort:               {sortOrder: np.pagination.getSortOrder ('id'), column: 'id'},
                    filter:             getFilter ()
                }
            };
        },

        events: {
            setFilter: function (view) {
                var filter, sort, sortOrder, sortColumn, currOrder, search, sAppend;

                filter          = parseInt (view.get ('ord_filter'), 10);
                sAppend         = '';

                if (filter === 1)   { sAppend = 'new';          }
                if (filter === 2)   { sAppend = 'processing';   }
                if (filter === 3)   { sAppend = 'delivered';    }
                if (filter === 4)   { sAppend = 'paid';         }
                if (filter === 5)   { sAppend = 'not_paid';     }
                if (filter === 6)   { sAppend = 'finished';     }
                if (filter === 7)   { sAppend = 'failed';       }

                sort            = this.get ('sort');
                currOrder       = sort.sortOrder;
                sortColumn      = sort.column;
                sortOrder       = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search          = np.pagination.getSearch ();

                if (search.empty ()) { search  = 'all'; }
                else {
                    search  = search.split ('/')[0];
                }

                np.model.User_orders.flush ();
                np.routeTo ('#/admin/shopmanagement/orders/'+np.pagination.getPage ()+'/'+sortColumn+'/'+sortOrder+'/'+search+sAppend);
            },

            sortByOrderID: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sort');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByOrderID', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'id'});

                np.model.User_orders.flush ();
                np.routeTo ('#/admin/shopmanagement/orders/'+np.pagination.getPage ()+'/id/'+sortOrder+'/'+search);
            },

            sortByName: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByName');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByName', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'name'});

                np.model.User_orders.flush ();
                np.routeTo ('#/admin/shopmanagement/orders/'+np.pagination.getPage ()+'/name/'+sortOrder+'/'+search);
            },

            sortByMail: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByMail');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByMail', sortOrder);
                this.set ('sort', {sortOrder: sortOrder, column: 'email'});

                np.model.User_orders.flush ();
                np.routeTo ('#/admin/shopmanagement/orders/'+np.pagination.getPage ()+'/email/'+sortOrder+'/'+search);
            }
        }
    };
})());