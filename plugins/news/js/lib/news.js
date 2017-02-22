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


np.plugin.extend ('news', (function () {
    var storage;
    
    storage = { news: new Array ()    };
    
    return {
        setup: {
            page_content:   function (data) {
                if (typeof data === 'object' && $.isArray (data.content) && data.content.length > 0) {
                    storage.news  =  data.content;
                }
            }
        },    
        
        getNews: function () {
            return storage.news;
        },
        
        addNews: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                news:   {add: {news: data}},
                type:   'news'
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

        saveNews: function (data) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                news:   {update: {route_id: data.route_id, news: data.news}},
                type:   'news'
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

        deleteNews: function (route_id, news_id) {
            var request, promise, data;

            promise     = np.Promise ();

            request = {
                news:   {del: {news: {route_id: route_id, news_id: news_id}}},
                type:   'news'
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