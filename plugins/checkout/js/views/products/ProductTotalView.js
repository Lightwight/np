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

np.view.extend ('ProductTotalView', {
    setAmount: function (model, src) {
        if (src.name==='selectedVariations') {
            np.observable.update ('Product', model.get ('id'), 'amount', 1);
        } else {
            return 'x ' + model.get ('amount');
        }
    }
    .observes ('selectedVariations').on ('change')
    .observes ('amount').on ('change'),
    
    setGross: function (model) {
        var gross;

        gross   = np.Product.getGross (model.getAll ());
        gross   = accounting.formatMoney (gross, '', 2, '.', ',');
        
        return gross+' &euro;';
    }
    .observes ('selectedVariations').on ('change')      
    .observes ('amount').on ('change'),
    
    setTotal: function (model) {
        var gross;

        gross   = np.Product.getTotal (model.getAll (), model.get ('amount'));
        gross   = accounting.formatMoney (gross, '', 2, '.', ',');
        
        return gross+' &euro;';
    }
    .observes ('selectedVariations').on ('change')
    .observes ('amount').on ('change')
});