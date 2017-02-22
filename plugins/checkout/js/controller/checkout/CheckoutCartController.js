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

np.controller.extend ('CheckoutCartController', {
    view:       'CheckoutCartView',
    
    model:      function () {
        return {
            CartData: {
                id:             -1, 
                hasArticles:    np.Cart.getAmount ().amount > 0,
                categories:     (function () {
                    var articles, article, catMap, catID, categories, 
                    i, l, j;
                    
                    articles    = np.Cart.getProducts ();
                    categories  = {};
                    catMap      = {};

                    l           = $.isArray (articles) ? articles.length : 0;
                    
                    for (i=0; i<l; i++) {
                        article     = articles[i];
                        catID       = parseInt (article.category_id, 10);
                        
                        if (typeof catMap[catID] === 'undefined') {
                            np.model.Article_categories.findByKeyKategorie (catID).each (function (row) {
                                var cName;

                                cName           = row.getKeyName ();
                                catMap[catID]   = cName;

                                categories[cName]   = {id: catID, name: cName, rows: new Array ()};
                            });
                        }
                        
                        categories[catMap[catID]].rows.push (article);
                    }

                    categories  = (function(s){var t={};Object.keys(s).sort().forEach(function(k){t[k]=s[k]});return t})(categories);
                    
                    for (j in categories) {
                        categories[j].rows.sort (function (a, b) {
                            var cA, cB;
                            
                            cA  = a.name.toLowerCase ().replace (/[\W_]+/gim, '');
                            cB  = b.name.toLowerCase ().replace (/[\W_]+/gim, '');
                            
                            return (cA < cB) ? -1 : (cA > cB ? 1 : 0);
                        });
                    }

                    return categories;
                }())
            }
        };
    },
    
    events: {
        closeCart: function (view) {
            var cartView;

            cartView    = $('[data-handle="CartView"]');

            if (cartView.hasClass ('open')) { cartView.removeClass ('open');    }
        }
    }
});