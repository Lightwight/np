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

np.plugin.extend ('simple_offers', (function () {
    var storage;
    
    storage = { offers: new Array ()    };
    
    return {
        setup: {
            page_content:   function (data) {
                if (typeof data === 'object' && $.isArray (data.content) && data.content.length > 0) {
                    storage.offers  =  data.content;
                }
            }
        },    
        
        getOffers: function () {
            return storage.offers;
        },
        
        addOffer: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                simple_offers:  {add: {offer: data}},
                type:           'simple_offers'
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

        saveOffers: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                simple_offers:  {update: {route_id: data.route_id, offers: data.offers}},
                type:           'simple_offers'
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

        deleteOffer: function (route_id, offer_id) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                simple_offers:  {del: {offer: {route_id: route_id, offer_id: offer_id}}},
                type:           'simple_offers'
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