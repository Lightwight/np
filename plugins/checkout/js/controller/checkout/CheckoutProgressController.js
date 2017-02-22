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

np.controller.extend ('CheckoutProgressController', (function () {
    var links;
    
    links   = {
        chkPrgLogin:        'checkout/user',
        chkPrgAddress:      'checkout/address',
        chkPrgPayment:      'checkout/payment',
        chkPrgVerification: 'checkout/verification',
        chkPrgConfirmation: 'checkout/confirmation'
    };
    
    function saveOrder (_this) {
        var promise;
        
        promise     = np.Promise ();
        
        _this.set ('sending', true);

        np.checkout.saveOrder ()
        .then (function () {
            _this.set ('error', false);
            _this.set ('success', true);
            _this.set ('sending', false);

            promise.then ();
        })
        .fail (function (error) {
            _this.set ('success', false);
            _this.set ('error', error);
            _this.set ('sending', false);
            
            promise.fail ();
        });  
        
        return promise;
    }
    
    return {
        view:   'CheckoutProgressView',
        model:  function () {
            var user, company, billing, shipping, payment, delivery, dGateways;
            
            np.checkout.refreshStep ();

            user            = np.checkout.prepareUser ();
            company         = np.checkout.prepareCompany ();
            billing         = np.checkout.prepareBilling ();
            shipping        = np.checkout.prepareShipping ();
            payment         = np.checkout.preparePayment ();
            delivery        = np.checkout.prepareDelivery ();
            dGateways       = np.checkout.prepareDeliveryGateways ();
            
            return {
                Checkout: {
                    id:             -1, 
                    user:           user, 
                    company:        company,
                    billing:        billing,
                    shipping:       shipping,
                    payment:        payment,
                    delivery:       delivery,
                    dGateways:      dGateways,
                    state:          np.checkout.getState (),
                    sending:        false,
                    error:          false,
                    success:        false
                }
            };            
        },
        
        events: {
            saveOrderByLogin: function () {
                if (!np.checkout.emptyOrder ()) {
                    saveOrder (this)
                    .then (function () {
                        np.routeTo ('#/checkout/user');
                    })
                    .fail (function (error) {

                    });
                } else {
                    np.routeTo ('#/checkout/user');
                }
            },
    
            saveOrderByAddress: function () {
                if (!np.checkout.emptyOrder ()) {
                    saveOrder (this)
                    .then (function () {
                        np.routeTo ('#/checkout/address');
                    })
                    .fail (function (error) {

                    });
                } else {
                    np.routeTo ('#/checkout/address');
                }
            },
            
            saveOrderByPayment: function () {
                if (!np.checkout.emptyOrder ()) {
                    saveOrder (this)
                    .then (function () {
                        np.routeTo ('#/checkout/payment');
                    })
                    .fail (function (error) {

                    });
                } else {
                    np.routeTo ('#/checkout/payment');
                }
            },
            
            saveOrderByVerification: function () {
                if (!np.checkout.emptyOrder ()) {
                    saveOrder (this)
                    .then (function () {
                        np.routeTo ('#/checkout/verification');
                    })
                    .fail (function (error) {

                    });
                } else {
                    np.routeTo ('#/checkout/verification');
                }
            }
        }
    };
}()));