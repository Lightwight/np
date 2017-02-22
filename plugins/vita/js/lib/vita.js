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

np.plugin.extend ('vita', (function () {
    var storage;
    
    storage = { 
        enabled:        false,
        main_type:      '',
        main_src:       '',
        main_title:     '',
        main_content:   '',
        vitas:          new Array ()    
    };
    
    return {
        setup: {
            page_content:   function (data) {
                var response;
                
                if (typeof data === 'object') {
                    response                = data.content;         
                    
                    storage.enabled         = data.plugin_enabled;
                    storage.main_type       = response.main_type;
                    storage.main_src        = response.main_src;
                    storage.main_title      = response.main_title;
                    storage.main_content    = response.main_content;
                    storage.vitas           = response.vitas;
                }
            }
        },    
        
        getVita: function () {
            return storage;
        },
        
        addVita: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                vita:   {add: {vita: data}},
                type:   'vita'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp);
            }).fail (function (rsp) {
                promise.fail (rsp.error);
            });             

            return promise;
        },

        saveVita: function (data) {
            var request, promise;

            promise     = np.Promise ();

            request = {
                vita:   {
                    update: {
                        route_id:       data.route_id,
                        main_type:      data.main_type,
                        main_src:       data.main_src,
                        main_title:     data.main_title,
                        main_content:   data.main_content,
                        vitas:          data.vitas
                    }
                },
                type:   'vita'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp);
            }).fail (function (rsp) {
                promise.fail (rsp.error);
            });             

            return promise;
        },

        deleteVita: function (route_id, vita_id) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                vita:   {del: {vita: {route_id: route_id, vita_id: vita_id}}},
                type:   'vita'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp);
            }).fail (function (rsp) {
                promise.fail (rsp.error);
            });             

            return promise;        
        }
    };
})());