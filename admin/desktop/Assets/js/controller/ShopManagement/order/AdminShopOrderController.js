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

np.controller.extend ('AdminShopOrderController', (function () {
    var currentOrder;
    
    function getID ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    function mapOrderStatus (_t) {
        if (parseInt (_t.delivered, 10) === 1) {
            return {
                css:    'green',
                state:  'Versendet'
            };
        } else {
            return {
                css:    'yellow',
                state:  'In Bearbeitung'
            };
        }
    }

    return {
        view:   'AdminShopOrderView',
        model:  function () {
            var order;
            
            order   = {};
            
            np.model.User_orders.findByID (getID ()).each (function (row) {
                currentOrder    = row;
                order           = row.getAll ();
            });
            
            order.order_status      = mapOrderStatus (order);
            order.total             = parseFloat (order.total).toFixed (2);
            order.price_total       = parseFloat (order.price_total).toFixed (2);
            order.delivery_costs    = parseFloat (order.delivery_costs).toFixed (2);            
            
            order.is_confirmed      = parseInt (order.confirmed, 10) === 1;
            order.is_processing     = parseInt (order.processing, 10) === 1;
            order.is_delivered      = parseInt (order.delivered, 10) === 1;
            order.is_paid           = parseInt (order.paid, 10) === 1;
            order.is_done           = parseInt (order.done, 10) === 1;
            
            order.sending           = false;
            order.success           = false;

            return {AdminShopOrder: order};
        },
        
        events: {
            saveOrderState: function (view) {
                var _t,
                    is_processing, is_delivered, is_paid, is_done;
                
                _t              = this;
                
                is_processing   = _t.get ('is_processing');
                is_delivered    = _t.get ('is_delivered');
                is_paid         = _t.get ('is_paid');
                is_done         = _t.get ('is_done');
                
                currentOrder.setProcessing (is_processing ? 1 : 0);
                currentOrder.setDelivered (is_delivered ? 1 : 0);
                currentOrder.setPaid (is_paid ? 1 : 0);
                currentOrder.setDone (is_done ? 1 : 0);
                
                _t.set ('sending', true);
                
                np.model.User_orders
                .save ()
                .then (function () {
                    _t.set ('sending', false);    
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                });
            },
    
            toggleProcessing: function (view) {
                this.set ('is_processing', !this.get ('is_processing'));
            },
            
            toggleDelivered: function (view) {
                this.set ('is_delivered', !this.get ('is_delivered'));
            },
            
            togglePaid: function (view) {
                this.set ('is_paid', !this.get ('is_paid'));
            },
            
            toggleDone: function (view) {
                this.set ('is_done', !this.get ('is_done'));
            }
        }
    };
})());