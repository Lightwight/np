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

np.controller.extend ('CartProductController', {
    view:       'CartProductView',
    
    model:  function () {
        var product;
        
        product             = np.Cart.getCompleteProduct (this);
        
        product.changing    = false;
        product.sending     = false;
        product.info        = false;

        return {CartProduct: product};
    },
    
    events: {
        removeFromCart: function (view) {
             np.Cart.remove (this, view);
        },
        
        incrementAmount: function (view) {
            var product, amount, cAmount;

            amount  = this.get ('amount') + 1;
            cAmount = np.Cart.getCacheProductAmount (this.get ('article_id'));
            
            if (np.Product.orderable (this, amount, true)) {
                if (this.get ('maxAmount'))     { this.set ('maxAmount', false);        }
                
                if (cAmount !== amount)         { this.set ('changing', true);          }
                else                            { this.set ('changing', false);         }
                
                product = np.jsonClone (this.getAll ());
                
                np.Cart.updateCache (product, {amount: amount, changing: this.get ('changing')});
                
                this.set ('amount', amount);
            } else {
                this.set ('maxAmount', true);
            }
        },
        
        decrementAmount: function (view) {
            var product, amount, cAmount;
            
            product = np.jsonClone (this.getAll ());
            amount  = this.get ('amount') - 1;
            cAmount = np.Cart.getCacheProductAmount (this.get ('article_id'));

            if (amount > 0) {
                if (cAmount !== amount) { this.set ('changing', true);      }
                else                    { this.set ('changing', false);     }
                
                this.set ('maxAmount', false);
                
                np.Cart.updateCache (this.getAll (), {amount: amount, changing: this.get ('changing')});
                
                this.set ('amount', amount);
            }
        },
        
        changeAmount: function (view) {
            var cAmount, curAmount, newAmount, stockAmount;
            
            curAmount   = this.get('amount');
            newAmount   = parseInt (view.get ('amount'), 10);
            cAmount     = np.Cart.getCacheProductAmount (this.get ('article_id'));
            
            if (isNaN (newAmount)) { newAmount = 1; }

            if (newAmount > 0 && newAmount !== curAmount && np.Product.orderable (this, newAmount, true)) {
                if (this.get ('maxAmount'))     { this.set ('maxAmount', false);        }

                if (newAmount > 0 && newAmount !== curAmount) {
                    if (cAmount !== newAmount)  { this.set ('changing', true);      }
                    else                        { this.set ('changing', false);     }

                    np.Cart.updateCache (this.getAll (), {amount: newAmount, changing: this.get ('changing')});

                    this.set ('amount', newAmount);
                } 
            } else if (newAmount !== curAmount && newAmount > 0){
                this.set ('maxAmount', true);
                
                stockAmount = np.Product.getStock (this);

                if (cAmount !== stockAmount)    { this.set ('changing', true);      }
                else                            { this.set ('changing', false);     }

                np.Cart.updateCache (this.getAll (), {amount: stockAmount, changing: this.get ('changing')});

                this.set ('amount', stockAmount);

                view.getNode ().find ('input[data-bind="amount"]').blur ();
            } else if (newAmount === 0) {
                this.set ('maxAmount', false);

                if (cAmount !== curAmount)  { this.set ('changing', true);      }
                else                        { this.set ('changing', false);     }

                np.Cart.updateCache (this.getAll (), {amount: curAmount, changing: this.get ('changing')});

                this.set ('amount', curAmount);
                
                view.getNode ().find ('input[data-bind="amount"]').blur ();
            }
        },
        
        applyChanges: function (view) {
            this.set ('info', false);
            this.set ('sending', true);
            this.set ('changing', false);
            
            np.Cart.update (this, view, 'cart');
        },
        
        resetChanges: function (view) {
            var product, amount;
            
            product = np.Cart.getProduct (this.get ('article_id'));

            if (product) {
                amount  = product.amount;
                
                np.Cart.updateCache (this.getAll (), {amount: amount, changing: false});

                this.set ('maxAmount', false);
                this.set ('changing', false);
                this.set ('amount', product.amount);
            }
        },
        
        closeInfo: function () {
            this.set ('info', false);
        },
        
        closeCart: function () {
            var cartView;

            cartView    = $('[data-handle="CartView"]');

            if (cartView.hasClass ('open')) { cartView.removeClass ('open');    }            
        }
    }
});