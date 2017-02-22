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

np.controller.extend ('ProductTotalController', {
    view:   'ProductTotalView',
    model:  function () {
        var prBookmark, splitted, product, varCombs, variations, variation, 
                varName, varKey, found, amountInCart, stock,
                i, j;

        prBookmark  = np.route.getBookmarkItem (true);
        splitted    = prBookmark.split ('/');
        variation   = typeof this !== window 
                      && $.isArray (this.selectedVariations) 
                      && this.selectedVariations.length > 0 
                      ? np.slugify (np.Product.getSelectedVariation (this).Name)
                      : (splitted.length === 3 ? splitted[2] : false);
        
        prBookmark  = '/shop/'+splitted[1];        

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
    }
});