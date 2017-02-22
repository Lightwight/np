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

np.view.extend ('AdminPluginMailValueView', {
    remove: function (model) {
        if (model.get ('removed')) {
            this.remove ();
        }
    }.observes ('removed').on ('change'),
    
    changedOrder: function (model) {
        var position, order;
        
        position    = this.index () + 1;
        order       = parseInt (model.get ('order'), 10);

        if (position !== order) {
            np.observable.update ('AdminPluginMailValue', model.get ('id'), 'order', position);
        }
    }.observes ('changed_order').on ('change'),
    
    orderChanged: function (model) {
        var _t, container, position, order, len;
        
        container   = this.parents ('*:first');
        position    = this.index () + 1;
        order       = model.get ('order');
        len         = this.parents ('*:first').find ('.new-value-view').length;
        _t          = this;

        if (position !== order) {
            

            this.addClass ('fadeOut');
            window.setTimeout (function () { _t.removeClass ('fadeOut');},450);

            if (position > order) {
                this.insertBefore (container.find ('.new-value-view:eq('+(order-1)+')'));
            } else {
                this.insertAfter (container.find ('.new-value-view:eq('+(order-1)+')'));
            }
        }
    }.observes ('order').on ('change'),
    
    initOrder: function (model) {
        var handle, container, position, order, len;
        
        handle      = this.parents ('.new-value-view:first');
        container   = this.parents ('.value-container:first');
        position    = handle.index () + 1;
        order       = model.get ('order');
        len         = container.find ('.new-value-view').length;
        
        if (position !== order) {
            if (position > order) {
                handle.insertBefore (container.find ('.new-value-view:eq('+(order-1)+')'));
            } else {
                handle.insertAfter (container.find ('.new-value-view:eq('+(order-1)+')'));
            }
        }
    }
});