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

np.controller.extend ('ProductVariationController', {
    view:    'ProductVariationView',
    model:   function () {
        var _this, id, key, label, options;
        
        _this   = this;
        id      = _this.id;
        key     = _this.key;
        label   = _this.label;
        options = (function () {
           var opts, i;
           
           opts = new Array ();
           
           for (i in _this) {
               if (typeof _this[i] === 'object') {
                   opts.push (_this[i]);
               }
           }
           
           return opts;
        }());

        return {
            ProductVariation: {
                id:         id, 
                key:        key, 
                label:      label, 
                options:    options
            }
        };
    },
   
    events: {
        setVariation: function (view) {
            var _ctx, _selected, picker, key;
            
            _ctx        = view.parent ().context ();
            _selected   = new Array ();
            picker      = view.getNode ().find ('select.selectpicker');
            key         = picker.selectpicker ('val');

            if (typeof key === 'string' && key.length > 0 
                && _selected.indexOf (key) === -1
            ) {
                _selected.push (key);
            }

            _ctx.set ('selectedVariations', _selected);      
        }
    }
});