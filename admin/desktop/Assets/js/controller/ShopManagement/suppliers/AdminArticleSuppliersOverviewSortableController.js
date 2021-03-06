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

np.controller.extend ('AdminArticleSuppliersOverviewSortableController', (function () {
    var model, retModel, route;
    
    model       = 'Article_suppliers';
    retModel    = 'AdminArticleSuppliersSortable';
    route       = '#/admin/shopmanagement/suppliers/';
    
    return {
        view:   'AdminArticleSuppliersOverviewSortableView',
        model:  function () {
            var retVal;
            
            retVal              = {};
            retVal[retModel]    = {
                id:             -1,
                sortBySupplierID:       np.pagination.getSortOrder ('supplier_id'),
                sortByName:             np.pagination.getSortOrder ('name'),
                sortByCity:             np.pagination.getSortOrder ('city')
            };
            
            return retVal;
        },

        events: {
            sortBySupplierID: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortBySupplierID');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortBySupplierID', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/supplier_id/'+sortOrder+'/'+search);
            },

            sortByName: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByName');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByName', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/name/'+sortOrder+'/'+search);
            },
            
            sortByCity: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByCity');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByCity', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/city/'+sortOrder+'/'+search);
            }
        }
    };
})());