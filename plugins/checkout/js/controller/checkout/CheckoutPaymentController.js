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

np.controller.extend ('CheckoutPaymentController', (function () {
    function mapCurrentGateway (gateway, gateways) {
        var i;
        
        for (i in gateways) {
            if (gateways[i].name === gateway) {
                return {
                    prefix: gateways[i].prefix,
                    name:   gateways[i].plain
                };
            }
        }

        return {
            prefix: 'mit',
            name:   'Unbekannt'
        };
    }

    return {
        view:   'CheckoutPaymentView',
        model:  function () {
            this.sendingPayPal              = false;
            this.errorPayPal                = false;
            this.successPayPal              = false;

            this.sendingDebit               = false;
            this.errorDebit                 = false;
            this.successDebit               = false;

            this.sendingBankTransfer        = false;
            this.errorBankTransfer          = false;
            this.successBankTransfer        = false;

            this.sendingCOD                 = false;
            this.errorCOD                   = false;
            this.successCOD                 = false;        

            this.Checkout.selectedGateway   = this.Checkout.payment.gateway !== 'paypal_express' ? this.Checkout.payment.gateway : 0;
            this.Checkout.currentGateway    = mapCurrentGateway (this.Checkout.selectedGateway, this.Checkout.pGateways);

            this.redirect                   = false;
            this.redirecting                = false;

            this.iban                       = this.Checkout.iban = typeof this.Checkout.payment.iban !== 'undefined' && this.Checkout.payment.iban !== null ? this.Checkout.payment.iban : '';
            this.bic                        = this.Checkout.bic = typeof this.Checkout.payment.bic !== 'undefined' && this.Checkout.payment.bic !== null ? this.Checkout.payment.bic : '';
            this.owner                      = this.Checkout.user.name+', '+this.Checkout.user.prename;

            this.Checkout.iban0             = this.iban.length > 3 ? this.iban.slice (0, 4) : '';
            this.Checkout.iban1             = this.iban.length > 7 ? this.iban.slice (4, 8) : '';
            this.Checkout.iban2             = this.iban.length > 11 ? this.iban.slice (8, 12) : '';
            this.Checkout.iban3             = this.iban.length > 15 ? this.iban.slice (12, 16) : '';
            this.Checkout.iban4             = this.iban.length > 19 ? this.iban.slice (16, 20) : '';
            this.Checkout.iban5             = this.iban.length > 21 ? this.iban.slice (20, 22) : '';
            this.Checkout.iban6             = this.iban.length > 22 ? this.iban.slice (22) : '';

            return this;  
        },

        events: {
            payPerPayPal: function () {
                var _this;

                _this   = this;

                _this.set ('payment.gateway', 'paypal_express');
                _this.set ('payment.verification', 0);
                _this.set ('selectedGateway', 'paypal_express');

                _this.set ('sendingPayPal', true);
                _this.set ('sending', true);

                np.checkout.setOrder ('payment', 'gateway', 'paypal_express');
                np.checkout.setOrder ('payment', 'verification', 0);

                np.checkout.savePayment ()
                .then (function (response) {
                    _this.set ('sending', false);

                    _this.set ('redirect', response);
                    _this.set ('errorPayPal', false);
                    _this.set ('sendingPayPal', false);
                })
                .fail (function () {
                    np.checkout.setOrder ('payment', 'gateway', 0);

                    _this.set ('sending', false);
                    _this.set ('payment.gateway', 0);
                    _this.set ('errorPayPal', true);
                    _this.set ('sendingPayPal', false);
                });
            },

            payPerBankTransfer: function () {
                var _this;

                _this   = this;

                _this.set ('sendingBankTransfer', true);
                _this.set ('payment.verification', 0);
                _this.set ('selectedGateway', 'bank_transfer');

                _this.set ('sending', true);

                np.checkout.setOrder ('payment', 'verification', 0);
                np.checkout.setOrder ('payment', 'gateway', 'bank_transfer');

                np.checkout.savePayment ()
                .then (function () {
                    np.checkout.setOrder ('payment', 'verification', 1);

                    _this.set ('payment.gateway', 'bank_transfer');
                    _this.set ('payment.verification', 1);

                    _this.set ('errorBankTransfer', false);
                    _this.set ('sendingBankTransfer', false);
                    _this.set ('sending', false);
                })
                .fail (function () {
                    np.checkout.setOrder ('payment', 'gateway', 0);
                    np.checkout.setOrder ('payment', 'verification', 0);

                    _this.set ('payment.gateway', 0);
                    _this.set ('payment.verification', 0);

                    _this.set ('errorBankTransfer', true);
                    _this.set ('sendingBankTransfer', false);
                    _this.set ('sending', false);
                });
            },

            payPerCOD: function () {
                var _this;

                _this   = this;

                _this.set ('sendingCOD', true);
                _this.set ('sending', true);
                _this.set ('payment.verification', 0);
                _this.set ('selectedGateway', 'cod');

                np.checkout.setOrder ('payment', 'gateway', 'cod');
                np.checkout.setOrder ('payment', 'verification', 0);

                np.checkout.savePayment ()
                .then (function () {
                    np.checkout.setOrder ('payment', 'verification', 1);

                    _this.set ('payment.gateway', 'cod');
                    _this.set ('payment.verification', 1);

                    _this.set ('errorCOD', false);
                    _this.set ('sendingCOD', false);
                    _this.set ('sending', false);
                })
                .fail (function () {
                    np.checkout.setOrder ('payment', 'gateway', 0);
                    np.checkout.setOrder ('payment', 'verification', 0);

                    _this.set ('payment.gateway', 0);
                    _this.set ('payment.verification', 0);

                    _this.set ('errorCOD', true);
                    _this.set ('sendingCOD', false);
                    _this.set ('sending', false);
                });
            },

            payPerDebit: function () {
                var _this;

                _this   = this;

                _this.set ('sendingDebit', true);
                _this.set ('sending', true);

                np.checkout.setOrder ('payment', 'verification', 0);
                np.checkout.setOrder ('payment', 'gateway', 'debit');
                np.checkout.setOrder ('payment', 'iban', this.get ('payment.iban'));
                np.checkout.setOrder ('payment', 'bic', this.get ('payment.bic'));
                np.checkout.setOrder ('payment', 'owner', this.get ('user.name')+', '+this.get ('user.prename'));
                np.checkout.setOrder ('payment', 'mandat_ref_date', $('[data-handle="CheckoutPaymentView"] .sign-date').html ().replace (' Uhr', ''));

                np.checkout.savePayment ()
                .then (function () {
                    np.checkout.setOrder ('payment', 'verification', 1);

                    _this.set ('selectedGateway', null);
                    _this.set ('payment.gateway', 'debit');
                    _this.set ('payment.verification', 1);

                    _this.set ('errorDebit', false);
                    _this.set ('sendingDebit', false);
                    _this.set ('sending', false);
                })
                .fail (function () {
                    np.checkout.setOrder ('payment', 'gateway', 0);
                    np.checkout.setOrder ('payment', 'verification', 0);

                    _this.set ('payment.gateway', 0);
                    _this.set ('payment.verification', 0);

                    _this.set ('errorDebit', true);
                    _this.set ('sendingDebit', false);
                    _this.set ('sending', false);
                });
            },

            processDebit: function () {
                this.set ('selectedGateway', 'debit');
            },

            processPayPal: function () {
                this.set ('redirecting', true);
                window.open (this.get ('redirect'), '_self');
            },

            setIBAN: function (view) {
                var $iban0, $iban1, $iban2, $iban3, $iban4, $iban5, $iban6,
                    iban0, iban1, iban2, iban3, iban4, iban5, iban6;

                $iban0  = $('.iban0');
                $iban1  = $('.iban1');
                $iban2  = $('.iban2');
                $iban3  = $('.iban3');
                $iban4  = $('.iban4');
                $iban5  = $('.iban5');
                $iban6  = $('.iban6');

                $iban0.find ('br').remove ();
                $iban1.find ('br').remove ();
                $iban2.find ('br').remove ();
                $iban3.find ('br').remove ();
                $iban4.find ('br').remove ();
                $iban5.find ('br').remove ();

                if ($iban6.length > 0) { $iban6.find ('br').remove ();  }

                iban0   = $iban0.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban1   = $iban1.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban2   = $iban2.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban3   = $iban3.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban4   = $iban4.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban5   = $iban5.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                iban6   = '';

                if ($iban6.length > 0) {
                    iban6   = $iban6.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, '');
                }

                this.set ('payment.iban', iban0+iban1+iban2+iban3+iban4+iban5+iban6);
            },

            setBIC: function (view) {
                this.set ('payment.bic', view.get ('bic'));
            },

            setOwner: function (view) {
                this.set ('owner', view.get ('owner'));
            },

            redirect: function () {
                this.set ('redirecting', true);
                window.open (this.get ('redirect'), '_self');
            },

            closeInfo: function () {
                this.set ('payment.verification', 0);
                this.set ('selectedGateway', null);
                this.set ('payment.gateway', 0);
                this.set ('redirect', '');            
            }
        }
    };
})());