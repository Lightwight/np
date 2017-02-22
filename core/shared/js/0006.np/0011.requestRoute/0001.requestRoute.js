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

np.module ('requestRoute', function (options) {
    var defaults, type, route, need_defaults, route, 
        subroute, parts, promise;

    promise     = np.Promise();
    defaults    = {type: 'json', route: '/', defaults: false};
    options     = $.extend (defaults, options);

    type            = options.type;
    route           = options.route;
    need_defaults   = options.defaults;

    subroute    = (function () {
        var i, result;

        result  = {};

        for (i in parts) { if (i > 1) { result[(i-2)] = parts[i]; } }

        return result;
    }());

    if (type === 'json') {
        np.ajax ({
            beforeSend: function(xhr) {
                xhr.setRequestHeader ('Content-type', 'application/json');
            },            
            dataType:   'json',
            url:        '/',
            data:       (function () {
                var data        = {};

                data['route']   = route;

                if (need_defaults)  { data['defaults'] = 1; }

                return data;
            }())
        })
        .then (function (rsp)       {
            promise.then (rsp.data);  
        })
        .fail (function (errData)   { 
            promise.fail (errData);   
        });
    } else {
        window.location.href = route;
    }

    return promise;
});