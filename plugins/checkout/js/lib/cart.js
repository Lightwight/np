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

np.module ('Cart', (function () {
    var storage, cache;
    
    storage = new Array ();
    cache   = new Array ();

    function checkVariations (_ctx) {
        var selected, needed, items, missing, needAmount, found,
            i, l,
            m;
        
        selected    = _ctx.get ('selectedVariations');
        needed      = _ctx.get ('neededVariations');
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
            
            needAmount++;
        }
        
        return missing;
    }    
    
    function add (product) {
        var promise, request;
        
        promise     = np.Promise ();
        product     = np.Product.getProductForCart (np.jsonClone (product.getAll ()));
        request     = {checkout: {cart: {add: product}}, type: 'checkout'};

        np.ajax({
            type:           'POST',
            dataType:       'json',
            contentType:    'application/json',
            url:            '/',
            data:           request
        }).then (function (rsp) {
            promise.then (rsp.data.products);
        }).fail (function (error) {
            promise.fail (error);
        });             
        
        return promise;
    }
    
    function update (product) {
        var promise, request;
        
        promise     = np.Promise ();
        request     = {checkout: {cart: {update: product.getAll ()}}, type: 'checkout'};

        np.ajax({
            type:           'POST',
            dataType:       'json',
            contentType:    'application/json',
            url:            '/',
            data:           request
        }).then (function (rsp) {
            promise.then (rsp.data.products);
        }).fail (function (error) {
            promise.fail (error);
        });             
        
        return promise;
    }
    
    function remove (product) {
        var promise, request;
        
        promise     = np.Promise ();
        request     = {checkout: {cart: {remove: product.getAll ()}}, type: 'checkout'};

        np.ajax({
            type:           'POST',
            dataType:       'json',
            contentType:    'application/json',
            url:            '/',
            data:           request
        }).then (function (rsp) {
            promise.then (rsp.data);
        }).fail (function (error) {
            promise.fail (error);
        });             
        
        return promise;
    }    

    function updateCart (product) {
        var found, cloned,
            i, l;
        
        found   = false;
        l       = cache.length;
        cloned  = np.jsonClone (product);
        
        if (l > 0){
            for (i=0; i<l; i++) {
                if (storage[i].article_id === product.article_id) {
                    found   = true;
                    
                    storage[i]  = cloned;
                    break;
                }
            }
        } 

        if (!found) { storage.push (cloned);   }
        
        updateCache (product);
    }
    
    function updateCache (product, options) {
        var found, cloned,
            i, l;

        found           = false;
        l               = cache.length;
        cloned          = np.jsonClone (product);
        
        for (i in options) { cloned[i] = options[i];    }
        
        if (l > 0){
            for (i=0; i<l; i++) {
                if (cache[i].article_id === cloned.article_id) {
                    found   = true;
                    
                    cache[i]  = cloned;
                    
                    break;
                }
            }
        } 

        if (!found) { cache.push (cloned);   }
    }
    
    function removeArticleFromStorage (article_id) {
        var found,
            i, l;
    
        found   = false;
        l       = storage.length;

        if (l>0) {
            for (i=0; i<l; i++) {
                if (storage[i].article_id === article_id) {
                    found   = true;

                    delete storage[i];

                    break;
                }
            }
        }

        if (found)  { storage = storage.reindex (); }
        
        found   = false;
        l       = cache.length;

        if (l>0) {
            for (i=0; i<l; i++) {
                if (cache[i].article_id === article_id) {
                    found   = true;

                    delete cache[i];

                    break;
                }
            }
        }

        if (found)  { cache = cache.reindex (); }
    }
    
    function isIDInCart (product) {
        var i, l;
        
        l   = storage.length;

        for (i=0; i<l; i++) {
            if (storage[i].id === product.id) {
                return i;
            }
        }
        
        return false;
    }
    
    function isInCart (product) {
        var variations, article_id,
            i, l, m, n, o;
        
        l   = storage.length;
        n   = product.variations.length;
        
        if (n > 0) {
            for (m=0; m<n; m++) {
                variations  = product.variations[m];
                
                for (o in variations) {
                    if (typeof variations[o] === 'object'
                        && typeof variations[o].ArtikelNr === 'string'
                    ) {
                        article_id  = variations[o].ArtikelNr;
                        
                        for (i=0; i<l; i++) {
                            if (storage[i].article_id === article_id) {
                                return true;
                            }
                        }
                    }
                }
            }
        } else {
            for (i=0; i<l; i++) {
                if (storage[i].article_id === product.article_id) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    function isVariationInCart (product) {
        var _variations, variations, vL, _vI, _vL, sumStorage, sumProduct, _product, i, l;

        l           = storage.length;

        variations  = typeof product.selectedVariations !== 'undefined' && product.selectedVariations.length > 0 ? product.selectedVariations : false;

        for (i=0; i<l; i++) { 
            if (variations === false) {
                if (product.article_id === storage[i].article_id) { return i; } 
            } else {
                if (product.article_id === storage[i].article_id) {
                    _product    = np.jsonClone (storage[i]);
                    _variations = _product.selectedVariations;
                  
                    vL          = _variations.length;
                    _vL         = variations.length;
                    
                    sumStorage  = 0;
                    sumProduct  = 0;
                    
                    for (_vI=0; _vI<_vL; _vI++) {
                        sumProduct++;
                        
                        if (_variations.indexOf (variations[_vI]) > -1) {
                            sumStorage++;
                        }
                    }

                    if (sumStorage === sumProduct) { return i;  }
                }
            }
        }

        return false;
    }
    
    return {
        setup: function (products) { 
            storage = np.jsonClone (products);  
            cache   = np.jsonClone (products);  
        },
        
        getStorage: function () {
            return storage;
        },
        
        add:  function (product, view, type) {
            var missingVariations;
            
            missingVariations   = checkVariations (product);
            
            product.set ('missingVariations', missingVariations);
            
            if (type === 'spread') {
                product.set ('missingSpreadVariations', missingVariations);
            } else if (type === 'list') {
                product.set ('missingListVariations', missingVariations);
            }
                
            if (missingVariations.length === 0) {
                product.set ('sending', true);

                add (product, view)
                .then (function (response) { 
                    var rspProduct, available, changed;

                    rspProduct  = response.product;

                    storage     = np.jsonClone (response.cart);
                    cache       = np.jsonClone (response.cart);
                    
                    product.set ('sending', false);

                    available   = rspProduct.available;
                    changed     = rspProduct.changed;

                    np.Product.update (product, rspProduct);
                    np.checkout.setCartDiffers (response.differsFromOrder);
                    
                    if (!available)     { product.set ('info', 1);  } 
                    else if (changed)   { product.set ('info', 2);  }
                    else { 
                        product.set ('isInCart', true);

                        np.Product.refreshViews (product.get ('article_id'), view, type);  
                    }
                })
                .fail (function (rsp) {
                    product.set ('sending', false);
                    product.set ('info', rsp.error.statusCode);
                });
            }
        },
        
        update: function (product, view) {
            product.set ('sending', true);
            
            update (product)
            .then (function (response) { 
                var rspProduct, available, changed, delivery, article_id;

                rspProduct  = response.product;
                
                storage     = np.jsonClone (response.cart);
                updateCache (rspProduct, rspProduct);
                delivery    = np.jsonClone (response.delivery);
                
                product.set ('sending', false);

                available   = rspProduct.available;
                changed     = rspProduct.changed;

                np.checkout.setCartDiffers (response.differsFromOrder);
                np.Product.update (product, rspProduct);

                if (!available)     { product.set ('info', 1);  } 
                else if (changed)   { product.set ('info', 2);  }
                else { 
                    product.set ('amount', rspProduct.amount);
                    product.set ('isInCart', true);
                    
                    article_id  = product.get ('rel_article_id');
                    
                    if (article_id.length === 0)    { article_id = product.get ('article_id');  }
                    
                    np.checkout.setDeliveryGateways (delivery);
                    np.Product.refreshViews (article_id, view, 'cart');

                    np.observable.update ('Checkout', -1, 'dGateways', delivery);
                }
            })
            .fail (function (response) {
                product.set ('sending', false);
                product.set ('info', response.error.statusCode);
            });            
        },

        remove:  function (product, view) {
            var article_id;
            
            product.set ('sending', true);
            
            remove (product)
            .then (function (response) {
                product.set ('isInCart', false);
                product.set ('sending', false);

                np.checkout.setCartDiffers (response.checkout.differsFromOrder);
                removeArticleFromStorage (product.get ('article_id'));

                article_id  = product.get ('rel_article_id');

                if (article_id.length === 0)    { article_id = product.get ('article_id');  }

                np.Product.refreshViews (article_id, view, 'cart');  
            })
            .fail (function (response) {
                product.set ('sending', false);
                product.set ('info', response.error.statusCode);
            });
        },
        
        flush: function () {
            storage = new Array ();
        },
        
        isInCart:   function (product) {
            return isInCart (product);
        },
        
        updateCart: function (product) {
            updateCart (product);
        },
        
        updateCache: function (product, options) {
            updateCache (product, options);
        },
        
        empty: function () {
            return storage.length === 0;
        },
        
        getTotal: function () {
            var total, product, prTotal,
                isDeleted, price, agio, tax, amount,
                i, l;

            total   = 0;
            l       = cache.length;

            for (i=0; i<l; i++) {
                product = cache[i];

                isDeleted = parseInt (product.deleted, 10) === 1;
                
                if (!isDeleted) {
                    price   = parseFloat (product.price);
                    agio    = typeof product.agio !== 'undefined' ? parseFloat (product.agio) : 0;
                    tax     = parseFloat (product.tax);
                    amount  = parseInt (product.amount, 10);

                    prTotal = (((1+(tax/100)) * (price+agio)));

                    if (prTotal > 0) {
                        prTotal = Math.round (prTotal*100)/100*amount;
                    }

                    total  += prTotal;
                }
            }
            
            return {id:-1, total: total, empty: (storage.length === 0)};
        },
        
        getProducts: function () {
            return np.jsonClone (storage);
        },
        
        getCachedProduct: function (article_id) {
            var i, l;
            
            l   = cache.length;
            
            for (i=0; i<l; i++) {
                if (cache[i].article_id===article_id) {
                    return cache[i];
                }
            }
            
            return false;
        },
        
        getProduct: function (article_id) {
            var i;
            
            i   = storage.map (function (x) {return x.article_id;}).indexOf (article_id);

            return i > -1 ? np.jsonClone (storage[i]) : false;
        },
        
        getCacheProductAmount: function (article_id) {
            var i, l;
            
            l       = cache.length;
            
            for (i=0; i<l; i++) {
                if (cache[i].article_id === article_id) {
                    return parseInt (cache[i].amount, 10);
                }
            }
            
            return 0;            
        },
        
        getProductAmount: function (article_id) {
            var i, l;
            
            l       = storage.length;
            
            for (i=0; i<l; i++) {
                if (storage[i].article_id === article_id) {
                    return parseInt (storage[i].amount, 10);
                }
            }
            
            return 0;
        },
        
        hasDeletedProducts: function () {
            var hasDeleted;
            
            hasDeleted  = false;

            if ($.isArray (storage) && storage.length > 0) {
                $.each (storage, function (inx, val) {
                    if (parseInt (val.deleted, 10) === 1) {
                        hasDeleted  = true;
                
                        return false;
                    }
                });
            }

            return hasDeleted;
        },
        
        getDeletedProducts: function () {
            return $.isArray (storage) && storage.length > 0 ? storage.filter (function (product) {
                return parseInt (product.deleted, 10) === 1;
            }) : new Array ();
        },
        
        // Deprecated - find and remove
        getProductAmountByVariation: function (variation) {
            var product, selVars,
                i, l, k;
            
            l   = storage.length;
            
            for (i=0; i<l; i++) {
                product     = storage[i];
                selVars     = product.selectedVariations;
                
                for (k in selVars) {
                    if (selVars[k] === variation) {
                        return parseInt (product.amount, 10);
                    }
                }
            }
            
            return 0;
        },
        
        getAmount: function () {
            var amount, 
                i, l;
            
            amount  = 0;
            l       = storage.length;

            for (i=0; i<l; i++) { amount += storage[i].amount;  }

            return {id: -1, amount: amount};
        },
        
        /*
         * Returns the complete products with its variations, avaibilities
         * etc.
         * 
         * @param {object} [product] The product for completition
         * 
         * @return {object} The complete product information
         */
        getCompleteProduct: function (cartProduct) {
            var cartID, product;
            
            cartID          = cartProduct.id;
            product         = np.jsonClone (np.Product.getCompleteProduct (cartProduct));
            product.id      = cartID;

            product.gross   = np.Product.getGross (product);

            return product;
        }     
    };
}()));