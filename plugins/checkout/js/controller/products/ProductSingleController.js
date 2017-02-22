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

np.controller.extend ('ProductSingleController', {
    view:   'ProductSingleView',
    model:  function () {
        var prBookmark, splitted, variation, product,
            found, varCombs, variations, varName,
            varKey, found, amountInCart, stock,
            i, j; 
        
        prBookmark  = np.route.getBookmarkItem (true);
        splitted    = prBookmark.split ('/');
        variation   = typeof this !== window 
                      && $.isArray (this.selectedVariations) 
                      && this.selectedVariations.length > 0 
                      ? np.slugify (np.Product.getSelectedVariation (this).Name)
                      : (splitted.length === 3 ? splitted[2] : false);

        prBookmark  = '/product/'+splitted[1];

        np.model.Products.findByBookmark (prBookmark).each (function (row) {
            product = np.Product.getCompleteProduct (row.getAll ());
        });

        if (product) {
            if (variation) {
                found       = false;
                varCombs    = product.variations;

                for (i in varCombs) {
                    variations  = varCombs[i];

                    for (j in variations) {
                        if (typeof variations[j] === 'object'
                            && typeof variations[j].Name === 'string'
                        ) {
                            varName = np.slugify (variations[j].Name);

                            if (varName === variation) {
                                varKey          = variations[j].KeyEigenschaft+'-'+variations[j].KeyEigenschaftWert;
                                amountInCart    = np.Cart.getProductAmountByVariation (varKey);
                                stock           = variations[j].Lager;
                                
                                if (stock > 0 && amountInCart < stock) {
                                    product.selectedVariations  = new Array ();
                                    product.selectedVariations.push (varKey);
                                }

                                found   = true;
                            }
                        }

                        if (found)  { break;    }                            
                    }

                    if (found)  { break;    }
                }
            }
        }

        return {Product: product};
    },
    
    events: {
        closeInfo: function (view) {
            this.set ('info', false);
            
            np.Product.refreshViews (this.get ('article_id'), view);            
        },

        // Button "Add to cart" click event:
        addToCart: function (view) { np.Cart.add (this, view);  },
        
        incrementAmount: function () {
            var amount, needsVariation, missingVariations, missing;

            needsVariation      = np.Product.needsVariation (this);
            missingVariations   = np.Product.missingVariation (this);
            missing             = missingVariations.length > 0;

            this.set ('missingVariations', missingVariations);

            if (!missing) {
                amount  = this.get ('amount') + 1;

                if (np.Product.orderable (this, amount)) {
                    if (this.get ('maxAmount'))         { this.set ('maxAmount', false);        }

                    this.set ('amount', amount);
                } else {
                    this.set ('maxAmount', true);
                }
            }                
        },

        decrementAmount: function () {
            var needsVariation, missingVariations, missing;

            if (this.get ('maxAmount')) { this.set ('maxAmount', false);    }

            if (this.get ('amount') - 1 > 0) {
                needsVariation      = np.Product.needsVariation (this);
                missingVariations   = np.Product.missingVariation (this);
                missing             = missingVariations.length > 0;

                this.set ('missingVariations', missingVariations);

                if (!missing) {
                    this.set ('amount', this.get ('amount')-1);
                }
            }                
        },

        changeAmount: function (view) {
            var curAmount, newAmount, needsVariation, missingVariations, missing;

            needsVariation      = np.Product.needsVariation (this);
            missingVariations   = np.Product.missingVariation (this);
            missing             = missingVariations.length > 0;
            curAmount           = this.get ('amount');

            this.set ('missingVariations', missingVariations);

            if (!missing) {
                newAmount   = parseInt (view.get ('amount'), 10);

                if (isNaN (newAmount)) { newAmount = 1; }

                if (np.Product.orderable (this, newAmount)) {
                    if (this.get ('maxAmount')) { this.set ('maxAmount', false);    }

                    if (newAmount > 0 && newAmount !== curAmount) {
                        this.set ('amount', newAmount);
                    } 
                } else {
                    this.set ('maxAmount', true);
                    this.set ('amount', np.Product.getMaxOrderable (this));
                    
                    view.getNode ().find ('input[data-bind="amount"]').blur ();
                }
            } else {
                view.getNode ().find ('input[data-bind="amount"]').val (1);
                view.getNode ().find ('input[data-bind="amount"]').blur ();
            }
        }        
    }    
});