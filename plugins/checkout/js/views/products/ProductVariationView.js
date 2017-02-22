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

np.view.extend ('ProductVariationView', (function () {
    function resetSelectBox (model, picker) {
        picker.selectpicker ('val', model.get ('label'));
    }
    
    return {
        setVariation: function (model) {
            var options, option, node, available, key,
                i, l;

            options = model.get ('options');
            l       = options.length;

            for (i=0; i<l; i++) {
                option      = options[i];

                key         = option.KeyEigenschaft+'-'+option.KeyEigenschaftWert;
                available   = option.available;
                node        = this.find ('option[value="'+key+'"]');

                if (node.length > 0) {
                    if (!available) {
                        node.attr ('disabled', true);   
                        node.data ('subtext', 'ausverkauft');
                    } else { 
                        if (node.attr ('disabled')) { node.prop ('disabled', false);      }
                        node.data ('subtext', '');
                    }
                }
            }
            
            this.selectpicker ('refresh');
            
            resetSelectBox (model, this);
        }.observes ('options').on ('change')
    };
}()));