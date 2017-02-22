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

/*!
 * np JavaScript Module-Pattern v0.0.0
 * http://np.com/
 *
 * Includes jQuery.js, bootstrap.js, qunit
 * 
 * http://jquery.com
 * http://getbootstrap.com/
 * http://api.qunitjs.com/
 *
 * Copyright 2014, cp Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://np.org/license
 *
 * Date: 2014-10-25T14:07Z
 */

/*
 * jsLint Directives: */
/* jslint nomen: true, plusplus: true, todo: true, white: true, indent: 4 */

/*
 * TDD/BDD - with QUnitjs/Cucumber
 * 
 * np-code-quality-pipe:
 * 
 * 1) Create the Tests (keep it atomic)
 * 2) Run the Tests and let them fail
 * 3) Create the Prototype-Code
 * 4) Run the Tests and let them pass
 * 5) Refactor the Prototype (3)
 * 6) Run the Tests again and let them pass
 * 7) Syntax check with jsLint
 * 8) if (7) failed fix it and go to step (6), otherwhise compress np.
 * 9) Done!.
 * 
 */

(function (window) {
    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains.
    // Support: Firefox 18+
    // TODO: Remove 'use strict' after jsLint-test:
    'use strict';

    // NP
    (function (np) {

        // Module creator:
        np.VERSION  = '0.0.0';
        np.length   = 1;
        
        np.debug    = false;
        
        np.module   = function (namespace, options) {
            var ns, parent, l, i, is_undef;
if (namespace === 'static') {
    console.log ('d');
}
            parent  = np;
            ns      = namespace.split('.');
            l       = ns.length;

            for (i = 0; i < l; i++) {
                is_undef        = typeof parent[ns[i]] === 'undefined';
                parent.length   = parent.length || 0;
                
                if (is_undef) {
                    parent[ns[i]]   = (i < l - 1) ? {} : options;

                    parent.length++;
                }

                parent      = parent[ns[i]];
            }
        };

        window.np   = np;
    }(window.np || {}));
}(window));