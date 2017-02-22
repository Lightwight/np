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

np.view.extend ('CheckoutVerificationView', (function () {
    var msg;
    
    msg = {
        redirect:   'Ihr Zahlungsanbieter konnte kontaktiert werden.<br>'
                    + 'Folgen Sie einfach den Anweisungen Ihres Zahlungsanbieters, '
                    + 'um Ihre gewünschte Zahlungsmethode zu bestätigen. '
                    + 'Sie werden danach wieder zurückgeleitet. '
                    + 'Dort haben Sie die Möglichkeit, Ihre Bestellung zu '
                    + 'überprüfen und ggfs. zu ändern. Die Zahlung wird erst '
                    + 'wirksam, sobald Sie Ihre Bestellung bestätigt '
                    + 'haben.',
        
        hasDeleted: 'In Ihrem Warenkorb befinden sich gelöschte Artikel. Hierdurch verändert sich der Gesamtpreis, da diese nicht in Ihrer Bestellung mitberücksichtig werden können.<br><br>'
                    + 'Klicken Sie auf den Button - Gesamtpreis best&auml;tigen - damit Die Änderungen wirksam werden.',
                
        chgBank:    'Der Gesamtpreis hat sich ge&auml;ndert.<br>Klicken Sie auf den Button - Gesamtpreis best&auml;tigen - damit Die Änderungen wirksam werden.',
        chgCOD:     'Der Gesamtpreis hat sich ge&auml;ndert.<br>Klicken Sie auf den Button - Gesamtpreis best&auml;tigen - damit Die Änderungen wirksam werden.',
        chgDebit:   'Der Gesamtpreis hat sich ge&auml;ndert.<br>Klicken Sie auf den Button - Gesamtpreis best&auml;tigen - damit Die Änderungen wirksam werden.',
        chgRest:    'Der Gesamtpreis hat sich ge&auml;ndert und muss auf der PayPal-Seite aktualisiert werden.<br>'
                    + 'Klicken Sie hierf&uuml;r auf den Button - Gesamtpreis best&auml;tigen - um fortzufahren.'
    };

    function validate (model) {
        return np.checkout.validUser (model) && np.checkout.validBilling (model) && np.checkout.validShipping (model) && np.checkout.validPayment (model) && !np.checkout.cartDiffersFromOrder ();
    }
    
    return {
        showLinkToPayment: function (model) {
            var gateway, hasDeleted;
            
            hasDeleted  = np.Cart.hasDeletedProducts ();
            
            if (!model.get ('redirect')) {
                if (np.checkout.cartDiffersFromOrder () || !np.checkout.validPayment (model) || hasDeleted) {
                    gateway = model.get ('payment.gateway');
                    
                    if (hasDeleted) {
                        this.find ('.text.content').html (msg.hasDeleted);
                    } else if (gateway === 'bank_transfer') {
                        this.find ('.text.content').html (msg.chgBank);
                    } else if (gateway === 'cod') {
                        this.find ('.text.content').html (msg.chgCOD);
                    } else if (gateway === 'debit') {
                        this.find ('.text.content').html (msg.chgDebit);
                    } else {
                        this.find ('.text.content').html (msg.chgRest);
                    }

                    this.removeClass ('hidden');
                } else {
                    this.addClass ('hidden');
                }
            } else {
                if (np.checkout.getOrder ('payment').gateway === 'bank_transfer'
                    || np.checkout.getOrder ('payment').gateway === 'cod'
                    || np.checkout.getOrder ('payment').gateway === 'debit'
                ) {
                    this.addClass ('hidden');
                }
            }
        }
        .observes ('id').on ('change')
        .observes ('errorVerify').on ('change'),

        enableCheckoutNextStep: function (model) {
            if (!model.get ('sending') && !np.checkout.cartDiffersFromOrder ()) {
                this.removeClass ('disabled');
            } else {
                this.addClass ('disabled');
            }
        }.observes ('@each').on ('change'),
        
        enableCheckoutCartVerify: function (model) {
            if (!model.get ('sending') && !model.get ('errorVerify')) {
                if (model.get ('payment.gateway') === 'paypal_express') {
                    if (!model.get ('sendingVerify') && !model.get ('errorVerify')) {
                        this.addClass ('no-display');
                    } else {
                        this.removeClass ('no-display');
                    }
                } else {
                    this.removeClass ('no-display');
                    this.removeClass ('disabled');
                }
            } else { 
                this.removeClass ('no-display');
                this.removeClass ('disabled');
            }
        }
        .observes ('sending').on ('change')
        .observes ('errorVerify').on ('change')
        .observes ('sendingVerify').on ('change'),

        isSendingVerify: function (model) {
            if (model.get ('sendingVerify')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }
        .observes ('sendingVerify'). on ('change'),
        
        isSending: function (model) {
            var btn;
            
            btn = this.parents ('a:first');
            
            if (model.get ('sendingVerify')) {
                this.removeClass ('hidden');
                btn.addClass ('disabled');
            } else {
                this.addClass ('hidden');
                btn.removeClass ('disabled');
            }
        }
        .observes ('sendingVerify'). on ('change'),
        
        notSending: function (model) {
            if (!model.get ('sendingVerify')) {
                this.removeClass ('hidden');
            } else {
                this.addClass ('hidden');
            }
        }.observes ('sendingVerify').on ('change'), 

        showPaypal: function (model) {
            if (model.get ('sendingVerify') && model.get ('payment.gateway') === 'paypal_express') {
                $(this).removeClass ('no-display');
            }
        }.observes ('sendingVerify').on ('change'),

        isSendingPayPal: function (model) {
            if (model.get ('sendingVerify') && model.get ('payment.gateway') === 'paypal_express') {
                $(this).removeClass ('hidden');
                $(this).addClass ('rotate_right-1s');
            } else {
                $(this).addClass ('hidden');
                $(this).removeClass ('rotate_right-1s');
            }
        }.observes ('sendingVerify').on ('change'),
        
        preparePayPal: function (model) {
            if (model.get ('sendingVerify') && model.get ('payment.gateway') === 'paypal_express') {
                $(this).removeClass ('no-display');
            } else {
                $(this).addClass ('no-display');
            }
        }.observes ('sendingVerify').on ('change'),
        
        contactedPayPal: function (model) {
            if (model.get ('redirect') && !model.get ('errorVerify') && model.get ('payment.gateway') === 'paypal_express') {
                $(this.removeClass ('no-display'));
            } else {
                $(this.addClass ('no-display'));
            }
        }.observes ('redirect').on ('change'),
        
        failedPayPal: function (model) {
            if (!model.get ('sendingVerify') && model.get ('errorVerify') && model.get ('payment.gateway') === 'paypal_express') {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }
        .observes ('sendingVerify').on ('change')
        .observes ('errorVerify').on ('change'),

        payPalEnabled: function (model) {
            if (model.get ('redirect') && !model.get ('errorVerify') && model.get ('payment.gateway') === 'paypal_express') {
                $(this.removeClass ('no-display'));
                $(this.removeClass ('disabled'));
            } else {
                $(this.addClass ('no-display'));
                $(this.addClass ('disabled'));
            }
        }
        .observes ('sendingVerify').on ('change'),
        
        hideOnSending: function (model) {
            if (model.get ('payment.gateway') === 'paypal_express' && (model.get ('sendingVerify') || model.get ('errorVerify') || model.get ('redirect'))) {
                $(this).addClass ('no-display');
            } else {
                $(this).removeClass ('no-display');
            }
        }
        .observes ('errorVerify').on ('change')
        .observes ('sendingVerify').on ('change'),

        failedElse: function (model) {
            if (!model.get ('sendingVerify') && model.get ('errorVerify') && model.get ('payment.gateway') !== 'paypal_express') {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }
        .observes ('errorVerify').on ('change')
        .observes ('sendingVerify').on ('change'),

        isConfirming: function (model) {
            if (model.get ('confirming')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('confirming').on ('change'),
        
        isSendingConfirmation: function (model) {
            if (model.get ('sending')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('sending').on ('change'),
        
        isFail: function (model) {
            if (model.get ('error')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('error').on ('change'),
        
        isSuccess: function (model) {
            if (model.get ('success')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('success').on ('change')
    };
}()));