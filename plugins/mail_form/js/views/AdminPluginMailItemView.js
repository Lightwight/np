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

np.view.extend ('AdminPluginMailItemView', {
    didInsert: function () {
        this ().find ('.admin-plugin-mail-type-select').niceSelect ();
    },

    setInitialType: function (model) {
        this.find ('option:nth-child('+(model.get ('type')+1)+')').prop ('selected', true);
        this.niceSelect ('update');
    },

    showValueEditor: function (model) {
        if (model.get ('type') > 1) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
    }.observes ('type').on ('change'),

    showError: function (model) {
        var title, message, buttons;
        
        if (model.get ('errorDeleted')) {
            title       = 'Ups!';

            message     = 'Das Feld konnte nicht gelöscht werden.<br><br>';
            message    += 'Bitte überprüfen Sie Ihre Internetverbindung und wiedeholen Sie den Vorgang.<br><br>';
            message    += 'Sollte der Fehler erneut auftauchen, dann setzen Sie sich bitte mit Ihrem Systemadministrator in Verbindung.';

            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
            );

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons
            });
        }
    }.observes ('errorDeleted').on ('change'),
    
    enableFieldUp: function (model) {
        var order;
        
        order   = model.get ('order');
        
        if (order === 1) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('order').on ('change'),

    enableFieldDown: function (model) {
        var len, order;

        len     = $('#admin-plugin-mail-sortarea .admin-plugin-mail-edit').length;
        order   = model.get ('order');

        if (order === len) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('order').on ('change'),

    changedOrder: function (model) {
        var position, order;
        
        position    = this.index () + 1;
        order       = model.get ('order');

        if (position !== order) {
            np.observable.update ('AdminPluginMailItem', model.get ('id'), 'order', position);
        }
    }.observes ('changed_order').on ('change'),
    
    orderChanged: function (model) {
        var _t, container, position, order, len;
        
        container   = this.parents ('*:first');
        position    = this.index () + 1;
        order       = model.get ('order');
        len         = this.parents ('*:first').find ('.admin-plugin-mail-edit').length;
        _t          = this;
        
        if (position !== order) {
            this.addClass ('fadeOut');
            window.setTimeout (function () { _t.removeClass ('fadeOut');},450);

            if (position > order) {
                this.insertBefore (container.find ('.admin-plugin-mail-edit:eq('+(order-1)+')'));
            } else {
                this.insertAfter (container.find ('.admin-plugin-mail-edit:eq('+(order-1)+')'));
            }
        }
    }.observes ('order').on ('change'),
    
    errorDeleted: function (model) {
        var title, message, buttons;

        if (model.get ('successDeleted') === true) {
            this.remove ();
        } else {
            title       = 'Ups!';

            message     = 'Der Eintrag konnte nicht gelöscht werden.<br><br>';
            message    += 'Bitte überprüfen Sie Ihre Internetverbindung und wiedeholen Sie den Vorgang.<br><br>';
            message    += 'Sollte der Fehler erneut auftauchen, dann setzen Sie sich bitte mit Ihrem Systemadministrator in Verbindung.';

            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
            );

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons
            });            
        }
    }.observes ('successDeleted').on ('change'),
    
    remove: function (model) {
        if (model.get ('removed')) {
            this.remove ();
        }
    }.observes ('removed').on ('change'),
    
    deleting: function (model) {
        if (model.get ('deleting')) {
            this.addClass ('fadeIn');
        } else {
            this.removeClass ('fadeIn');
        }
    }.observes ('deleting').on ('change')
});