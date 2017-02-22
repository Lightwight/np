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

np.controller.extend ('CheckoutDeliveryController', {
    view:   'CheckoutDeliveryView',
    model:  function () {
        this.sendingDHL             = false;
        this.errorDHL               = false;
        this.successDHL             = false;
        
        this.sendingUPS             = false;
        this.errorUPS               = false;
        this.successUPS             = false;
        
        this.sendingHermes          = false;
        this.errorHermes            = false;
        this.successHermes          = false;

        return this;  
    },
    
    events: {
        deliveryDHL: function () {
            var _this;
            
            _this   = this;

            _this.set ('delivery.gateway', 'dhl');

            _this.set ('sendingDHL', true);
            _this.set ('sending', true);

            np.checkout.setOrder ('delivery', 'gateway', 'dhl');

            np.checkout.saveDelivery ()
            .then (function (response) {
                _this.set ('sending', false);
                _this.set ('sendingDHL', false);
            })
            .fail (function () {
                np.checkout.setOrder ('delivery', 'gateway', '');
        
                _this.set ('sending', false);
                _this.set ('delivery.gateway', '');
                _this.set ('errorDHL', true);
                _this.set ('sendingDHL', false);
            });
        },
        
        deliveryUPS: function () {
            var _this;
            
            _this   = this;
            
            _this.set ('delivery.gateway', 'ups');
            _this.set ('sendingUPS', true);
            _this.set ('sending', true);
            
            np.checkout.setOrder ('delivery', 'gateway', 'ups');

            np.checkout.saveDelivery ()
            .then (function (response) {
                _this.set ('sending', false);
                _this.set ('sendingUPS', false);
            })
            .fail (function () {
                np.checkout.setOrder ('delivery', 'gateway', '');
        
                _this.set ('sending', false);
                _this.set ('delivery.gateway', '');
                _this.set ('errorUPS', true);
                _this.set ('sendingUPS', false);
            });            
        },
                
        deliveryHermes: function () {
            var _this;
            
            _this   = this;
            
            _this.set ('delivery.gateway', 'hermes');
            _this.set ('sendingHermes', true);
            _this.set ('sending', true);
            
            np.checkout.setOrder ('delivery', 'gateway', 'hermes');

            np.checkout.saveDelivery ()
            .then (function (response) {
                _this.set ('sending', false);
                _this.set ('sendingHermes', false);
            })
            .fail (function () {
                np.checkout.setOrder ('delivery', 'gateway', '');
        
                _this.set ('sending', false);
                _this.set ('delivery.gateway', '');
                _this.set ('errorHermes', true);
                _this.set ('sendingHermes', false);
            });             
        },
        
        closeInfo: function () {
//            this.set ('redirect', '');
        }
    }
});