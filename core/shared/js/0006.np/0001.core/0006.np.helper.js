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

// Clone JSON-Object:
np.module  ('jsonClone', function (json) { 
    var parsed;
    
    try         { parsed  = JSON.parse (JSON.stringify (json)); }
    catch (e)   { parsed  = {};                                 }
    
    return parsed; 
});

/*
 * Slugify Code snipped by mathewbyrne
 * 
 * A lot of thanks to methewbyrne who coded this code-snipped for the crowd
 * 
 * https://gist.github.com/mathewbyrne/1280286
 * 
 * please share and support him :)
*/
np.module ('slugify', function (text) {
  return typeof text === 'string' ? text.toString ().toLowerCase ()
    .replace (/\s+/g, '-')           // Replace spaces with -
    .replace (/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace (/\-\-+/g, '-')         // Replace multiple - with single -
    .replace (/^-+/, '')             // Trim - from start of text
    .replace (/-+$/, '')            // Trim - from end of text  
    .replace ('ü', 'ue')
    .replace ('ö', 'oe')
    .replace ('ä', 'ae')
    .replace ('ß', 'ss')
    : '';
});

np.module ('route', {
    getBookmarkItem: function (complete) {
        var path, parts, baseURL;
        
        complete    = typeof complete === 'boolean' ? complete : false;

        if ($.address.path () !== '/' && $.address.path () !== '') {
            path        = $.address.path ().slice (1)+'/';
            if (path.length === path.lastIndexOf ('/')+1) { path = path.slice (0, path.length-1);   }

            parts   = path.split ('/');

            if (!complete) {
                return parts.length > 0 ? parts[parts.length-1] : false;
            } else {
                return parts.length > 0 ? parts.join ('/') : false;
            }
        } else {
            baseURL     = $.address.baseURL ();
            parts       = baseURL.split ('//');
            
            if (typeof parts[1] !== 'undefined') {
                return parts[1].slice (parts[1].indexOf ('/')+1);
            }
        }
    },
    
    getBookmark: function () {
        return np.routeController.getBookmark ();
    },
    
    getRoute: function () {
        return np.routeController.getRoute ();
    },
    
    getResources: function () {
        return np.routeController.getResources ();
    }
});

np.module ('object', {
    empty: function (obj) {
        var i;
        
        for (i in obj) { return false;  }
        
        return true;
    }
});

// Create object-tree with default values 'false' and types. Then fill it with the given object values:
np.module ('createObject', function (defaults, options) {
    var _storage, _defaults;
    
    if (!(this instanceof np.createObject)) { return new np.createObject(defaults, options);   }
    
    _defaults   = np.jsonClone (defaults);
    _storage    = np.jsonClone (defaults);

    function setupStorage (parent) {
        var i, t_of;

        for (i in parent) {
            t_of    = typeof parent[i];

            if (t_of === 'object')          { setupStorage (parent[i]);     }
            else if ( t_of === 'string')    { parent[i] = false;            }
        }
    }
    
    function buildValues (parent, selector) {
        var i, t_of;

        for (i in parent) {
            t_of    = typeof parent[i];

            if (t_of === 'object')          { buildValues (parent[i], (selector ? selector + '.'+ i : i));      } 
            else if ( t_of === 'string')    { generateOption((selector ? selector + '.' +i : i), parent[i]);    }
        }
    }
    
    setupStorage(_storage);
    buildValues (_defaults, false);
    
    function generateOption (selector, type) {
        var data, parts, generated, i, l, is_valid;

        parts       = selector.split('.');
        generated   = _storage;
        l           = parts.length > 0 ? parts.length : 0;

        data    = (function () {
            var i, option;

            if (l > 0) {
                option  = np.jsonClone (options);

                for (i=0; i<l; i++) {
                    if (typeof option[parts[i]] !== 'undefined')    { option  = option[parts[i]];   }
                    else                                            { return false;                 }
                }

                return option;
            } 

            return false;
        }());
        
        is_valid    = data && typeof data === type && notEmpty () !== false;

        if (is_valid) {
            for (i = 0; i < l; i++) {
                if (i < l-1 )   { generated = generated[parts[i]];  }
                else            { generated[parts[i]] = data;       }
            }
        }

        function notEmpty () {
            if (type === 'boolean' || type === 'number' )   { return data;                                              }
            else if (type === 'string')                     { return data.length > 0;                                   }
            else if (type === 'object')                     { var i, l; l = 0; for (i in data) { l++; } return l > 0;   }

            return false;
        }
    }        
    
    return {
        get: function (selector) {
            var parts, l;

            parts   = selector.split ('.');
            l       = parts.length;
            
            return l > 0 ? (function (_storage) {
                var i, storage ;

                storage = np.jsonClone (_storage);

                for (i=0; i<l; i++) { 
                    if (typeof (storage[parts[i]]) !== 'undefined' )    { storage = storage[parts[i]];  }
                    else                                                { return false;                 }
                }

                return storage;
            }(_storage)) : false;            
        },
        
        getObject: function () {
            return _storage;
        }
    };
});
