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

np.controller.extend ('AdminArticleWarehousesOverviewSortableController', (function () {
    var model, retModel, route;
    
    model       = 'Article_warehouses';
    retModel    = 'AdminArticleWarehousesSortable';
    route       = '#/admin/shopmanagement/warehouses/';
    
    return {
        view:   'AdminArticleWarehousesOverviewSortableView',
        model:  function () {
            var retVal;
            
            retVal              = {};
            retVal[retModel]    = {
                id:             -1,
                sortByWarehouseID:      np.pagination.getSortOrder ('warehouse_id'),
                sortByName:             np.pagination.getSortOrder ('name')
            };
            
            return retVal;
        },

        events: {
            sortByWarehouseID: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByWarehouseID');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByWarehouseID', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/warehouse_id/'+sortOrder+'/'+search);
            },

            sortByName: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByName');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByName', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/name/'+sortOrder+'/'+search);
            }
        }
    };
})());