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

np.plugin.extend ('checkout', (function () {
    var storage, merged;
    
    merged  = false;
    
    storage = {
        settings: {
            billing:        {id: -1, country: 'Deutschland', street: '', postal: '', city: ''},
            shipping:       {id: -1, gender: 'male', name: '', prename: '', country: 'Deutschland', street: '', postal: '', city: '', customShipping: false},
            company:        {id: -1, company: '', ustid: ''},
            payment:        {id: -1, gateway: 0, verification: 0},
            delivery:       {id: -1, gateway: ''}
        },
        
        order: {
            orderID:        0,
            billing:        {},
            shipping:       {},
            company:        {},
            payment:        {},
            delivery:       {},
            user:           {},
            products:       {},
            gateways:       {},
            cartDiffers:    false
        },
        
        user: {
            id:                 -1, 

            gender:             '',
            prename:            '',
            name:               '',
            email:              '',
            email_confirmation: ''
        },
        
        state: {
            step:   1
        },
        
        origin: { 
            settings: {
                billing:        {id: -1, country: 'Deutschland', street: '', postal: '', city: ''},
                shipping:       {id: -1, gender: 'male', name: '', prename: '', country: 'Deutschland', street: '', postal: '', city: '', customShipping: false},
                company:        {id: -1, company: '', ustid: ''},
                payment:        {id: -1, gateway: 0, verification: 0, iban: '', bic: '', mandat_ref_date: null},
                delivery:       {id: -1, gateway: ''}
            }, 

            order: {
                orderID:        0,
                billing:        {},
                shipping:       {},
                company:        {},
                payment:        {},
                delivery:       {},
                user:           {},
                products:       {},
                gateways:       {},
                cartDiffers:    false
            }
        },
        
        urls: {
            1:  'checkout/user',
            2:  'checkout/address',
            3:  'checkout/payment',
            4:  'checkout/verification',
            5:  'checkout/confirmation'
        }
    };
    
    function mergeSettings (checkout) {
        var settings,
            companyData, company, ustid,
            billingData, bCountry, bStreet, bPostal, bCity,
            shippingData, sGender, sName, sPrename, sCountry, sStreet, sPostal, sCity,
            paymentData, gateway, verification; 
        
        settings    = checkout && typeof checkout.settings === 'object' ? checkout.settings : false;
        
        /* Setup company settings */
        companyData = settings && typeof settings.company === 'object' ? settings.company : false;
        company     = companyData && typeof companyData.company === 'string' ? companyData.company : '';
        ustid       = companyData && typeof companyData.ustid === 'string' ? companyData.ustid : '';
        
        storage.settings.company.company            = company;
        storage.settings.company.ustid              = ustid;
        storage.origin.settings.company.company     = company;
        storage.origin.settings.company.ustid       = ustid;

        /* Setup billing settings */
        billingData = settings && typeof settings.billing === 'object' ? settings.billing : false;
        bCountry    = billingData && typeof billingData.country === 'string' ? billingData.country : '';
        bStreet     = billingData && typeof billingData.street === 'string' ? billingData.street : '';
        bPostal     = billingData && typeof billingData.postal === 'string' ? billingData.postal : '';
        bCity       = billingData && typeof billingData.city === 'string' ? billingData.city : '';
        
        storage.settings.billing.country            = bCountry;
        storage.settings.billing.street             = bStreet;
        storage.settings.billing.postal             = bPostal;
        storage.settings.billing.city               = bCity;

        storage.origin.settings.billing.country     = bCountry;
        storage.origin.settings.billing.street      = bStreet;
        storage.origin.settings.billing.postal      = bPostal;
        storage.origin.settings.billing.city        = bCity;
        
        /* Setup shipping settings */
        shippingData    = settings && typeof settings.shipping === 'object' ? settings.shipping : false;
        sGender         = shippingData && typeof shippingData.gener === 'string' ? shippingData.gender : 'male';
        sName           = shippingData && typeof shippingData.name === 'string' ? shippingData.name : '';
        sPrename        = shippingData && typeof shippingData.prename === 'string' ? shippingData.prename : '';
        sCountry        = shippingData && typeof shippingData.country === 'string' ? shippingData.country : '';
        sStreet         = shippingData && typeof shippingData.street === 'string' ? shippingData.street : '';
        sPostal         = shippingData && typeof shippingData.postal === 'string' ? shippingData.postal : '';
        sCity           = shippingData && typeof shippingData.city === 'string' ? shippingData.city : '';
        
        storage.settings.shipping.gender            = sGender;
        storage.settings.shipping.name              = sName;
        storage.settings.shipping.prename           = sPrename;
        storage.settings.shipping.country           = sCountry;
        storage.settings.shipping.street            = sStreet;
        storage.settings.shipping.postal            = sPostal;
        storage.settings.shipping.city              = sCity;
        
        storage.origin.settings.shipping.gender     = sGender;
        storage.origin.settings.shipping.name       = sName;
        storage.origin.settings.shipping.prename    = sPrename;
        storage.origin.settings.shipping.country    = sCountry;
        storage.origin.settings.shipping.street     = sStreet;
        storage.origin.settings.shipping.postal     = sPostal;
        storage.origin.settings.shipping.city       = sCity;
        
        storage.settings.shipping.customShipping    = storage.origin.settings.shipping.customShipping = bCountry !== sCountry || bStreet !== sStreet || bPostal !== sPostal || bCity !== sCity;
        
        /* Setup payment settings */
        paymentData     = settings && typeof settings.payment === 'object' ? settings.payment : false;
        gateway         = paymentData && typeof paymentData.gateway === 'string' ? paymentData.gateway : 0;
        
        if (gateway === 'bank_transfer') {
            verification    = 1;
        } else {
            verification    = paymentData && typeof paymentData.verification === 'number' ? paymentData.verification : 0;
        }
        
        storage.settings.payment.gateway                = gateway;
        storage.settings.payment.verification           = verification === 0 || verification === 1 ? verification : 0;
        
        storage.origin.settings.payment.gateway         = gateway;
        storage.origin.settings.payment.verification    = verification === 0 || verification === 1 ? verification : 0;
    }
    
    function mergeStorage (data) {
        var checkout, order, user,
            sCountry, sStreet, sPostal, sCity,
            bCountry, bStreet, bPostal, bCity,
            i;
        
        checkout        = typeof data.checkout === 'object' ? data.checkout : false;
        
        mergeSettings (checkout);
        
        order           = checkout && typeof checkout.order === 'object' ? checkout.order : false;
        user            = np.auth.user ('user');

        if (order) {
            for (i in order) { if (i !== 'products') { order[i].id = -1; }  }
            
            if (typeof order.billing !== 'undefined' && typeof order.shipping !== 'undefined' 
            ) {
                bCountry    = order.billing.country;
                bStreet     = order.billing.street;
                bPostal     = order.billing.postal;
                bCity       = order.billing.city;
                
                sCountry    = order.shipping.country;
                sStreet     = order.shipping.street;
                sPostal     = order.shipping.postal;
                sCity       = order.shipping.city;

                order.shipping.customShipping    = bCountry !== sCountry || bStreet !== sStreet || bPostal !== sPostal || bCity !== sCity;
            } else {
                order.shipping.customShipping    = true;
            }

            if (typeof order.payment !== 'undefined' && typeof order.payment.gateway === 'string' && order.payment.gateway === 'bank_transfer') {
                
                order.payment.verification  = 1;
            }
            
            storage.order           = order;        
            storage.origin.order    = np.jsonClone (order);
        }

        if (user) {
            storage.user    = np.jsonClone (user);
        }
    }
    
    function setupCart (products) { np.Cart.setup (np.jsonClone (products));    }
    
    function setStep (step) {
        var path, urls,
            i;
            
        step    = typeof step === 'number' ? step : false;

        if (step) {
            storage.state.step  = parseInt (step, 10);
        } else {
            urls    = storage.urls;
            path    = $.address.path ().slice (1);
            
            for (i in urls) {
                if (path.indexOf (urls[i]) > -1) {
                    storage.state.step  = parseInt (i, 10);
                    
                    break;
                }
            }
        }
    }
    
    function cartDiffersFromOrder () {
        return typeof storage.order === 'object' && typeof storage.order.cartDiffers === 'boolean' ? storage.order.cartDiffers : true;
    }
    
    function validPaymentGateway () {
        return typeof storage.order === 'object' && typeof storage.order.invalidGateway === 'boolean' ? storage.order.invalidGateway : false;
    }
    
    function setupStorage (data) {
        if (typeof data.checkout !== 'undefined' && typeof data.checkout.cart !== 'undefined') {
            setupCart (data.checkout.cart);
        }
        
        mergeStorage (data); 
        setStep ();
    }
    
    function getError (error) {
        if (error !== null && typeof error !== 'undefined' && typeof error.data !== 'undefined' && typeof error.data.responseJSON !== 'undefined' && typeof error.data.responseJSON.err !== 'undefined') {
            return error.data.responseJSON.err;
        } 
        
        return null;
    }
    
    function validUser () {
        var gender, prename, name, mail, mail_confirmation;

        gender              = typeof storage.order.user.gender !== 'undefined' ? storage.order.user.gender : ''; 
        prename             = typeof storage.order.user.prename !== 'undfined' ? storage.order.user.prename : '';
        name                = typeof storage.order.user.name !== 'undefined' ? storage.order.user.name : '';
        mail                = typeof storage.order.user.email !== 'undefined' ? storage.order.user.email : '';
        mail_confirmation   = typeof storage.order.user.email_confirmation !== 'undefined' ? storage.order.user.email_confirmation : '';

        return (gender === 'male' || gender === 'female') 
                && !prename.empty ()
                && !name.empty ()
                && !mail.empty ()
                && mail === mail_confirmation;            
    }
    
    function validOrigUser () {
        var authUser, gender, prename, name, mail, mail_confirmation;
        
        authUser            = np.auth.user ('user');
        
        gender              = typeof authUser.gender === 'string' && authUser.gender === 'female' ? 'female' : 'male'; 
        prename             = typeof authUser.prename === 'string' && authUser.prename.length > 0 ? authUser.prename : '';
        name                = typeof authUser.name === 'string' && authUser.name.length > 0 ? authUser.name : '';
        mail                = typeof authUser.email === 'string' ? authUser.email : '';

        return (gender === 'male' || gender === 'female') 
                && !prename.empty ()
                && !name.empty ()
                && mail.complies ('mail');
    }
    
    function validBilling () {
        var country, street, postal, city;

        country = typeof storage.order.billing.country !== 'undefined' ? storage.order.billing.country : '';
        street  = typeof storage.order.billing.street !== 'undefined' ? storage.order.billing.street : '';
        postal  = typeof storage.order.billing.postal !== 'undefined' ? storage.order.billing.postal : '';
        city    = typeof storage.order.billing.city !== 'undefined' ? storage.order.billing.city : '';
        
        return !country.empty () && !street.empty () && !postal.empty () && !city.empty ();
    }        
    
    function validOrigBilling () {
        var country, street, postal, city;

        country = getOrigAddress ('billing', 'country');
        street  = getOrigAddress ('billing', 'street');
        postal  = getOrigAddress ('billing', 'postal');
        city    = getOrigAddress ('billing', 'city');

        return !country.empty () && !street.empty () && !postal.empty () && !city.empty ();
    }        
    
    function validShipping () {
        var customShipping, gender, name, prename, country, street, postal, city;
        
        customShipping  = typeof storage.order.shipping.customShipping !== 'undefined' ? storage.order.shipping.customShipping : false;
        
        if (customShipping) {
            gender  = typeof storage.order.shipping.gender !== 'undefined' ? storage.order.shipping.gender : '';
            name    = typeof storage.order.shipping.name !== 'undefined' ? storage.order.shipping.name : '';
            prename = typeof storage.order.shipping.prename !== 'undefined' ? storage.order.shipping.prename : '';
            country = typeof storage.order.shipping.country !== 'undefined' ? storage.order.shipping.country : '';
            street  = typeof storage.order.shipping.street !== 'undefined' ? storage.order.shipping.street : '';
            postal  = typeof storage.order.shipping.postal !== 'undefined' ? storage.order.shipping.postal : '';
            city    = typeof storage.order.shipping.city !== 'undefined' ? storage.order.shipping.city : '';

            return !gender.empty () && !name.empty() && !prename.empty () && !country.empty () && !street.empty () && !postal.empty () && !city.empty ();
        } else {
            return validBilling ();
        }
    }
    
    function validOrigShipping () {
        var country, street, postal, city;
        
        
        country = getOrigAddress ('shipping', 'country');
        street  = getOrigAddress ('shipping', 'street');
        postal  = getOrigAddress ('shipping', 'postal');
        city    = getOrigAddress ('shipping', 'city');

        return !country.empty () && !street.empty () && !postal.empty () && !city.empty ();
    }
    
    function validOrigCompany () {
        var company, ustid;
        
        company = np.checkout.getOrigAddress ('company', 'company');
        ustid   = np.checkout.getOrigAddress ('company', 'ustid');

        return company && !company.empty () && ustid && !ustid.empty ();
    }
    
    function validPayment () {
        return typeof storage.order.payment !== 'undefined'
               && typeof storage.order.payment.verification !== 'undefined' 
               && storage.order.payment.verification === 1;
    }
    
    function validDelivery () {
        return typeof storage.order.delivery !== 'undefined'
               && typeof storage.order.delivery.gateway !== 'undefined'
               && storage.order.delivery.gateway !== '';
    }
    
    function getOrigAddress (type, setting) {
        if (typeof type === 'string' && (type === 'billing' || type === 'shipping' || type === 'company')) {
            if (storage.origin.settings[type][setting] !== 'undefined') {
                return storage.origin.settings[type][setting];
            }
        } else {
            return {
                billing:    storage.origin.settings.billing, 
                shipping:   storage.origin.settings.shipping
            };
        }

        return false;
    }
    
    return {
        setup: {
            address: function (data)        { setupStorage (data);              },
            user: function (data)           { setupStorage (data);              },
            payment: function (data)        { setupStorage (data);              },
            verification: function (data)   { setupStorage (data);              },
            checkout: function (data)       { setupStorage ({checkout:data});   }
        },
        
        isDifferentUser: function () {
            var authGender, authPrename, authName, authMail, 
                ordGender, ordPrename, ordName, ordMail;
                
            
            authGender  = np.auth.getGender ();
            authPrename = np.auth.getPrename ();
            authName    = np.auth.getName ();
            authMail    = np.auth.getMail ();
            
            ordGender   = np.checkout.getOrder ('user', 'gender');
            ordPrename  = np.checkout.getOrder ('user', 'prename');
            ordName     = np.checkout.getOrder ('user', 'name');
            ordMail     = np.checkout.getOrder ('user', 'email');
            
            return authGender !== ordGender || authPrename !== ordPrename || authName !== ordName || authMail !== ordMail;
        },
        
        isDifferentCompany: function () {
            var settCompany, settUstID, ordCompany, ordUstID;
            
            settCompany = np.checkout.getOrigCompany ('company');
            settUstID   = np.checkout.getOrigCompany ('ustid');
            
            ordCompany  = np.checkout.getOrder ('company', 'company');
            ordUstID    = np.checkout.getOrder ('company', 'ustid');
            
            return settCompany !== ordCompany || settUstID !== ordUstID;
        },
        
        isDifferentBilling: function () {
            var settCountry, settStreet, settPostal, settCity,
                ordCountry, ordStreet, ordPostal, ordCity;
        
            settCountry     = np.checkout.getOrigAddress ('billing', 'country');
            settStreet      = np.checkout.getOrigAddress ('billing', 'street');
            settPostal      = np.checkout.getOrigAddress ('billing', 'postal');
            settCity        = np.checkout.getOrigAddress ('billing', 'city');
            
            ordCountry      = np.checkout.getOrder ('billing', 'country');
            ordStreet       = np.checkout.getOrder ('billing', 'street');
            ordPostal       = np.checkout.getOrder ('billing', 'postal');
            ordCity         = np.checkout.getOrder ('billing', 'city');
            
            return settCountry !== ordCountry || settStreet !== ordStreet || settPostal !== ordPostal || settCity !== ordCity;
        },
        
        isDifferentShipping: function (customShipping) {
            var settGender, settName, settPrename, settCountry, settStreet, settPostal, settCity,
                ordGender, ordName, ordPrename, ordCountry, ordStreet, ordPostal, ordCity;
        
            customShipping  = typeof customShipping === 'boolean' ? customShipping : true;
            
            settGender      = np.checkout.getOrigAddress ('shipping', 'gender');
            settName        = np.checkout.getOrigAddress ('shipping', 'name');
            settPrename     = np.checkout.getOrigAddress ('shipping', 'prename');
            settCountry     = np.checkout.getOrigAddress ('shipping', 'country');
            settStreet      = np.checkout.getOrigAddress ('shipping', 'street');
            settPostal      = np.checkout.getOrigAddress ('shipping', 'postal');
            settCity        = np.checkout.getOrigAddress ('shipping', 'city');

            if (customShipping) {
                ordGender       = np.checkout.getOrder ('shipping', 'gender');
                ordName         = np.checkout.getOrder ('shipping', 'name');
                ordPrename      = np.checkout.getOrder ('shipping', 'prename');
                ordCountry      = np.checkout.getOrder ('shipping', 'country');
                ordStreet       = np.checkout.getOrder ('shipping', 'street');
                ordPostal       = np.checkout.getOrder ('shipping', 'postal');
                ordCity         = np.checkout.getOrder ('shipping', 'city');
            } else {
                ordGender       = np.checkout.getOrder ('user', 'gender');
                ordName         = np.checkout.getOrder ('user', 'name');
                ordPrename      = np.checkout.getOrder ('user', 'prename');
                ordCountry      = np.checkout.getOrder ('billing', 'country');
                ordStreet       = np.checkout.getOrder ('billing', 'street');
                ordPostal       = np.checkout.getOrder ('billing', 'postal');
                ordCity         = np.checkout.getOrder ('billing', 'city');
            }
            
            return settGender !== ordGender || settName !== ordName || settPrename !== ordPrename 
                   || settCountry !== ordCountry || settStreet !== ordStreet || settPostal !== ordPostal || settCity !== ordCity;
        },
        
        
        emptyOrder: function () {
            return  !$.isArray (storage.order.products) || ($.isArray (storage.order.products) && storage.order.products.length === 0);
        },
        
        setCartDiffers: function (differs) {
            storage.order.cartDiffers   = differs;
        },
        
        cartDiffersFromOrder: function ()   { return cartDiffersFromOrder ();   },
        
        getState: function () {
            return storage.state;
        },
        
        getStates: function () {
            var enablePayment, enableConfirmation;
            
            enablePayment       = validUser () && validBilling () && validShipping ();
            enableConfirmation  = validPayment ();
            
            return {
                enablePayment:      enablePayment,
                enableConfirmation: enablePayment && enableConfirmation
            };
        },
        
        refreshStep: function () {
            setStep ();
        },
        
        getSettings: function (setting) {
            return typeof storage.settings[setting] !== 'undefined' ? storage.settings[setting] : null;
        },

        getOrder: function (type, setting) {
            var validTypes;
            
            validTypes   = new Array ('billing', 'shipping', 'company', 'payment', 'delivery', 'products', 'delivery_gateways', 'user', 'gateways');
            
            if (validTypes.indexOf (type) > -1) {
                if (typeof setting !== 'string') {
                    return np.jsonClone (storage.order[type]);
                } else if (typeof storage.order[type][setting] !== 'undefined') {
                    return np.jsonClone (storage.order[type][setting]);
                }
            }
            
            return false;
        },
        
        getOrigOrder: function (type, setting) {
            var validTypes;
            
            validTypes   = new Array ('billing', 'shipping', 'company', 'payment', 'delivery', 'products', 'user');
            
            if (validTypes.indexOf (type) > -1) {
                if (typeof setting !== 'string') {
                    return np.jsonClone (storage.origin.order[type]);
                } else if (typeof storage.origin.order[type][setting] !== 'undefined') {
                    return np.jsonClone (storage.origin.order[type][setting]);
                }
            }
            
            return false;
        },
        
        resetPayment: function () {
            storage.origin.order.payment    = np.jsonClone (storage.origin.settings.payment);
            storage.settings.payment        = np.jsonClone (storage.origin.settings.payment);
            storage.order.payment           = np.jsonClone (storage.origin.settings.payment);
        },
        
        setOrder: function (type, setting, value) {
            var validTypes;
            
            validTypes   = new Array ('billing', 'shipping', 'company', 'payment', 'delivery', 'products', 'user');
            
            if (validTypes.indexOf (type) > -1) {
                storage.order[type][setting]    = value;
            }
        },
        
        setOrigOrder: function (type, setting, value) {
            var validTypes;
            
            validTypes   = new Array ('billing', 'shipping', 'company', 'payment', 'delivery', 'products', 'user', 'verification');
            
            if (validTypes.indexOf (type) > -1) {
                storage.origin.order[type][setting]    = value;
            }
        },
        
        getOrderState: function () {
            return 0;
        },
        
        getOrigCompany: function (setting) {
            if (typeof setting !== 'undefined') {
                if (storage.origin.settings.company[setting] !== 'undefined') {
                    return storage.origin.settings.company[setting];
                }
            } else {
                return typeof storage.origin.settings.company !== 'undefined' ? storage.origin.settings.company : false;
            }
            
            return false;
        },
        
        setOrigCompany: function (setting, value) {
            storage.origin.settings.company[setting]  = value;
        },
        
        setCompany: function (setting, value) {
            storage.settings.company[setting]  = value;
        },
        
        getOrigAddress: function (type, setting) {
            return getOrigAddress (type, setting);
        },
        
        setOrigAddress: function (type, setting, value) {
            if ((type === 'billing' || type === 'shipping') && typeof storage.origin.settings[type][setting] !== 'undefined') {
                storage.origin.settings[type][setting]   = value;
            }
        },
        
        setAddress: function (type, setting, value) {
            if ((type === 'billing' || type === 'shipping') && typeof storage.settings[type][setting] !== 'undefined') {
                storage.settings[type][setting]  = value;
            }
        },

        setDeliveryGateways: function (delivery) {
            storage.order.delivery_gateways = np.jsonClone (delivery);
        },
        
        getCheckout: function () { 
            return storage.user;  
        },
        
        getVerification: function () {
            return storage.user.verification;
        },
        
        saveOrder: function () {
            var promise, request;
            
            promise = np.Promise ();
            
            request = {
                checkout: {
                    order: {
                        user: {
                            gender:     storage.order.user.gender,
                            prename:    storage.order.user.prename,
                            name:       storage.order.user.name,
                            email:      storage.order.user.email
                        },
                        
                        company: {
                            company:    storage.order.company.company,
                            ustid:      storage.order.company.ustid
                        },
                        
                        billing: {
                            country:    storage.order.billing.country,
                            street:     storage.order.billing.street,
                            postal:     storage.order.billing.postal,
                            city:       storage.order.billing.city
                        },
                        
                        shipping: {
                            gender:     storage.order.shipping.gender,
                            name:       storage.order.shipping.name,
                            prename:    storage.order.shipping.prename,
                            country:    storage.order.shipping.country,
                            street:     storage.order.shipping.street,
                            postal:     storage.order.shipping.postal,
                            city:       storage.order.shipping.city
                        }
                    }
                },

                type:       'checkout'
            };

            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp.data);
            }).fail (function (error) {
                promise.fail (getError (error));
            });     
            
            return promise;            
        },
        
        saveAddress: function (orderOverwrite) {
            var promise, request;
            
            promise         = np.Promise ();

            request = {
                checkout: {
                    address: {
                        billing: {
                            country:    storage.origin.settings.billing.country,
                            street:     storage.origin.settings.billing.street,
                            postal:     storage.origin.settings.billing.postal,
                            city:       storage.origin.settings.billing.city
                        },
                        
                        shipping: {
                            gender:     storage.origin.settings.shipping.gender,
                            name:       storage.origin.settings.shipping.name,
                            prename:    storage.origin.settings.shipping.prename,
                            country:    storage.origin.settings.shipping.country,
                            street:     storage.origin.settings.shipping.street,
                            postal:     storage.origin.settings.shipping.postal,
                            city:       storage.origin.settings.shipping.city
                        }
                    }
                },
                type:       'checkout'
            };
            
            orderOverwrite  = typeof orderOverwrite === 'boolean' && orderOverwrite === true;
            
            if (orderOverwrite) { request.checkout.address.orderOverwrite = 1;  }
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp.data);
            }).fail (function (error) {
                promise.fail (getError (error));
            });     
            
            return promise;
        },
        
        saveCompany: function () {
            var promise, request;
            
            promise         = np.Promise ();
            
            request         = {
                checkout: {
                    company: { 
                        company:    storage.origin.settings.company.company,
                        ustid:      storage.origin.settings.company.ustid
                    }
                },
                type:       'checkout'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp.data);
            }).fail (function (error) {
                promise.fail (getError (error));
            });            
            
            return promise;             
        },
        
        confirmOrder: function () {
            var promise, request;
            
            promise         = np.Promise();
            
            request = {
                checkout: {
                    confirm: true
                },
                type:       'checkout'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                np.Cart.flush ();
                
                promise.then (rsp.data);
            }).fail (function (error) {
                promise.fail (getError (error));
            });            
            
            return promise;            
        },
        
        savePayment: function (removeDeleted) {
            var promise, request, cartProducts, 
                order, products,
                i, l;
            
            removeDeleted   = typeof removeDeleted === 'boolean' ? removeDeleted : false;
            promise         = np.Promise();
            cartProducts    = np.jsonClone (np.Cart.getProducts ());
            l               = cartProducts.length;
            products        = new Array ();

            for (i=0; i<l; i++) {
                if ((removeDeleted && parseInt (cartProducts[i].deleted, 10) === 0) || !removeDeleted) {
                    products.push ({
                        article_id:         cartProducts[i].article_id,
                        amount:             cartProducts[i].amount,
                        selectedVariations: cartProducts[i].selectedVariations
                    });
                }
            }
            
            order           = np.jsonClone (storage.order);
            order.products  = np.jsonClone (products);
            
            if (typeof order.billing.id !== 'undefined')                { delete order.billing.id;              }
            if (typeof order.shipping.id !== 'undefined')               { delete order.shipping.id;             }
            if (typeof order.shipping.customShipping !== 'undefined')   { delete order.shipping.customShipping; }
            if (typeof order.company.id !== 'undefined')                { delete order.company.id;              }
            if (typeof order.payment.id !== 'undefined')                { delete order.payment.id;              }
            if (typeof order.user.id !== 'undefined')                   { delete order.user.id;                 }

            request = {
                checkout: {
                    payment: { 
                        order:  order
                    }
                },
                type:       'checkout'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                if (typeof rsp.data.checkout.order.user.email !== 'undefined') {
                    rsp.data.checkout.order.user.email_confirmation = rsp.data.checkout.order.user.email;
                }
                
                mergeStorage (rsp.data);

                np.observable.update ('Checkout', -1, 'invalidGateway', rsp.data.checkout.order.invalidGateway);
                
                promise.then (rsp.data.checkout.redirect);
            }).fail (function (error) {
                promise.fail (getError (error));
            });            
            
            return promise;              
        },
        
        saveDelivery: function () {
            var promise, request;
            
            promise         = np.Promise();

            request = {
                checkout: {
                    delivery: { 
                        gateway:  storage.order.delivery.gateway
                    }
                },
                type:       'checkout'
            };
            
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });            
            
            return promise;              
        },
        
        validUser: function ()          { return validUser ();          },
        validBilling: function ()       { return validBilling ();       },
        validShipping: function ()      { return validShipping ();      },
        validPayment: function ()       { return validPayment ();       },
        validDelivery: function ()      { return validDelivery ();      },
        
        validOrigUser: function ()      { return validOrigUser ();      },
        validOrigBilling: function ()   { return validOrigBilling ();   },
        validOrigShipping: function ()  { return validOrigShipping ();  },
        validOrigPayment: function ()   { return validOrigPayment ();   },
        validOrigCompany: function ()   { return validOrigCompany ();   },
        
        prepareOrderID: function () {
            return parseInt (storage.order.orderID, 10);
        },
        
        prepareUser: function () {
            var orderUser, authUser, emptyUser, user;

            orderUser   = np.jsonClone (np.checkout.getOrder ('user'));
            authUser    = np.jsonClone (np.auth.user ('user'));
            emptyUser   = {id:-1, gender: 'male', name: '', prename: '', email: '', email_confirmation: ''};

            if (!np.object.empty (orderUser)) {
                user                    = orderUser;
                user.email_confirmation = user.email;
            } else if (!np.object.empty (authUser)) {
                user                    = authUser;
                user.email_confirmation = user.email;
            } else {
                user                    = emptyUser;
            }

            if (typeof user.id === 'undefined')                 { user.id = -1;                 }
            if (typeof user.gender === 'undefined')             { user.gender = 'male';         }
            if (typeof user.prename === 'undefined')            { user.prename = '';            }
            if (typeof user.name === 'undefined')               { user.name = '';               }
            if (typeof user.email === 'undefined')              { user.email = '';              }
            if (typeof user.email_confirmation === 'undefined') { user.email_confirmation = ''; }

            np.checkout.setOrder ('user', 'id', user.id);
            np.checkout.setOrder ('user', 'gender', user.gender);
            np.checkout.setOrder ('user', 'prename', user.prename);
            np.checkout.setOrder ('user', 'name', user.name);
            np.checkout.setOrder ('user', 'email', user.email);
            np.checkout.setOrder ('user', 'email_confirmation', user.email_confirmation);

            return user;            
        },
        
        prepareCompany: function () {
            var orderCompany, userCompany, emptyCompany, company;

            orderCompany    = np.checkout.getOrder ('company');
            userCompany     = np.checkout.getSettings ('company');
            emptyCompany    = {id: -1, company: '', ustid: ''};

            if (!np.object.empty (orderCompany)) {
                company     = orderCompany;
            } else if (!np.object.empty (userCompany)) {
                company     = userCompany;
            } else {
                company     = emptyCompany;
            }

            if (typeof company.id === 'undefined')      { company.id = -1;      }
            if (typeof company.company === 'undefined') { company.company = ''; }
            if (typeof company.ustid === 'undefined')   { company.ustid = '';   }

            np.checkout.setOrder ('company', 'id', company.id);
            np.checkout.setOrder ('company', 'company', company.company);
            np.checkout.setOrder ('company', 'ustid', company.ustid);        

            return company;
        },
        
        prepareBilling: function () {
            var orderBilling, userBilling, emptyBilling, billing;

            orderBilling    = np.checkout.getOrder ('billing');
            userBilling     = np.checkout.getSettings ('billing');
            emptyBilling    = {id: -1, country: 'Deutschland', street: '', postal: '', city: ''};

            if (!np.object.empty (orderBilling)) {
                billing     = orderBilling;
            } else if (!np.object.empty (userBilling)) {
                billing     = userBilling;
            } else {
                billing     = emptyBilling;
            }

            if (typeof billing.id === 'undefined')      { billing.id = -1;                  }
            if (typeof billing.country === 'undefined') { billing.country = 'Deutschland';  }
            if (typeof billing.street === 'undefined')  { billing.street = '';              }
            if (typeof billing.postal === 'undefined')  { billing.postal = '';              }
            if (typeof billing.city === 'undefined')    { billing.city = '';                }

            np.checkout.setOrder ('billing', 'id', billing.id);
            np.checkout.setOrder ('billing', 'country', billing.country);
            np.checkout.setOrder ('billing', 'street', billing.street);
            np.checkout.setOrder ('billing', 'postal', billing.postal);
            np.checkout.setOrder ('billing', 'city', billing.city);

            return billing;
        },
        
        prepareShipping: function () {
            var orderShipping, userShipping, emptyShipping, shipping,
                tmpCustomShipping;

            orderShipping   = np.checkout.getOrder ('shipping');
            tmpCustomShipping   = typeof orderShipping.customShipping !== 'undefined' ? orderShipping.customShipping : false;
            if (typeof orderShipping.customShipping !== 'undefined') { delete orderShipping.customShipping; }

            userShipping    = np.checkout.getSettings ('shipping');
            emptyShipping   = {id:-1, country: 'Deutschland', street: '', postal: '', city: '', customShipping: false};

            if (!np.object.empty (orderShipping)) {
                shipping    = orderShipping;
                shipping.customShipping = tmpCustomShipping;
            } else if (!np.object.empty (userShipping)) {
                shipping    = userShipping;
            } else {
                shipping    = emptyShipping;
            }

            if (typeof shipping.id === 'undefined')             { shipping.id = -1;                 }
            if (typeof shipping.country === 'undefined')        { shipping.country = 'Deutschland'; }
            if (typeof shipping.street === 'undefined')         { shipping.street = '';             }
            if (typeof shipping.postal === 'undefined')         { shipping.postal = '';             }
            if (typeof shipping.city === 'undefined')           { shipping.city = '';               }
            if (typeof shipping.customShipping === 'undefined') { shipping.customShipping = false;  }

            np.checkout.setOrder ('shipping', 'id', shipping.id);
            np.checkout.setOrder ('shipping', 'country', shipping.country);
            np.checkout.setOrder ('shipping', 'street', shipping.street);
            np.checkout.setOrder ('shipping', 'postal', shipping.postal);
            np.checkout.setOrder ('shipping', 'city', shipping.city);
            np.checkout.setOrder ('shipping', 'customShipping', shipping.customShipping);        

            return shipping;
        },
        
        preparePayment: function () {
            var orderPayment, userPayment, emptyPayment, payment, now, utc;

            orderPayment    = np.checkout.getOrder ('payment');
            userPayment     = np.checkout.getSettings ('payment');
            emptyPayment    = {id: -1, gateway: 0, verification: 0};

            if (!np.object.empty (orderPayment)) {
                payment     = orderPayment;
            } else if (!np.object.empty (userPayment)) {
                payment     = userPayment;
            } else {
                payment     = emptyPayment;
            }

            if (typeof payment.id === 'undefined')              { payment.id = -1;          }
            if (typeof payment.gateway === 'undefined')         { payment.gateway = 0;      }
            if (typeof payment.verification === 'undefined')    { payment.verification = 0; }
            
            if (payment.mandat_ref_date === null)               { 
                now = new Date ();
                
                payment.mandat_ref_date = now.dateFormat ('d.m.Y / H:i');
            }

            np.checkout.setOrder ('payment', 'id', payment.id);
            np.checkout.setOrder ('payment', 'gateway', payment.gateway);
            np.checkout.setOrder ('payment', 'verification', payment.verification);
            np.checkout.setOrder ('payment', 'mandat_ref_date', payment.mandat_ref_date);

            return payment;        
        },
        
        prepareDelivery: function () {
            var orderDelivery, userDelivery, emptyDelivery, delivery;
            
            orderDelivery   = np.checkout.getOrder ('delivery');
            userDelivery    = np.checkout.getSettings ('delivery');
            emptyDelivery   = {id: -1, gateway: ''};

            if (!np.object.empty (orderDelivery)) {
                delivery    = orderDelivery;
            } else if (!np.object.empty (userDelivery)) {
                delivery    = userDelivery;
            } else {
                delivery    = emptyDelivery;
            }
            
            if (typeof delivery.id === 'undefined')         { delivery.id = -1;         }
            if (typeof delivery.gateway === 'undefined')    { delivery.gateway = '';    }

            np.checkout.setOrder ('delivery', 'id', delivery.id);
            np.checkout.setOrder ('delivery', 'gateway', delivery.gateway);
            
            return delivery;
        },
        
        prepareDeliveryGateways: function () {
            return np.checkout.getOrder ('delivery_gateways');
        },
        
        preparePaymentGateways: function () {
            return np.checkout.getOrder ('gateways');
        },
        
        prepareInvalidGateway: function () {
            return validPaymentGateway ();
        }
    };
}()));