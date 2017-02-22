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

np.controller.extend ('BreadcrumbController', (function () {
    return {
        view:   'BreadcrumbView',
        model:  function () {
            var path, parentPath, breadcrumbs, crumbs;
            
            parentPath  = '/';
            path        = ('home'+np.address.getPath ()).split ('/');
            breadcrumbs = np.breadcrumb.getBreadcrumbs  ();
            
            crumbs      = $.map (path, function (val, key) {
                var lSlug, sVal, result;
                
                lSlug   = val.toLowerCase ();
                sVal    = typeof breadcrumbs[val] !== 'undefined' ? breadcrumbs[val] : val;
                
                if (sVal !== '') {
                    result  = {
                        link:   val !== 'home' ? parentPath+val : '/',
                        chain:  sVal.slice (0, 1).toUpperCase ()+sVal.slice (1)
                    };
                }

                parentPath  += (val !== 'home' ? val+'/' : '');
                
                return result;
            });

            return {
                Breadcrumb: {
                    id: -1,
                    crumbs: crumbs
                }
            };
        }
    };
})());