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

np.module ('hook', (function () {
    var hooks;
    
    hooks   = {
        route:          {},
        beforeRoute:    {},
        afterRoute:     {},

        resize:         {}
    };
    
    return function (name, hook, fnc) {
        var validName, validHook, validFnc, validParams,
            callHook,
            i;
        
        validName   = typeof name === 'string' && !name.empty ();
        validHook   = typeof hook === 'string' && typeof hooks[hook] !== 'undefined' && typeof hooks[hook][name] === 'undefined';
        validFnc    = typeof fnc === 'function';
        
        validParams = validName && validHook && validFnc;
        callHook    = validName  && typeof hooks[name] !== 'undefined' ? hooks[name] : false;
        
        if (validParams) {
            hooks[hook][name]   = fnc;
        } else if (callHook) {
            for (i in callHook) {
                if (typeof callHook[i] === 'function') { callHook[i] (hook); }
            }
        } else {
            /* TODO: warn */
        }
    };
}()));