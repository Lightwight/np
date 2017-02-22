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

np.view.extend ('AdminShopOrdersOverviewSortableView', {
    didInsert: function () {
        $('#admin-order-overview-filter select').niceSelect ();
    },

    setFilter: function (model) {
        var opt;
        
        opt = parseInt (model.get ('filter'), 10);
        
        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === opt) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });
    },
    
    setOrderID: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByOrderID');

        if (sortOrder === 'none') {
            this.removeClass ('sort-asc');
            this.removeClass ('sort-desc');
        } else if (sortOrder === 'asc') {
            this.removeClass ('sort-desc');
            this.addClass ('sort-asc');
        } else {
            this.removeClass ('sort-asc');
            this.addClass ('sort-desc');
        }
    }.observes ('sortByOrderID').on ('change'),

    setOrderName: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByName');

        if (sortOrder === 'none') {
            this.removeClass ('sort-asc');
            this.removeClass ('sort-desc');
        } else if (sortOrder === 'asc') {
            this.removeClass ('sort-desc');
            this.addClass ('sort-asc');
        } else {
            this.removeClass ('sort-asc');
            this.addClass ('sort-desc');
        }
    }.observes ('sortByName').on ('change'),

    setOrderMail: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByMail');

        if (sortOrder === 'none') {
            this.removeClass ('sort-asc');
            this.removeClass ('sort-desc');
        } else if (sortOrder === 'asc') {
            this.removeClass ('sort-desc');
            this.addClass ('sort-asc');
        } else {
            this.removeClass ('sort-asc');
            this.addClass ('sort-desc');
        }
    }.observes ('sortByMail').on ('change')
});