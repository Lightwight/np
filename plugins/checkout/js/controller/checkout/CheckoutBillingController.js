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

np.controller.extend ('CheckoutBillingController', {
    view: 'CheckoutBillingView',
    model:  function () { return this;  },
    
    events: {
        setCountry: function (node) {
            var country;
            
            country     = node.get ('geo');
            
            np.checkout.setOrder ('billing', 'country', country);
            
            this.set ('billing.country', country);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.country', country);
                
                np.checkout.setOrder ('shipping', 'country', country);
            }
        },
        
        setStreet: function (node) {
            var street;
            
            street  = node.get ('billing.street');
            
            np.checkout.setOrder ('billing', 'street', street);
            
            this.set ('billing.street', street);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.street', street);
                
                np.checkout.setOrder ('shipping', 'street', street);
            }
        },
        
        setPostal: function (node) {
            var postal;
            
            postal  = node.get ('billing.postal');
            
            np.checkout.setOrder ('billing', 'postal', postal);
            
            this.set ('billing.postal', postal);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.postal', postal);
                
                np.checkout.setOrder ('shipping', 'postal', postal);
            }
        },
        
        setCity: function (node) {
            var city;
            
            city    = node.get ('billing.city');
            
            np.checkout.setOrder ('billing', 'city', city);
            
            this.set ('billing.city', city);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.city', city);
                
                np.checkout.setOrder ('shipping', 'city', city);
            }
        },
        
        applyBilling: function (node) {
            var _this, promise,
                oldCountry, oldStreet, oldPostal, oldCity,
                country, street, postal, city;
            
            _this       = this;
            promise     = np.Promise ();
            
            oldCountry  = this.get ('billing.country');
            oldStreet   = this.get ('billing.street');
            oldPostal   = this.get ('billing.postal');
            oldCity     = this.get ('billing.city');
            
            country     = np.checkout.getOrigAddress ('billing', 'country');
            street      = np.checkout.getOrigAddress ('billing', 'street');
            postal      = np.checkout.getOrigAddress ('billing', 'postal');
            city        = np.checkout.getOrigAddress ('billing', 'city');
            
            np.checkout.setOrder ('billing', 'country', country);
            np.checkout.setOrder ('billing', 'street', street);
            np.checkout.setOrder ('billing', 'postal', postal);
            np.checkout.setOrder ('billing', 'city', city);
            
            this.set ('billing.country', country);
            this.set ('billing.street', street);
            this.set ('billing.postal', postal);
            this.set ('billing.city', city);
            
            np.checkout.saveOrder ()
            .then (function () {
                _this.set ('error', false);
                _this.set ('success', true);
                _this.set ('sending', false);

                promise.then ();
            })
            .fail (function (error) {
                np.checkout.setOrder ('billing', 'country', oldCountry);
                np.checkout.setOrder ('billing', 'street', oldStreet);
                np.checkout.setOrder ('billing', 'postal', oldPostal);
                np.checkout.setOrder ('billing', 'city', oldCity);
                
                _this.set ('billing.country', oldCountry);
                _this.set ('billing.street', oldStreet);
                _this.set ('billing.postal', oldPostal);
                _this.set ('billing.city', oldCity);
                
                _this.set ('success', false);
                _this.set ('error', error);
                _this.set ('sending', false);

                /* 
                 * TODO insert modal error window into view after error to 
                 * inform the user bout it
                 * */           
                
                promise.fail ();
            });  

            return promise;
        }
    }
});