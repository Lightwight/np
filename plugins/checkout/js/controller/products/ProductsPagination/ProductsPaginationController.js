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

np.controller.extend ('ProductsPaginationController', (function () {
    function getCategory () {
        var parts;

        parts   = np.route.getRoute ().split ('/');
        
        return typeof parts[2] !== 'undefined' ? parts[2] : 'alle';
    }
    
    return {
        view:   'ProductsPaginationView',
        model:  function () {
            var model, pagination, category, sortables;

            model   = (function (_t) {
                for (var i in _t) {
                    return i.slice (0, 1).toLowerCase () + i.slice (1);
                }
            }(this));

            category    = '/'+getCategory ();
            sortables   = {
                name:   'Name',
                price:  'Preis',
            };

            pagination = np.pagination.generateModel (model, sortables, category);

            return pagination;
        }    
    };
})());