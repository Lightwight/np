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

np.module('warn', function (warnData, doTrace) {
    var exists, err_exists, do_trace, err_method, stack, err_stack;

    do_trace    = (typeof doTrace === 'boolean')? doTrace : false;
    err_exists  = typeof window.console !== 'undefined' && typeof window.console.error !== 'undefined';
    exists      = typeof window.console !== 'undefined' && typeof window.console.warn !== 'undefined';

    if (exists && np.debug) { 
        if (!do_trace)  { window.console.warn(warnData);    }
        else            { np.info (warnData);               }
        
        if (do_trace && err_exists) {
            try {
                err_method  = (function (w) {
                    var m, i;
                    
                    i   = 0;
                    m   = w['errorTrace'+i];
                    
                    while (typeof m === 'function') {
                        m   = w['errorTrace'+i];
                        i++;
                    }
                    
                    return m;
                }(window));
                
                // Do the stack trace triggered by not existing method: error_method ():
                error_method ();
            } catch (e) {
                err_stack       = e.stack.split ('@').reverse ();

                np.info ('------------------------------------------------------');
                
                for (stack=0; stack<err_stack.length; stack++) {
                    if (err_stack[stack] !== '') {
                        np.info (err_stack[stack]);
                    }
                }
            }
        }
    }

    return warnData;
});
