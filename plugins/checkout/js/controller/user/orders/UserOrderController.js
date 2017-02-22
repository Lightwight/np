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

np.controller.extend ('UserOrderController', (function () {
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
        view:   'UserOrderView',
        model:  function () {
            var _t;

            _t                  = this;
            _t.order_status     = mapOrderStatus (_t);
            _t.show_articles    = false;
            _t.total            = parseFloat (_t.total).toFixed (2);
            _t.price_total      = parseFloat (_t.price_total).toFixed (2);
            _t.delivery_costs   = parseFloat (_t.delivery_costs).toFixed (2);
            
            return {UserOrder: _t};
        },
        
        events: {
            showArticles: function () {
                this.set ('show_articles', !this.get ('show_articles'));
            }
        }
    };
})());