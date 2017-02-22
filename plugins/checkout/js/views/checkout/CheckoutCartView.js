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

np.view.extend ('CheckoutCartView', (function () {
    function generateCategory (catID, article) {
        var html, $html;
        
        html    = '<div class="cart-category-container" data-category-id="'+catID+'">';
        html   += '</div>';
        
        $html   = $(html);
        
        $html.append (np.handlebars.parseTemplate ('CartProductView', article));

        return $html;
    }
    
    return {
        showCart:   function (model) {
            if (model.get ('hasArticles')) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        }.observes ('hasArticles').on ('change'),

        showEmptyCart: function (model) {
            if (model.get ('hasArticles')) {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            } else {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            }
        }.observes ('hasArticles').on ('change'),

        amountChanged: function (model) {
            var cartArticles, cArticle, cAmount, artID, artName, currentArticles, cID, cName,
                cRows, fRow, id,
                container, nodes, inserted, htmlCategory,
                i, l;

            cartArticles    = np.Cart.getProducts ();
            currentArticles = model.get ('categories');

            l               = cartArticles.length;

            for (i=0; i<l; i++) {
                cArticle    = cartArticles[i];
                cID         = parseInt (cArticle.category_id, 10);
                id          = parseInt (cArticle.id, 10);
                artID       = cArticle.article_id;
                artName     = cArticle.name.replace (/[\W_]+/gim, '');

                cAmount     = parseInt (cArticle.amount, 10);
                cName       = (function () {
                    var name;

                    np.model.Article_categories.findByKeyKategorie (cID).each (function (row) {
                        name    = row.getKeyName ();
                    });

                    return name;
                }());

                if (typeof currentArticles[cName] !== 'undefined') {
                    // Category is in cart.
                    // Check if article is in cart:
                    cRows   = currentArticles[cName].rows;
                    fRow    = false;

                    $.map (cRows, function (val) {
                        if (val.article_id === artID) {
                            fRow    = val;
                        }
                    });

                    if (fRow) {
                        // Article is in cart. We have to change its amount:
                        np.observable.update ('CartProduct', id, 'amount', cAmount);
                    } else {
                        // Article isn't in cart. We have to add it:
                        container   = $('#checkout-cart .cart-category-container[data-category-id="'+cID+'"]');
                        nodes       = container.find ('[data-handle="CartProductView"]');
                        inserted    = false;

                        nodes.each (function () {
                            var name;

                            name    = $(this).find ('.product-name a').html ().replace (/[\W_]+/gim, '');

                            if (name > artName) {
                                np.handlebars.parseTemplate ('CartProductView', cArticle).insertBefore ($(this));
                                inserted    = true;

                                return false;
                            }
                        });

                        if (!inserted) {
                            container.append (np.handlebars.parseTemplate ('CartProductView', cArticle));
                        }
                    }
                } else {
                    // Category and article is not in Cart.
                    // We have to add both:
                    inserted        = false;
                    htmlCategory    = generateCategory (cID, cArticle);
                    
                    $('#checkout-cart .cart-category-container').each (function (row) {
                        var _this, tName, tID, 
                        
                        _this           = $(this);
                        tID             = parseInt ($(this).data ('category-id'), 10);
                        
                        np.model.Article_categories.findByKeyKategorie (tID).each (function (row) {
                            tName   = row.getKeyName ().replace (/[\W_]+/gim, '');

                            if (tName > cName) {
                                
                                htmlCategory.insertBefore (_this);
                                
                                inserted    = true;
                                
                                return false;
                            }
                        });
                        
                        if (inserted)   { return false; }
                    });
                    
                    if (!inserted) {
                        $('#checkout-cart .cart-outer-container').append (htmlCategory);
                    }
                }
            }

            np.observable.update ('CartData', -1, 'categories', (function () {
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

                for (j in categories) {
                    categories[j].rows.sort (function (a, b) {
                        var cA, cB;

                        cA  = a.name.toLowerCase ().replace (/[\W_]+/gim, '');
                        cB  = b.name.toLowerCase ().replace (/[\W_]+/gim, '');

                        return (cA < cB) ? -1 : (cA > cB ? 1 : 0);
                    });
                }

                return categories;
            }()));
        }.observes ('hasArticles').on ('change')
    };
}()));