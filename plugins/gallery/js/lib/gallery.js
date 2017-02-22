/* 
 * Copyright (C) 2015 cross
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

np.plugin.extend ('gallery', (function () {
    var storage;
    
    storage = { galleries: new Array ()    };
    
    return {
        setup: {
            page_content:   function (data) {
                if (typeof data === 'object' && $.isArray (data.content) && data.content.length > 0) {
                    storage.galleries   =  data.content;
                }
            }
        },    
        
        getGallery: function () {
            return storage.galleries;
        },
        
        addGallery: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                gallery:        {add: {gallery: data}},
                type:           'gallery'
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

        saveGallery: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                gallery:        {update: {route_id: data.route_id, galleries: data.galleries}},
                type:           'gallery'
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

        deleteGallery: function (route_id, gallery_id) {
            var request, promise;

            promise     = np.Promise ();

            request = {
                gallery:    {del: {gallery: {route_id: route_id, gallery_id: gallery_id}}},
                type:       'gallery'
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