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

np.controller.extend ('ProductListController', {
    view:   'ProductListView',
    model:  function () { 
        return {Product: np.Product.getCompleteProduct (this)}; 
    },
    
    events: {
        closeInfo: function (view) {
            this.set ('info', false);
            
            np.Product.refreshViews (this.get ('article_id'), view);
        },
        
        addToCart: function (view) {
            np.Cart.add (this, view, 'list');            
        },

        incrementAmount: function () {
            var amount, needsVariation, missingVariations, missing;

            needsVariation      = np.Product.needsVariation (this);
            missingVariations   = np.Product.missingVariation (this);
            missing             = missingVariations.length > 0;

            this.set ('missingVariations', missingVariations);
            this.set ('missingListVariations', missingVariations);

            if (!missing) {
                amount  = this.get ('amount') + 1;

                if (np.Product.orderable (this, amount)) {
                    if (this.get ('maxAmount'))     { this.set ('maxAmount', false);        }
                    if (this.get ('maxListAmount')) { this.set ('maxListAmount', false);    }

                    this.set ('amount', amount);
                } else {
                    this.set ('maxAmount', true);
                    this.set ('maxListAmount', true);
                }
            }
        },

        decrementAmount: function () {
            var needsVariation, missingVariations, missing;

            if (this.get ('amount') - 1 > 0) {
                needsVariation      = np.Product.needsVariation (this);
                missingVariations   = np.Product.missingVariation (this);
                missing             = missingVariations.length > 0;

                this.set ('missingVariations', missingVariations);
                this.set ('missingListVariations', missingVariations);

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
            this.set ('missingListVariations', missingVariations);

            if (!missing) {
                newAmount   = parseInt (view.get ('amount'), 10);

                if (isNaN (newAmount)) { newAmount = 1; }

                if (np.Product.orderable (this, newAmount)) {
                    if (this.get ('maxAmount'))     { this.set ('maxAmount', false);        }
                    if (this.get ('maxListAmount')) { this.set ('maxListAmount', false);    }

                    if (newAmount > 0 && newAmount !== curAmount) {
                        this.set ('amount', newAmount);
                    } 
                } else {
                    this.set ('maxAmount', true);
                    this.set ('maxListAmount', true);
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