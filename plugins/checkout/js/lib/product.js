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

np.module ('Product', (function () {
    /*
     * Get the Article ID of a variation by key
     * 
     * @param {object} [product] The father product
     * @param {string} [key] The variation key (i.e "10-21")
     * 
     * @return {string} the Article ID of the variation
     */     
    function getIDByVariationKey (product, key) {
        var varCombs, variations,
            i, l, m;
        
        varCombs    = product.get ('variations');
        l           = varCombs.length;
        
        for (i=0; i<l; i++) {
            variations  = varCombs[i];
            
            for (m in variations) {
                if (typeof variations[m] === 'object'
                    && typeof variations[m].KeyEigenschaft !== 'undefined'
                    && typeof variations[m].KeyEigenschaftWert !== 'undefined'
                    && typeof variations[m].ArtikelNr !== 'undefined'
                    && key === (variations[m].KeyEigenschaft+'-'+variations[m].KeyEigenschaftWert)
                ) {
                    return variations[m].ArtikelNr;
                }
            }
        }
        
        return false;
    }
    
    /*
     * Returns the current selected Variation of the given product,
     * 
     * @param {object} [product] The product
     * 
     * @return {object} The Variation of the product or false if no variations was selected
     */     
     function getSelectedVariation (product) {
        var variations, selectedVariation, proceed,
            i, l, m;

        if (typeof product.getAll === 'function') { product = product.getAll ();    }

        proceed = typeof product.selectedVariations !== 'undefined' && $.isArray (product.selectedVariations) && product.selectedVariations.length > 0 
                  && typeof product.variations !== 'undefined' && $.isArray (product.variations) && product.variations.length > 0;

        if (proceed) {
            selectedVariation   = product.selectedVariations[0];
            l                   = product.variations.length;

            for (i=0; i<l; i++) {
                variations  = product.variations[i];

                for (m in variations) {
                    if (typeof variations[m] === 'object' 
                        && typeof variations[m].ArtikelNr === 'string'
                        && typeof variations[m].KeyEigenschaft !== 'undefined'
                        && typeof variations[m].KeyEigenschaftWert !== 'undefined'
                        && (variations[m].KeyEigenschaft+'-'+variations[m].KeyEigenschaftWert) === selectedVariation
                    ) {
                        return np.jsonClone (variations[m]);
                    }
                }
            }
        }

        return false;
    }
    
    /*
     * Returns the needance of variation for the product
     * 
     * @param {object} [product] The product
     * 
     * @return {boolean} The needance of variation of the given product
     */
    function needsVariation (product) {
        return (function () {
            var variations, x;

            variations  = typeof product.get === 'function' ? product.get ('neededVariations') : (typeof product.neededVariations !== 'undefined' ? product.neededVariations : {});

            for (x in variations) { return true; }

            return false;
        }());
    }
    
    /*
    * Get the stock of an Article(-variation)
    * 
    * @param {object} [product] The product
    * 
    * @return {number} the stock of the given article(-variation)
    */     
    function getStock (product) {
        var variation;

        product = typeof product.getAll === 'function' ? np.jsonClone (product.getAll ()) : np.jsonClone (product);

        if (needsVariation (product)) {
            variation       = getSelectedVariation (product);

            return parseInt (variation.Lager, 10);
        } 

        return parseInt (product.stock, 10);
    }
    
    function resetVariations (product) {
        var variations, variation, 
            _vID, _opts,
            i, l, m;
       
        variations  = typeof product.variations !== 'undefined' && $.isArray (product.variations) && product.variations.length > 0 ? product.variations : false;
        
        if (variations) {
            l   = variations.length;
            
            for (i=0; i<l; i++) {
                variation   = variations[i];
                
                _opts       = (function () {
                    var result;
                    
                    result  = new Array ();
                    
                    for (m in variation) {
                        if (typeof (variation[m]) === 'object') {
                            variation[m].available  = parseInt (variation[m].Lager, 10) - np.Cart.getProductAmount (variation[m].ArtikelNr) > 0;
                            
                            result.push (variation[m]);
                        }
                    }
                    
                    return result;
                }());
                
                _vID        = variation.id;
                
                np.observable.update ('ProductVariation', _vID, 'options', _opts);
            }
        }
    }

    return {
        /*
         * Returns the complete products with its variations, avaibilities
         * etc.
         * 
         * @param {object} [product] The product for completition
         * 
         * @return {object} The complete product information
         */
        getCompleteProduct: function (product) {
            product.category              = '';

            if (product.rel_article_id.length === 0) {
                product.selectedVariations    = typeof product.selectedVariations !== 'undefined' ? product.selectedVariations : new Array ();
                product.neededVariations      = (function () {
                    var ret, label, variations,
                        i, l, 
                        j, m;

                    ret = {};
                    l   = product.variations.length;

                    for (i=0; i<l; i++) {
                        variations  = product.variations[i];
                        label       = variations.label;
                        ret[label]  = {key: variations.key, label: label, items: new Array ()};

                        m           = variations.lenght;

                        for (j in variations) {
                            if (typeof variations[j] === 'object') {
                                ret[label].items.push (variations[j].KeyEigenschaft+'-'+variations[j].KeyEigenschaftWert);
                            }
                        }
                    }

                    return ret;
                }());

                product.missingVariations = product.missingSpreadVariations = product.missingListVariations = new Array ();
            }

            product.maxAmount   = false;

            product.available   = np.Product.available (product);     
            product.isInCart    = np.Cart.isInCart (product);

            return product;
        },

        /*
         * Returns the needance of variation for the product
         * 
         * @param {object} [product] The product
         * 
         * @return {boolean} The needance of variation of the given product
         */
        needsVariation: function (product) {
            return needsVariation (product);
        },

        /*
         * Returns the missing variation of the product
         * 
         * @param {object} [product] The product
         * 
         * @return {array} The missing variation of the given product
         */
        missingVariation: function (product) {
            var selected, needed, items, missing, found,
                i, l,
                m;

            selected    = typeof product.get === 'function' ? product.get ('selectedVariations') : (typeof product.selectedVariations !== 'undefined' ? product.selectedVariations : new Array ());
            needed      = typeof product.get === 'function' ? product.get ('neededVariations') : (typeof product.neededVariations !== 'undefined' ? product.neededVariations : {});
            missing     = new Array ();

            m           = selected.length;

            for (i in needed) {
                found   = false;
                items   = needed[i].items;

                for (l=0; l<m; l++) {
                    if (items.indexOf (selected[l])>-1) {
                        found   = true;
                    }
                }

                if (!found) {
                    missing.push (needed[i].key);
                }
            }

            return missing;        
        },

        /*
         * Returns the availability (stock) of a product (-variations)
         * NOTE: this method differs from orderable and is neccessary 
         * for the onload of the ProductView
         * 
         * @param {object} [product] The product
         * @param {number} [product] The requested amount
         * 
         * @return {boolean} The availability of the given product amount
         */
        available: function (product) {
            var hasVariations, amountInCart, stock, oversaleable, deliverable;

            hasVariations   = product.variations.length > 0;
            amountInCart    = 0;
            stock           = 0;
            oversaleable    = product.oversaleable;
            deliverable     = product.deliverable;
            
            if (!oversaleable) {
                amountInCart    = np.Cart.getProductAmount (product.article_id);
                stock           = parseInt (product.stock, 10);

                return (stock > 0 && amountInCart < stock) && deliverable;
            }
            
            return deliverable;
        },

        /*
         * Returns the availability (stock) of a product
         * 
         * @param {object} [product] The product
         * @param {number} [product] The requested amount
         * 
         * @return {boolean} The availability of the given product amount
         */
        orderable: function (product, amount, cartTrigger) {
            var stock, cartAmount, oversaleable, deliverable;

            cartTrigger     = typeof cartTrigger === 'boolean' ? cartTrigger : false;
            stock           = parseInt (product.get ('stock'), 10);
            amount          = parseInt (amount, 10);
            oversaleable    = parseInt (product.get ('oversaleable'), 10) === 1;
            deliverable     = parseInt (product.get ('deliverable'), 10) === 1;

            if (!oversaleable) {
                cartAmount  = cartTrigger ? 0 : np.Cart.getProductAmount (product.get ('article_id'));

                return ((amount+cartAmount) <= parseInt (product.get ('stock'), 10)) && deliverable;
            }

            return deliverable;
        },


        /*
         * Returns the availability (stock) of a product-variation
         * 
         * @param {object} [product] The product
         * @param {string} [product] The requested variation i.e. "10-21"
         * 
         * @return {boolean} The availability of the given product-variation
         */    
        variationAvailable: function (product, variation) {
            var varCombs, variations, key,
                i;

            varCombs    = typeof product.variations === 'object' && typeof product.variations.length === 'number' ? product.variations : false;

            if (varCombs) {
                variations  = varCombs[0];

                for (i in variations) {
                    key = variations[i].KeyEigenschaft+'-'+variations[i].KeyEigenschaftWert;

                    if (key === variation) {
                        return typeof variations[i].available === 'boolean' ? variations[i].available : false;
                    }
                }
            }

            return false;
        },
        
        /*
         * Returns the name of the article or article-variation
         * 
         * @param {object} [product] The product
         * 
         * @return {string} The articlename
         */    
        getName: function (product) {
            var name, variations, selected, current,
                i, l, m, n, o;

            name        = product.name;
            variations  = product.variations;
            selected    = product.selectedVariations;

            l           = selected.length;
            n           = variations.length;

            for (i=0; i<l; i++) {
                current = selected[i];

                for (m=0; m<n; m++) {
                    for (o in variations[m]) {
                        if (typeof variations[m][o] === 'object' 
                            && typeof variations[m][o].ArtikelNr === 'string'
                            && typeof variations[m][o].id !== 'undefined'
                            && variations[m][o].ArtikelNr.length > 0
                            && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                        ) {
                            return name + ' ' +variations[m][o].Name;
                        }    
                    }
                }
            }

            return name;
        },

        /*
         * Returns the Title of the article or article-variation
         * 
         * @param {object} [product] The product
         * 
         * @return {string} The Article-Link
         */    
        getTitle: function (product) {
            var title, variations, selected, current, found,
                i, l, m, n, o;
        
            product     = typeof product.getAll === 'function' ? np.jsonClone (product.getAll ()) : np.jsonClone (product);

            variations  = product.variations;
            title       = product.title;
            
            if (product.rel_article_id.length === 0) {
                selected    = product.selectedVariations;

                l           = selected.length;
                n           = variations.length;
                found       = false;

                for (i=0; i<l; i++) {
                    current = selected[i];
                    for (m=0; m<n; m++) {
                        
                        for (o in variations[m]) {
                            if (typeof variations[m][o] === 'object' 
                                && typeof variations[m][o].ArtikelNr === 'string'
                                && typeof variations[m][o].id !== 'undefined'
                                && variations[m][o].ArtikelNr.length > 0
                                && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                            ) {
                                return variations[m][o].title;
                            }    
                        }
                    }
                } 
            }

            return title;
        },
        
        /*
         * Returns the Title of the article or article-variation
         * 
         * @param {object} [product] The product
         * 
         * @return {string} The Article-Link
         */    
        getDescription: function (product) {
            var description, variations, selected, current, found,
                i, l, m, n, o;
        
            product     = typeof product.getAll === 'function' ? np.jsonClone (product.getAll ()) : np.jsonClone (product);
            variations  = product.variations;
            description = product.description;
            
            if (product.rel_article_id.length === 0) {
                selected    = product.selectedVariations;

                l           = selected.length;
                n           = variations.length;
                found       = false;

                for (i=0; i<l; i++) {
                    current = selected[i];

                    for (m=0; m<n; m++) {
                        for (o in variations[m]) {
                            if (typeof variations[m][o] === 'object' 
                                && typeof variations[m][o].ArtikelNr === 'string'
                                && typeof variations[m][o].id !== 'undefined'
                                && variations[m][o].ArtikelNr.length > 0
                                && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                            ) {
                                if (!variations[m][o].description.empty ()) {
                                    return variations[m][o].description;
                                } else {
                                    break;
                                }
                            }    
                        }
                    }
                } 
            }

            return description;
        },
        
        /*
         * Returns the Bookmark of the article or article-variation
         * 
         * @param {object} [product] The product
         * 
         * @return {string} The Article-Link
         */    
        getBookmark: function (product) {
            var bookmark, variations, selected, current, found,
                i, l, m, n, o;
        
            product     = typeof product.getAll === 'function' ? np.jsonClone (product.getAll ()) : np.jsonClone (product);
            variations  = product.variations;
            bookmark    = product.bookmark;
            
            if (product.rel_article_id.length === 0) {
                selected    = product.selectedVariations;

                l           = selected.length;
                n           = variations.length;
                found       = false;

                for (i=0; i<l; i++) {
                    current = selected[i];

                    for (m=0; m<n; m++) {
                        for (o in variations[m]) {
                            if (typeof variations[m][o] === 'object' 
                                && typeof variations[m][o].ArtikelNr === 'string'
                                && typeof variations[m][o].id !== 'undefined'
                                && variations[m][o].ArtikelNr.length > 0
                                && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                            ) {
                                return variations[m][o].bookmark;
                            }    
                        }
                    }
                } 
            }

            return bookmark;
        },

        /*
         * Returns the total of a article(-variation)
         * 
         * @param {object} [product] The product
         * 
         * @return {number} The Total of the Article(-Variation)
         */    
        getTotal: function (product, amount) {
            var price, tax, total, agio, variations, selected, current, found,
                i, l, m, n, o;

            product.price   = parseFloat (product.price);
            product.agio    = typeof product.agio !== 'undefined' ? parseFloat (product.agio) : 0;
            product.tax     = parseFloat (product.tax);

            total       = (1+(product.tax/100)) * ((product.price+product.agio));
            total       = (Math.round (total*100)/100)*amount;

            variations  = product.variations;
            selected    = typeof product.selectedVariations !== 'undefined' ? product.selectedVariations : new Array ();

            l           = selected.length;
            n           = variations.length;
            found       = false;

            for (i=0; i<l; i++) {
                current = selected[i];

                for (m=0; m<n; m++) {
                    for (o in variations[m]) {
                        if (typeof variations[m][o] === 'object' 
                            && typeof variations[m][o].ArtikelNr === 'string'
                            && typeof variations[m][o].id !== 'undefined'
                            && typeof variations[m][o].tax !== 'undefined'
                            && parseFloat (variations[m][o].tax) > 0
                            && typeof variations[m][o].price !== 'undefined'
                            && parseFloat (variations[m][o].price) > 0
                            && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                        ) {
                            agio    = parseFloat (variations[m][o].Aufpreis);
                            price   = parseFloat (variations[m][o].price);
                            tax     = parseFloat (variations[m][o].tax);

                            total   = ((1+(tax/100)) * ((price + agio))) ;
                            total   = Math.round (total*100)/100*amount;

                            return total;
                        }    
                    }
                }
            } 

            return total;        
        },

        /*
         * Returns the gross of a article(-variation)
         * 
         * @param {object} [product] The product
         * 
         * @return {number} The Gross of the Article(-Variation)
         */    
        getGross: function (product) {
            var price, tax, gross, agio, variations, selected, current, found,
                i, l, m, n, o;

            product.price   = parseFloat (product.price);
            product.agio    = typeof product.agio !== 'undefined' ? parseFloat (product.agio) : 0;
            product.tax     = parseFloat (product.tax);

            gross       = (1+(product.tax/100)) * ((product.price+product.agio));
            gross       = Math.round (gross*100)/100;

            variations  = product.variations;
            selected    = typeof product.selectedVariations !== 'undefined' ? product.selectedVariations : new Array ();

            l           = selected.length;
            n           = variations.length;
            found       = false;

            for (i=0; i<l; i++) {
                current = selected[i];

                for (m=0; m<n; m++) {
                    for (o in variations[m]) {
                        if (typeof variations[m][o] === 'object' 
                            && typeof variations[m][o].ArtikelNr === 'string'
                            && typeof variations[m][o].id !== 'undefined'
                            && typeof variations[m][o].tax !== 'undefined'
                            && parseFloat (variations[m][o].tax) > 0
                            && typeof variations[m][o].price !== 'undefined'
                            && parseFloat (variations[m][o].price) > 0
                            && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                        ) {
                            agio    = parseFloat (variations[m][o].Aufpreis);
                            price   = parseFloat (variations[m][o].price);
                            tax     = parseFloat (variations[m][o].tax);

                            gross   = ((1+(tax/100)) * ((price + agio))) ;
                            gross   = Math.round (gross*100)/100;

                            return gross;
                        }    
                    }
                }
            } 

            return gross;        
        },

        /*
         * Returns the tax of the article or article-variation
         * 
         * @param {object} [product] The product
         * 
         * @return {number} The Article-Gross
         */    
        getTax: function (product) {
            var tax, variations, selected, current, found,
                i, l, m, n, o;

            tax         = Math.round (product.tax*100)/100;

            variations  = product.variations;
            selected    = typeof product.selectedVariations !== 'undefined' ? product.selectedVariations : new Array ();

            l           = selected.length;
            n           = variations.length;
            found       = false;

            for (i=0; i<l; i++) {
                current = selected[i];

                for (m=0; m<n; m++) {
                    for (o in variations[m]) {
                        if (typeof variations[m][o] === 'object' 
                            && typeof variations[m][o].ArtikelNr === 'string'
                            && typeof variations[m][o].id !== 'undefined'
                            && typeof variations[m][o].tax !== 'undefined'
                            && parseFloat (variations[m][o].tax) > 0
                            && (variations[m][o].KeyEigenschaft+'-'+variations[m][o].KeyEigenschaftWert) === current
                        ) {
                            tax     = parseFloat (variations[m][o].tax);
                            tax     = Math.round (tax*100)/100;

                            return tax;
                        }    
                    }
                }
            } 

            return tax;        
        },

        /*
         * Returns the current selected Variation of the given product,
         * 
         * @param {object} [product] The product
         * 
         * @return {object} The Variation of the product or false if no variations was selected
         */     
         getSelectedVariation: function (product) {
            return getSelectedVariation (product);
         },

        /*
         * Returns the (Variation-)Article of a selected product,
         * if it has variation selected. Otherwise it will return itself
         * 
         * @param {object} [product] The product
         * 
         * @return {string} The (Variation-)Article
         */     
        getProductForCart: function (product) {
            var variation, retProduct;

            retProduct  = {};

            if (typeof product.getAll === 'function') { product = product.getAll ();    }

            if (np.Product.needsVariation (product)) {
                variation   = np.Product.getSelectedVariation (product);

                if (variation) {
                    retProduct.article_id   = variation.ArtikelNr;
                    retProduct.agio         = variation.Aufpreis;
                    retProduct.price        = variation.price;
                    retProduct.tax          = variation.tax;
                } else {
                    return false;
                }
            } else {
                retProduct.article_id   = product.article_id;
                retProduct.agio         = 0;
                retProduct.price        = product.price;
                retProduct.tax          = product.tax;
            }

            retProduct.amount   = product.amount;        

            return retProduct;
        },

         /*
         * Updated the (Variation-)Article of a product,
         * if it has variation selected. Otherwise it will return itself
         * 
         * @param {object} [product] The product
         * 
         * @return {null} 
         */     
        update: function (product, changes) {
            var cPArtID, pPArtID, cArtID, cPrice, cTax, cAgio, cStock, cAvailable,
                oStock,
                variations, found,
                i, l, m;

            pPArtID     = product.get ('rel_article_id');
            cPArtID     = changes.rel_article_id;
            
            cArtID      = changes.article_id;
            cPrice      = changes.price;
            cTax        = changes.tax;
            cAgio       = changes.agio;
            cStock      = changes.stock;
            cAvailable  = changes.available;

            variations  = new Array ();

            if (cPArtID.length > 0 && pPArtID.length === 0) {
                variations  = product.get ('variations');
                l           = variations.length;
                found       = false;

                for (i=0; i<l; i++) {
                    for (m in variations[i]) {
                        if (typeof variations[i][m] === 'object'
                            && typeof variations[i][m].ArtikelNr !== 'undefined'
                            && variations[i][m].ArtikelNr === cArtID
                        ) {
                            found   = true;

                            oStock                      = variations[i][m].Lager;

                            variations[i][m].price      = cPrice;
                            variations[i][m].tax        = cTax;
                            variations[i][m].Aufpreis   = cAgio;
                            variations[i][m].Lager      = cStock;
                            variations[i][m].available  = cAvailable;

                            product.set ('stock', (product.get ('stock')-(oStock-cStock)));
                        }

                        if (found) {
                            np.model.Products.findByArticleId (cPArtID).each (function (row) {
                                row.setVariations (variations);
                            });
                            
                            break;    
                        }
                    }

                    if (found)  { break;    }
                }
            } else {
                product.set ('price', cPrice);
                product.set ('agio', cAgio);
                product.set ('tax', cTax);
                product.set ('stock', cStock);
                product.set ('available', cAvailable);
                
                if (cPArtID.length > 0 && cPArtID === pPArtID) {
                    np.model.Products.findByArticleId (cPArtID).each (function (row) {
                        var varCombs, variations, variation, found,
                            i, l, m;
                        
                        varCombs    = row.getVariations (); 
                        
                        l           = varCombs.length;
                        found       = false;

                        for (i=0; i<l; i++) {
                            variations   = varCombs[i];
                            
                            for (m in variations) {
                                variation   = variations[m];

                                if (typeof variation === 'object'
                                    && variation.ArtikelNr === cArtID
                                ) {
                                    variation.price     = cPrice;
                                    variation.Aufpreis  = cAgio;
                                    variation.tax       = cTax;
                                    variation.Lager     = cStock;
                                    variation.available = cAvailable;

                                    found               = true;

                                    break;
                                }
                            }
                            
                            if (found)  { break;    }
                        }

                        if (found)  { row.setVariations (varCombs);   }
                    });
                }
            }
        },

         /*
         * Get the Article ID of a variation by key
         * 
         * @param {object} [product] The father product
         * @param {string} [key] The variation key (i.e "10-21")
         * 
         * @return {string} the Article ID of the variation
         */     
        getIDByVariationKey: function (product, key) {
            return getIDByVariationKey (product, key);
        },

         /*
         * Get the max orderable amount of an Article(-variation)
         * 
         * @param {object} [product] The product
         * 
         * @return {number} the max orderable amount of the given article(-variation)
         */     
        getMaxOrderable: function (product) {
            var variation;
            
            product = typeof product.getAll === 'function' ? np.jsonClone (product.getAll ()) : np.jsonClone (product);
            
            if (needsVariation (product)) {
                variation       = getSelectedVariation (product);

                return parseInt (variation.Lager, 10) - np.Cart.getProductAmount (variation.ArtikelNr);
            } 

            return parseInt (product.stock, 10) - np.Cart.getProductAmount (product.article_id);
        },
        
         /*
         * Get the stock of an Article(-variation)
         * 
         * @param {object} [product] The product
         * 
         * @return {number} the stock of the given article(-variation)
         */     
        getStock: function (product) {
            return getStock (product);
        },

        refreshViews: function (article_id, view, src) {
            var nProduct;
            
            nProduct    = false;
            
            function triggerObservable () {
                np.observable.update ('Product', nProduct.id, 'amount', 1);
                np.observable.update ('Product', nProduct.id, 'selectedVariations', new Array ());
                np.observable.update ('Product', nProduct.id, 'isInCart', nProduct.isInCart);
                np.observable.update ('Product', nProduct.id, 'available', np.Product.available (nProduct));

                resetVariations (nProduct);

                np.observable.update ('CartTotal', np.Cart.getTotal ());
                np.observable.update ('CartData', -1, 'hasArticles', np.Cart.getAmount ().amount > 0);
                np.observable.update ('CartAmount', -1, 'amount', np.Cart.getAmount ().amount);
                
                np.observable.update ('Checkout', -1, 'id', -1);
            }            
            
            // Search in local storage:
            np.model.Products.findByArticleId (article_id).each (function (row) {
                if (row.getArticleId () === article_id) {
                    nProduct    = np.Product.getCompleteProduct (np.jsonClone (row.getAll ()));
                    
                    if (nProduct)   { triggerObservable (nProduct); }  

                    return false;
                }
            });
            
            // Not in local storage. Search on server:
            if (!nProduct) {
                np.model.Products.findByArticleId (article_id, true, false)
                .then (function (rows) {
                    rows.each (function (row) {
                        if (row.getArticleId () === article_id) {
                            nProduct    =  np.Product.getCompleteProduct (np.jsonClone (row.getAll ()));
                            
                            if (nProduct)   { triggerObservable (nProduct); }  

                            return false;
                        }
                    });
                });                
            }
        },
        
        /* TODO: Deprecated - remove method call in all dependent controllers/views/libs/plugins */
        ignoreMaxOrderable: function () { return false; }
    };
}()));