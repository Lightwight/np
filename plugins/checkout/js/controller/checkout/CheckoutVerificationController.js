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

np.controller.extend ('CheckoutVerificationController', (function () {
    function removeDeletedProducts () {
        var deletedProducts;
        
        deletedProducts = np.Cart.getDeletedProducts ();
        
        $.each (deletedProducts, function (inx, product) {
            $('#checkout-cart [data-cart-id="'+product.id+'"] .product-deleted-info button').click ();
        });
    }
    
    function payPerPayPal (_this) {
        _this.set ('payment.gateway', 'paypal_express');
        _this.set ('sendingVerify', true);

        np.checkout.setOrder ('payment', 'gateway', 'paypal_express');
        
        np.checkout.savePayment (true)
        .then (function (response) {
            _this.set ('redirect', response);
            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', false);
        })
        .fail (function () {
            np.checkout.setOrder ('payment', 'gateway', 0);

            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', true);
        });        
    }
    
    function payPerBankTransfer (_this) {
        _this.set ('payment.gateway', 'bank_transfer');
        _this.set ('sendingVerify', true);
        
        np.checkout.setOrder ('payment', 'gateway', 'bank_transfer');    
        
        np.checkout.savePayment (true)
        .then (function (response) {
            _this.set ('redirect', false);
            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', false);
        })
        .fail (function () {
            np.checkout.setOrder ('payment', 'gateway', 0);
    
            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', true);
        });        
    }
    
    function payPerCOD (_this) {
        _this.set ('payment.gateway', 'cod');
        _this.set ('sendingVerify', true);
        
        np.checkout.setOrder ('payment', 'gateway', 'cod');
        
        np.checkout.savePayment (true)
        .then (function (response) {
            _this.set ('redirect', false);
            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', false);
        })
        .fail (function () {
            np.checkout.setOrder ('payment', 'gateway', 0);

            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', true);
        });        
    }
    
    function payPerDebit (_this) {
        _this.set ('payment.gateway', 'debit');
        _this.set ('sendingVerify', true);
        
        np.checkout.setOrder ('payment', 'gateway', 'debit');
        
        np.checkout.savePayment (true)
        .then (function (response) {
            _this.set ('redirect', false);
            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', false);
        })
        .fail (function () {
            np.checkout.setOrder ('payment', 'gateway', 0);

            _this.set ('sendingVerify', false);
            _this.set ('errorVerify', true);
        });        
    }
    
    return {
        view:   'CheckoutVerificationView',
        model:  function () {
            var orderID, user, company, billing, shipping, payment, delivery, dGateways;
            
            np.checkout.refreshStep ();

            orderID         = np.checkout.prepareOrderID ();
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
                    orderID:        orderID,
                    user:           user, 
                    company:        company,
                    billing:        billing,
                    shipping:       shipping,
                    payment:        payment,
                    delivery:       delivery,
                    dGateways:      dGateways,
                    state:          np.checkout.getState (),
                    
                    confirming:     false,
                    sending:        false,
                    error:          false,
                    success:        false,

                    sendingVerify:  false,
                    errorVerify:    false,

                    redirect:       false,
                    redirecting:    false,
                    
                    confirmed:      false
                }
            };            
        },

        events: {
            confirmOrder: function (view) {
                var _this;

                _this   = this;

                _this.set ('sending', true);
                _this.set ('confirming', true);

                np.checkout.confirmOrder ()
                .then (function () {
                    window.setTimeout (function () {
                        _this.set ('sending', false);
                        _this.set ('error', false);
                        _this.set ('success', true);
                        
                        np.checkout.resetPayment ();
                        np.checkout.setCartDiffers (false);

                        view.rerender ('CartAmountView');
                        view.rerender ('CartOverviewMenuView');
                        view.rerender ('CartView');
                    }, 500);
                })
                .fail (function (error) {
                    np.checkout.setOrder ('payment', 'verification', 0);
                    np.checkout.setOrigOrder ('payment', 'verification', 0);
                    
                    window.setTimeout (function () {
                        _this.set ('sending', false);
                        _this.set ('payment.verification', 0);
                        _this.set ('success', false);
                        _this.set ('error', true);
                    }, 500);
                });
            },

            verifyPayment: function () {
                var gateway, hasDeleted;

                hasDeleted  = np.Cart.hasDeletedProducts ();
                gateway     = this.get ('payment.gateway');
                
                if (hasDeleted) { removeDeletedProducts (); } 
                
                if (gateway === 'paypal_express') {
                    payPerPayPal (this);
                } else if (gateway === 'bank_transfer') {
                    payPerBankTransfer (this);
                } else if (gateway === 'cod') {
                    payPerCOD (this);
                } else if (gateway === 'debit') {
                    payPerDebit (this);
                }
            },
            
            redirect: function () {
                this.set ('redirecting', true);
                window.open (this.get ('redirect'), '_self');
            },

            closeInfo: function () {
                this.set ('redirect', '');
            },
            
            afterConfirmation: function () {
                if (this.get ('success')) {
                    this.set ('error', false);
                    this.set ('success', false);
                    this.set ('sending', false);
                    this.set ('confirming', false);
                    this.set ('confirmed', true);
                } else {
                    this.set ('error', false);
                    this.set ('success', false);
                    this.set ('sending', false);
                    this.set ('confirming', false);
                    this.set ('confirmed', false);
                }
            }
        }
    };
}()));