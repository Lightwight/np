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

np.module ('plugin', (function () {
    return {
        extend: function (pluginName, options) {
            np.module (pluginName, options);
        },
        
        manip: function (plugin, selector) {
            if (!(this instanceof np.plugin.manip)) { return new np.plugin.manip (plugin, selector); }
            
            return {
                get: function (binding) {
                    var _selector, _binding, _hBinding;
                    
                    _hBinding   = binding.slice (0, 1).toUpperCase ()+binding.slice (1);
                    _selector   = selector.length > 0 ? selector : false;
                    _binding    = typeof plugin.events !== 'unfedined' && typeof plugin.events['get'+_hBinding] !== 'undefined' ? plugin.events['get'+_hBinding] : false;
                    
                    if (_selector && _binding) {
                        if (typeof _binding === 'function') {
                            return _binding (selector);
                        } else {
                            return _binding;
                        }
                    } else {
                        return '';
                    }                
                }
            };
        }
    };
}()));