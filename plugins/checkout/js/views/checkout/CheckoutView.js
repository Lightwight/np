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

np.view.extend ('CheckoutView', (function () {
    function validateStep (model) {
        switch (model.get ('state.step')) {
            case 1:
                return true;
                break;
            case 2: 
                return np.checkout.validUser (model) && np.checkout.validBilling (model) && np.checkout.validShipping (model);
                break;
            case 3:
                return np.checkout.validUser (model) && np.checkout.validBilling (model) && np.checkout.validShipping (model) && np.checkout.validPayment (model) && model.get ('invalidGateway') === false;
                break;
            case 4:
                return np.checkout.validUser (model) && np.checkout.validBilling (model) && np.checkout.validShipping (model) && np.checkout.validPayment (model) && model.get ('invalidGateway') === false && !np.checkout.cartDiffersFromOrder ();
                break;
            default:
                return false;
                break;
        }
    }
    
    function getDeliveryCosts () {
        var map, delivery, gateways;

        map         = {dhl: 'DHL', ups: 'UPS', hermes: 'Hermes'};
        
        delivery    = np.checkout.getOrder ('delivery').gateway;
        gateways    = np.checkout.getOrder ('delivery_gateways');

        if (typeof map[delivery] !== 'undefined' && typeof gateways[map[delivery]] !== 'undefined') {
            return gateways[map[delivery]].total;
        }
        
        return 0;
    }
    
    function getCODCosts () {
        var map, delivery, gateways;

        map         = {dhl: 'DHL', ups: 'UPS', hermes: 'Hermes'};

        delivery    = np.checkout.getOrder ('delivery').gateway;
        gateways    = np.checkout.getOrder ('delivery_gateways');

        if (typeof map[delivery] !== 'undefined' 
            && typeof gateways[map[delivery]] !== 'undefined'
            && gateways[map[delivery]].cod > 0
        ) {
            return gateways[map[delivery]].cod;
        }        
        
        return 0;
    }
    
    return {
        enableCheckoutNextStep: function (model) {
            if (!model.get ('sending') && validateStep (model)) {
                this.removeClass ('disabled');
            } else {
                this.addClass ('disabled');
            }
        }.observes ('@each').on ('change'),
        
        isSending: function (model) {
            if (model.get ('sending')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }
        .observes ('sending'). on ('change'),
        
        notSending: function (model) {
//            if (!model.get ('sending')) {
//                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
//            } else {
//                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
//            }
        }.observes ('sending').on ('change'),
        
        routeToNextStep: function (model) {
            var currentStep;
            
            currentStep = model.get ('state.step');

            if (currentStep === 1) {
                np.routeTo ('#/checkout/address');
            } else if (currentStep === 2) {
                np.routeTo ('#/checkout/payment');
            } else if (currentStep === 4) {
                np.routeTo ('#/checkout/verification');
            }
        },
        
        setDeliveryCosts: function (model) {
            var gross;
            
            if (this.attr ('id') === 'totalDelivery') {
                gross   = getDeliveryCosts ();
                gross   = accounting.formatMoney (gross, '', 2, '.', ',');
                
                return gross+' &euro;';
            }
        }.observes ('dGateways').on ('change'),
        
        setCODCosts: function (model) {
            var gross;
            
            if (this.attr ('id') === 'totalCOD') {
                gross   = getCODCosts ();
                gross   = accounting.formatMoney (gross, '', 2, '.', ',');
                
                return gross+' &euro;';
            }
        }.observes ('dGateways').on ('change'),
        
        setTotalCosts: function (model) {
            var total;
            
            if (this.attr ('id') === 'totalCosts') {
                total   = Math.round ((np.Cart.getTotal ().total + getDeliveryCosts () + getCODCosts ())*100)/100;
                total   = accounting.formatMoney (total, '', 2, '.', ',');
                
                return total+' &euro;';
            }
        }.observes ('dGateways').on ('change'),
        
        hasCODCosts: function (model) {
            var price;

            price       = getCODCosts ();
            
            if (price > 0) {
                if (this.hasClass ('no-display'))   { this.removeClass ('no-display');  }
            } else {
                if (!this.hasClass ('no-display'))  { this.addClass ('no-display');     }
            }
        },
        
        validCart: function (model) {
            var filledCart;
            
            if ($('#checkoutVerification').length > 0) {
                filledCart  = !np.Cart.empty ();
                
                if (filledCart || model.get ('success')) {
                    if ($(this).hasClass ('no-display'))    { $(this).removeClass ('no-display');   }
                } else {
                    if (!$(this).hasClass ('no-display'))   { $(this).addClass ('no-display');      }
                }
            }
        }.observes ('@each').on ('change'),
        
        emptyCart: function (model) {
            var filledCart, confirmed;
            
            if ($('#checkoutVerification').length > 0) {
                filledCart  = !np.Cart.empty ();
                confirmed   = model.get ('confirmed');
                
                if (!filledCart && !model.get ('success') && !confirmed) {
                    if ($(this).hasClass ('no-display'))    { $(this).removeClass ('no-display');   }
                } else {
                    if (!$(this).hasClass ('no-display'))   { $(this).addClass ('no-display');      }
                }
            }
        }.observes ('@each').on ('change'),
        
        /* DEPRECATED - remove */
        redirect: function (model) {}.observes ('redirect').on ('change'),
        
        confirmed: function (model) {
            if (model.get ('confirmed')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('confirmed').on ('change'),
        
        notConfirmed: function (model) {
            if (!model.get ('confirmed')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('confirmed').on ('change')
    };
}()));