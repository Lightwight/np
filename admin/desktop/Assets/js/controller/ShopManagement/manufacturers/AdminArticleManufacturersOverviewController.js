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
np.controller.extend ('AdminArticleManufacturersOverviewController', (function () {
    var model;
    
    model   = 'Article_manufacturers';
    
    return {
        view:       'AdminArticleManufacturersOverviewView',
        model:      function () {
            var rows, sort, retVal;

            sort        = np.pagination.getSort ();
            rows        = new Array ();

            if (sort.sortBy && sort.sortOrder) {
                np.model[model].findAll ().orderBy (sort.sortBy, sort.sortOrder)
                .each (function (row) {
                    rows.push (np.jsonClone (row.getAll ()));
                });
            } else {
                np.model[model].findAll ()
                .each (function (row) {
                    rows.push (np.jsonClone (row.getAll ()));
                });
            }
            
            retVal          = {};
            retVal[model]   = rows;
            
            return retVal;
        }
    };
})());