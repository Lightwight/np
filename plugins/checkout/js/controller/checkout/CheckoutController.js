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

np.controller.extend ('CheckoutController', (function () {
    function _saveOrder (_this) {
        var promise;
        
        promise = np.Promise ();
        
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
    
    function handleInvalidPayment (gateway, gateways) {
        var currentStep, invalidGateway;
        
        currentStep     = np.checkout.getState ().step;
        invalidGateway  = np.checkout.prepareInvalidGateway ();

        if (currentStep > 3 && invalidGateway) { np.routeTo ('/checkout/payment');  } 
        
        return invalidGateway;
    }
    
    return {
        view:   'CheckoutView',
        model:  function () {
            var orderID, user, company, billing, shipping, payment, delivery, dGateways, pGateways, invalidGateway;
            
            np.checkout.refreshStep ();

            orderID         = np.checkout.prepareOrderID ();
            user            = np.checkout.prepareUser ();
            company         = np.checkout.prepareCompany ();
            billing         = np.checkout.prepareBilling ();
            shipping        = np.checkout.prepareShipping ();
            payment         = np.checkout.preparePayment ();
            delivery        = np.checkout.prepareDelivery ();
            dGateways       = np.checkout.prepareDeliveryGateways ();
            pGateways       = np.checkout.preparePaymentGateways ();
            invalidGateway  = handleInvalidPayment ();
            
            return {
                Checkout: {
                    id:             -1, 
                    orderID:        orderID,
                    user:           user, 
                    company:        company,
                    billing:        billing,
                    shipping:       shipping,
                    payment:        payment,
                    delivery:       delivery,
                    dGateways:      dGateways,
                    pGateways:      pGateways,
                    state:          np.checkout.getState (),
                    invalidGateway: invalidGateway,
                    sending:        false,
                    error:          false,
                    success:        false,
                    redirect:       false,
                    confirmed:      false
                }
            };
        },
        
        events: {
            nextStep: function (view) {
                var btnMap, btnNextStep, btnID;

                btnMap      = {
                    checkoutStep1: '#/checkout/address',
                    checkoutStep2: '#/checkout/payment',
                    checkoutStep3: '#/checkout/verification',
                    checkoutStep4: '#/checkout/confirmation'
                };
                
                btnNextStep = view.getNode ().find ('.checkout-next-step');
                btnID       = btnNextStep.length > 0 ? btnNextStep.attr ('id') : false;
                
                if (btnID && typeof btnMap[btnID] !== 'undefined'
                    && btnID !== 'checkoutStep1'
                ) {
                    _saveOrder (this)
                    .then (function () {
                        np.routeTo (btnMap[btnID]);
                    })
                    .fail (function () {});
                } else if (btnID && typeof btnMap[btnID] !== 'undefined'
                    && btnID === 'checkoutStep1'
                ) {
                    np.routeTo (btnMap[btnID]);
                }
            },
            
            saveOrder: function () {
                _saveOrder (this)
                .then (function () {})
                .fail (function () {});
            }
        }
    };
}()));