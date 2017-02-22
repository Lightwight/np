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

np.controller.extend ('CheckoutOverviewController', {
    view:   'CheckoutOverviewView',
    model:  function () {
        var user, validUser, validAdress, validPayment, validDelivery, all;
        
        user            = np.auth.user ('user');
        
        validUser       = np.checkout.validUser ();
        validAdress     = np.checkout.validBilling () && np.checkout.validShipping ();
        validPayment    = np.checkout.validPayment ();
        validDelivery   = np.checkout.validDelivery ();
        all             = validUser && validAdress && validPayment && validDelivery;
        
        return {CheckoutOverview: {id: -1, user: user, valid: { all: all, user: validUser, adress: validAdress, payment: validPayment, delivery: validDelivery}}};
    }
});