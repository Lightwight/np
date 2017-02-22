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

np.view.extend ('ProductListVariationsView', {
    didInsert: function (model) {
        var selected, selID, pickerID, needed, select,
            i, j, k, l, m;
        
        select      = this ('.selectpicker').selectpicker ({size: 'auto', dropupAuto: false, showIcon: false, mobile: true});
        
        selected    = model.selectedVariations;
        needed      = model.neededVariations;

        j           = selected.length;
        
        for (i=0; i<j; i++) {
            selID   = selected[i];

            for (k in needed) {
                m   = needed[k].items.length;

                for (l=0; l<m; l++) {
                    if (needed[k].items[l] === selID && np.Product.variationAvailable (model, selID)) {
                        pickerID    = needed[k].key;
                        this ('[data-variation="'+pickerID+'"] .selectpicker').selectpicker ('val', selID);

                        break;
                    }
                }
            }
        }
    },
    
    resetVariation: function (model) {
        if (model.get ('selectedVariations').length === 0) {
            var _default;

            _default    = this.find ('> .variations .selectpicker option[data-hidden="true"]').html ();

            this.find ('> .variations .selectpicker').selectpicker ('val', _default);            
        }
    }.observes ('selectedVariations').on ('change')
});