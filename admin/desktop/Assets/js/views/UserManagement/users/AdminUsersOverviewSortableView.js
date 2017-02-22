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

np.view.extend ('AdminUsersOverviewSortableView', {
    setOrderID: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByID');

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
    }.observes ('sortByID').on ('change'),

    setOrderRole: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByRole');

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
    }.observes ('sortByRole').on ('change'),

    setOrderGender: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByGender');

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
    }.observes ('sortByGender').on ('change'),

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

    setOrderPrename: function (model) {
        var sortOrder;
        
        sortOrder   = model.get ('sortByPrename');

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
    }.observes ('sortByPrename').on ('change'),

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