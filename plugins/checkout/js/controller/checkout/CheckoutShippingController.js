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

np.controller.extend ('CheckoutShippingController', (function () {
    function applyBillingData (_t) {
        var gender, name, prename, sCountry, sCity, sPostal, sStreet;
        
        gender      = _t.get ('user.gender');
        name        = _t.get ('user.name');
        prename     = _t.get ('user.prename');
        sCountry    = _t.get ('billing.country');
        sCity       = _t.get ('billing.city');
        sPostal     = _t.get ('billing.postal');
        sStreet     = _t.get ('billing.street');
        
        _t.set ('shipping.gender', gender);
        _t.set ('shipping.name', name);
        _t.set ('shipping.prename', prename);
        _t.set ('shipping.country', sCountry);
        _t.set ('shipping.city', sCity);
        _t.set ('shipping.postal', sPostal);
        _t.set ('shipping.street', sStreet);
        
        np.checkout.setOrder ('shipping', 'gender', gender);
        np.checkout.setOrder ('shipping', 'name', name);
        np.checkout.setOrder ('shipping', 'prename', prename);
        np.checkout.setOrder ('shipping', 'country', sCountry);
        np.checkout.setOrder ('shipping', 'city', sCity);
        np.checkout.setOrder ('shipping', 'postal', sPostal);
        np.checkout.setOrder ('shipping', 'street', sStreet);
        np.checkout.setOrder ('shipping', 'customShipping', false);
    }
    
    return {
        view: 'CheckoutShippingView',
        model:  function () { return this;  },

        events: {
            setSameAsBilling: function () {
                this.set ('shipping.customShipping', false);
                applyBillingData (this);
            },

            setCustomShipping: function () {
                this.set ('shipping.customShipping', true);
                np.checkout.setOrder ('shipping', 'customShipping', true);
            },
            
            setMale: function () {
                if (this.get ('shipping.gender') !== 'male') { 

                    np.checkout.setOrder ('shipping', 'gender', 'male');

                    this.set ('shipping.gender', 'male');  
                }
            },

            setFemale: function () {
                if (this.get ('shipping.gender') !== 'female') {
                    np.checkout.setOrder ('shipping', 'gender', 'female');

                    this.set ('shipping.gender', 'female');  
                }
            },

            setPrename: function (node) {
                var prename;

                prename = node.get ('shipping.prename');

                np.checkout.setOrder ('shipping', 'prename', prename);

                this.set ('shipping.prename', prename);
            },

            setName: function (node) {
                var name;

                name    = node.get ('shipping.name');

                np.checkout.setOrder ('shipping', 'name', name);

                this.set ('shipping.name', name);
            },            

            setCountry: function (node) {
                var country;

                country = node.get ('geo');

                np.checkout.setOrder ('shipping', 'country', country);

                this.set ('shipping.country', country);
            },

            setStreet: function (node) {
                var street;

                street  = node.get ('shipping.street');

                np.checkout.setOrder ('shipping', 'street', street);

                this.set ('shipping.street', street);
            },

            setPostal: function (node) {
                var postal;

                postal  = node.get ('shipping.postal');

                np.checkout.setOrder ('shipping', 'postal', postal);

                this.set ('shipping.postal', postal);
            },

            setCity: function (node) {
                var city;

                city    = node.get ('shipping.city');

                np.checkout.setOrder ('shipping', 'city', city);

                this.set ('shipping.city', city);
            },

            applyShipping: function () {
                var _this, promise,
                    oldGender, oldName, oldPrename, oldCountry, oldStreet, oldPostal, oldCity, oldCustomShipping,
                    gender, name, prename, country, street, postal, city;

                _this               = this;
                promise             = np.Promise ();

                oldGender           = this.get ('shipping.gender');
                oldName             = this.get ('shipping.name');
                oldPreame           = this.get ('shipping.prename');
                oldCountry          = this.get ('shipping.country');
                oldStreet           = this.get ('shipping.street');
                oldPostal           = this.get ('shipping.postal');
                oldCity             = this.get ('shipping.city');
                oldCustomShipping   = this.get ('shipping.customShipping');

                gender      = np.checkout.getOrigAddress ('shipping', 'gender');
                name        = np.checkout.getOrigAddress ('shipping', 'name');
                prename     = np.checkout.getOrigAddress ('shipping', 'prename');
                country     = np.checkout.getOrigAddress ('shipping', 'country');
                street      = np.checkout.getOrigAddress ('shipping', 'street');
                postal      = np.checkout.getOrigAddress ('shipping', 'postal');
                city        = np.checkout.getOrigAddress ('shipping', 'city');

                np.checkout.setOrder ('shipping', 'gender', gender);
                np.checkout.setOrder ('shipping', 'name', name);
                np.checkout.setOrder ('shipping', 'prename', prename);
                np.checkout.setOrder ('shipping', 'country', country);
                np.checkout.setOrder ('shipping', 'street', street);
                np.checkout.setOrder ('shipping', 'postal', postal);
                np.checkout.setOrder ('shipping', 'city', city);

                this.set ('shipping.gender', gender);
                this.set ('shipping.name', name);
                this.set ('shipping.prename', prename);
                this.set ('shipping.country', country);
                this.set ('shipping.street', street);
                this.set ('shipping.postal', postal);
                this.set ('shipping.city', city);
                this.set ('shipping.customShipping', true);

                np.checkout.saveOrder ()
                .then (function () {
                    _this.set ('error', false);
                    _this.set ('success', true);
                    _this.set ('sending', false);

                    promise.then ();
                })
                .fail (function (error) {
                    np.checkout.setOrder ('shipping', 'gender', oldGender);
                    np.checkout.setOrder ('shipping', 'name', oldName);
                    np.checkout.setOrder ('shipping', 'prename', oldPrename);
                    np.checkout.setOrder ('shipping', 'country', oldCountry);
                    np.checkout.setOrder ('shipping', 'street', oldStreet);
                    np.checkout.setOrder ('shipping', 'postal', oldPostal);
                    np.checkout.setOrder ('shipping', 'city', oldCity);

                    _this.set ('shipping.gender', oldGender);
                    _this.set ('shipping.name', oldName);
                    _this.set ('shipping.prename', oldPrename);
                    _this.set ('shipping.country', oldCountry);
                    _this.set ('shipping.street', oldStreet);
                    _this.set ('shipping.postal', oldPostal);
                    _this.set ('shipping.city', oldCity);
                    _this.set ('shipping.customShipping', oldCustomShipping);

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
    };
})());