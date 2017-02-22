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

np.plugin.extend ('seo', (function () {
    var storage;
    
    storage = {};
    
    return {
        setup: function (seoData) { 
            storage = np.jsonClone (seoData);  
        },
        
        getModels: function () {
            var models, i;
            
            models  = new Array ();
            
            if (typeof storage.seo.models !== 'undefined') {
                for (i in storage.seo.models) {
                    models.push ({'name': i});
                }
            }
            
            return models;
        },
        
        getColumnsByModel: function (model) {
            return storage.seo.models[model] !== 'undefined' ? storage.seo.models[model] : new Array ();
        },
        
        getBookmarks: function () {
            return typeof storage.seo.bookmarks !== 'undefined' ? storage.seo.bookmarks : false;
        },
        
        getBookmarkOfRoute: function (route_id) {
            var bookmarks, bookmark,
                i, l;
            
            if (typeof storage.seo.bookmarks !== 'udnefined') {
                bookmarks   = np.jsonClone (storage.seo.bookmarks);
                l           = bookmarks.length;
                
                for (i=0; i<l; i++) {
                    bookmark    = bookmarks[i];
                    
                    if (parseInt (bookmark.route_id, 10) === parseInt (route_id)) {
                        return bookmark;
                    }
                }
            }
            
            return false;
        },
        
        getSelection: function (route_id) {
            var bookmarks,
                i, l;
            
            bookmarks   = typeof storage.seo.bookmarks !== 'undefined' ? storage.seo.bookmarks : new Array ();
            l           = bookmarks.length;

            for (i=0; i<l; i++) {
                if (parseInt (bookmarks[i].route_id, 10) === parseInt (route_id, 10)) {
                    return {model: bookmarks[i].model, column: bookmarks[i].bookmark_column};
                }
            }
            
            return {model: false, column: false};
        },

        saveRoute: function (route) {
            var promise, request;

            promise         = np.Promise();

            request = {
                seo: {
                    save: { 
                        route:  route
                    }
                },
                type:   'seo'
            };
       
            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });     
            
            return promise;          
        },

        exportRobots: function () {
            var promise, request;

            promise         = np.Promise();

            request = {
                seo: {
                    export: { 
                        robots:  true
                    }
                },
                type:   'seo'
            };

            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });            

            return promise;
        },

        exportSitemap: function () {
            var promise, request;

            promise         = np.Promise();

            request = {
                seo: {
                    export: { 
                        sitemap:  true
                    }
                },
                type:   'seo'
            };

            np.ajax({
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                promise.then (rsp);
            }).fail (function (error) {
                promise.fail ();
            });            

            return promise;
        }
    };
}()));
