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

np.controller.extend ('AdminArticleUnitsOverviewSortableController', (function () {
    var model, retModel, route;
    
    model       = 'Taxes';
    retModel    = 'AdminArticleTaxesSortable';
    route       = '#/admin/shopmanagement/taxes/';
    
    return {
        view:   'AdminArticleTaxesOverviewSortableView',
        model:  function () {
            var retVal;
            
            retVal              = {};
            retVal[retModel]    = {
                id:             -1,
                sortByTaxID:    np.pagination.getSortOrder ('tax_id'),
                sortByTax:      np.pagination.getSortOrder ('tax')
            };
            
            return retVal;
        },

        events: {
            sortByTaxID: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByTaxID');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByTaxID', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/tax_id/'+sortOrder+'/'+search);
            },

            sortByTax: function () {
                var sortOrder, currOrder, search;

                currOrder   = this.get ('sortByTax');
                sortOrder   = currOrder === 'none' ? 'asc' : (currOrder === 'desc' ? 'none' : 'desc');
                search      = np.pagination.getSearch ();

                this.set ('sortByTax', sortOrder);

                np.model[model].flush ();
                np.routeTo (route+np.pagination.getPage ()+'/tax/'+sortOrder+'/'+search);
            }
        }
    };
})());