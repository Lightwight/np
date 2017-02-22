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

np.module ('controller', (function () {
    var storage;
    
    storage =   {
        controller:         {},
        viewBindings:       {}
    };
    
    return {
        extend: function (id, options) {
            if ( typeof options.view === 'string' && typeof options.model === 'function'
                && typeof storage.controller[id] === 'undefined'
                && typeof storage.viewBindings[options.view] === 'undefined') {
                storage.controller[id]              = options;
                storage.viewBindings[options.view]  = id;
            }
        },
        
        getContextByView: function (viewName) {
            var view    = np.controller.getByView (viewName);
            
            if (view && typeof view.model !== 'undefined') {
                return view.model ();
            }
            
            return null;
        },
        
        getByView:  function (viewName) {
            if (typeof storage.viewBindings[viewName] !== 'undefined') {
                return storage.controller[storage.viewBindings[viewName]];
            }
            
            return false;
        },
        
        getByParentView: function (selector) {
            var view;
            
            if (selector.length > 0) {
                view    = selector.parents ('[data-type="view"]:first');
                
                return view.length > 0 ? this.getByView (view.data ('handle')) : false;
            }
            
            return false;
        }
    };
}()));