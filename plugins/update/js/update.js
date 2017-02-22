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

np.plugin.extend ('update', (function () {
    return {
        checkForUpdate: function () {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                update:  {checkForUpdate: true},
                type:   'update'
            };

            np.ajax(
            {
                type:           'GET',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                var new_version, updateable;
                
                new_version = typeof rsp.data !== 'undefined' && typeof rsp.data.new_version !== 'undefined' ? rsp.data.new_version : false;
                updateable  = typeof rsp.data !== 'undefined' && typeof rsp.data.updateable !== 'undefined' ? parseInt (rsp.data.updateable, 10) : 0;

                promise.then ({new_version: new_version, updateable: updateable});
            }).fail (function (rsp) {
                promise.fail (rsp.error);
            });             

            return promise;            
        },
        
        update: function () {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                update:  {update: true},
                type:   'update'
            };

            np.ajax(
            {
                type:           'GET',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                console.log (rsp);
                promise.then ();
            }).fail (function (rsp) {
                promise.fail (rsp.error);
            });             

            return promise;
        }
    };
})());