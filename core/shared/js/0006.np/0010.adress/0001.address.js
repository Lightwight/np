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

np.module('address', (function () {
    var internals, internal_call, recaptcha, switchAddress;
    
    internal_call   = false;
    recaptcha       = false;
    switchAddress   = true;
    internals       = new Array ();
    
    function setup () {
        $(document).ready (function () {
            $('body > header').remove ();
            $('body > main').remove ();
            $('body > footer').remove ();

            function loadAddress (route) {
                var parts, page, need_defaults;
                
                route   = internal_call ? route : window.location.href.replace (/(.*\:\/\/)([^\/]*)\//, '');
                if (route.slice (0, 1) === '#') { route = route.slice (1);  }
                if (route.slice (0, 1) !== '/') { route = '/'+route;        }

                if (route !== '/' && route.slice (route.length-1) === '/')   { route = route.slice (0, route.length-1);   }

                parts           = route.split ('/');
                page            = ( typeof parts[1] !== 'undefined' )? parts[1] : '/';
                need_defaults   = np.INITIAL_DATA.is_bot;
                
                np.hook ('route', {status: 'requesting', perc: 20});
                
                if (!np.routeController.switchRoute (route)) {
                    np.requestRoute ({route: route, type: 'json', defaults: need_defaults})
                    .then (function (data) {
                        var options;

                        options             = {route: data.route};
                        options['data']     = data[data.route];

                        if (typeof data.definitions !== 'undefined')    { options.definitions = data.definitions;   }
                        if (typeof data.models !== 'undefined')         { options.models = data.models;             }
                        if (typeof data.auth !== 'undefined')           { options.auth = data.auth;                 }
                        if (typeof data.plugin !== 'undefined')         { options.plugin = data.plugin;             }
                        if (typeof data.plugins !== 'undefined')        { options.plugins = data.plugins;           }
                        if (typeof data.paginations !== 'undefined')    { options.paginations = data.paginations;   }
                        if (typeof data.force !== 'undefined')          { options.force = data.force;               }
                        if (typeof data.meta !== 'undefined')           { options.meta = data.meta;                 }
                        if (typeof data.scope !== 'undefined')          { options.scope = data.scope;               }
                        if (typeof data.origin !== 'undefined')         { options.origin = data.origin;             }
                        if (typeof data.lang !== 'undefined')           { options.lang = data.lang;                 }

                        np.routeController.setRoute (options);
                    })
                    .fail(function (rsp) {
                        var data, options, hasJson;
                        
                        hasJson             = typeof rsp.data.responseJSON !== 'undefined';
                        data                = hasJson ? rsp.data.responseJSON : false;
                        
                        if (data) {
                            options             = {route: data.route};
                            options['data']     = data[data.route];
                            options['error']    = typeof rsp.error !== 'undefined' && typeof rsp.error.statusCode !== 'undefined' ? parseInt (rsp.error.statusCode, 10) : 404;
                            
                            if (typeof data.definitions !== 'undefined')    { options.definitions = data.definitions;   }
                            if (typeof data.models !== 'undefined')         { options.models = data.models;             }
                            if (typeof data.auth !== 'undefined')           { options.auth = data.auth;                 }
                            if (typeof data.plugin !== 'undefined')         { options.plugin = data.plugin;             }
                            if (typeof data.plugins !== 'undefined')        { options.plugins = data.plugins;           }
                            if (typeof data.paginations !== 'undefined')    { options.paginations = data.paginations;   }
                            if (typeof data.force !== 'undefined')          { options.force = data.force;               }
                            if (typeof data.meta !== 'undefined')           { options.meta = data.meta;                 }
                            if (typeof data.scope !== 'undefined')          { options.scope = data.scope;               }
                            if (typeof data.origin !== 'undefined')         { options.origin = data.origin;             }
                            
                            np.routeController.setRoute (options);
                        } else {
                            /* TODO: Allgemeine Fehlerseite: Route konnte nicht geladen werden. Response fehlerhaft. */
                        }
                    });
                }  
            }
            
            $('body').on ('click', 'a:not(.telephone):not(.external):not(.internal)', function (e) {
                var path, href, nohref, nochange;

                if (!np.INITIAL_DATA.is_bot) {
                    e.preventDefault();
                    
                    nohref          = $(this).hasClass ('nohref');
                    nochange        = $(this).hasClass ('nochange');
                    internal_call   = true;

                    href            = $(this).attr('href');
                    path            = $.address.path ();

                    if (path !== href && href !== '#')  { 
                        if (nohref) { 
                            switchAddress   = false;    
                            href            = href.slice (1);
                        }
                        
                        if (!nochange) {
                            $.address.value (href);
                        }
                    } 
                }
            });

            $('body').on ('click', 'a.external', function (e) {
                var href;
                
                e.preventDefault ();
                
                href    = $(this).attr ('href');
                
                window.open (href, '_blank');
            });
            
            $('body').on ('click', 'a.nohref', function (e) 
            {
                e.preventDefault ();
            });
            
            $.address.change (function (e) {
                var href, cmpHref;
                
                href    = e.value;
                if (href.indexOf ('/') === 0) { href = '#'+href.slice (1);  }
                
                cmpHref = href !== '#' ? href : '/';
                
                switchAddress   = !($('a.nohref[href="'+cmpHref+'"]').length > 0);
                
                if (switchAddress && internals.indexOf (e.value) === -1) {
                    loadAddress (e.value); 
                }
                
                switchAddress   = true;
            });
        });
    }
    
    setup();
    
    return { 
        update: function () { setup (); },
        
        getPath: function () {
            return $.address.path ();
        }
    };
}()));