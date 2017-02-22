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

np.controller.extend ('AdminArticleSupplierController', (function () {
    var currentSupplier;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminArticleSupplierView',
        model:  function () {
            var supplier;
            
            np.model.Article_suppliers.findBySupplierId (getPage ()).each (function (row) {
                currentSupplier     = row;
                supplier            = row.getAll ();
            });
            
            supplier.sending        = false;
            supplier.success        = false;
            
            return {AdminArticleSupplier: supplier};
        },
        
        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },
            
            setCountry: function (view) {
                this.set ('country', view.get ('geo'));
            },
            
            setCity: function (view) {
                this.set ('city', view.get ('city'));
            },
            
            setPostal: function (view) {
                this.set ('postal', view.get ('postal'));
            },
            
            setStreet: function (view) {
                this.set ('street', view.get ('street'));
            },
            
            setStreetNumber: function (view) {
                this.set ('street_number', view.get ('street_number'));
            },
            
            saveSupplier: function () {
                var _t;
                
                _t  = this;

                currentSupplier.setName (_t.get ('name'));
                currentSupplier.setCountry (_t.get ('country'));
                currentSupplier.setPostal (_t.get ('postal'));
                currentSupplier.setCity (_t.get ('city'));
                currentSupplier.setStreet (_t.get ('street'));
                currentSupplier.setStreetNumber (_t.get ('street_number'));
                
                _t.set ('sending', true);
                
                currentSupplier
                .save ()
                .then (function () {
                    _t.set ('sending', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                });                
            }
        }
    };
})());