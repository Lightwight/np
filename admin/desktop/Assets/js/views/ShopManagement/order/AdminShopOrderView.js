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

np.view.extend ('AdminShopOrderView', {
    setConfirmed: function (model) {
        if (model.get ('is_confirmed')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_confirmed').on ('change'),
    
    setProcessing: function (model) {
        if (model.get ('is_processing')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_processing').on ('change'),
    
    setDelivered: function (model) {
        if (model.get ('is_delivered')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_delivered').on ('change'),
    
    setPaid: function (model) {
        if (model.get ('is_paid')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_paid').on ('change'),
    
    setDone: function (model) {
        if (model.get ('is_done')) {
            this.prop ('checked', 'checked');
        } else {
            this.prop ('checked', '');
        }
    }.observes ('is_done').on ('change'),
    
    disableSaveOrderState: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),
    
    savingAdminOrderStates: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change')
});