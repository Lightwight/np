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

np.controller.extend ('ProductDependenciesController', {
    view:       'ProductDependenciesView',
    orderBy:    'article_id',

    model:  function () {
        var product, deps, products,
            i, l;
        
        products    = new Array ();
        
        if (typeof this.Product !== 'undefined' 
            && typeof this.Product.dependencies !== 'undefined' 
            && $.isArray (this.Product.dependencies)
        ) {
            product = np.jsonClone (this.Product);
            deps    = product.dependencies;
            
            l       = deps.length;
            
            for (i=0; i<l; i++) {
                np.model.Products.findByArticleId (deps[i]).each (function (row) {
                    
                    products.push (row.getAll ());
                });
            }
        }

        return {Products: products};
    }
});