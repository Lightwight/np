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

np.controller.extend ('ProductSearchController', {
    view:   'ProductSearchView',
    model:  function () {
        return {ProductSearch: {id:-1, search: '', searching: false}};
    },
    
    events: {
        searchProduct: function (view) {
            var _t, search;
            
            _t      = this;
            search  = _t.get ('search');
            
            if (!search.empty ()) {
                _t.set ('searching', true);
                
                np.model.Products.flush ();
                
                np.routeTo ('/#/search/'+np.slugify (_t.get ('search')));
            }
        },
        
        setSearch: function (view) { this.set ('search', view.get ('search'));  }
    }
});