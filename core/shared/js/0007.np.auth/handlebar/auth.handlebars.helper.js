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

Handlebars.registerHelper ('auth', function (options) {
    var user, hash, loggedIn, group,
        authLoggedIn, authGroup,
        proceed;
    
    user            = np.auth.user ('user');
    proceed         = true;
    
    hash            = typeof options !== 'undefined' && typeof options.hash !== 'undefined' ? options.hash : false;
    loggedIn        = hash && typeof hash.loggedIn === 'boolean' ? options.hash.loggedIn : null;
    group           = hash && typeof hash.group === 'number' ? options.hash.group : null;
    
    authLoggedIn    = loggedIn !== null ? user.loggedIn : null;
    authGroup       = group !== null ? parseInt (user.group, 10) : null;

    if (loggedIn !== null && authLoggedIn !== loggedIn) { proceed = false;  }
    if (group !== null && authGroup > group)            { proceed = false;  }

    return proceed ? options.fn (this) : options.inverse (this);
});
