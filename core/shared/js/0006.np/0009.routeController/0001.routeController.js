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

np.module ('routeController', (function () {
    var storage, response, ready, pageRoute;
    
    ready       = false;
    pageRoute   = {
        from:       false,
        to:         ''
    };
    
    storage     = {
        view:           np.view,
        auth:           false,

        useDefHeader:   false,
        useDefFooter:   false,
        useDefHooks:    false,
        
        isDefHeader:    null,
        isDefFooter:    null,
        isDefHooks:     null,
        
        hasView:        false,
        
        currentRoute:   false,
        newRoute:       false,
        
        scope:          'custom',
        
        defaults:   {
            need:   true,
            route:  '',
            header: {
                html:   ''
            },
            footer: {
                html:   ''
            },
            
            view:           false,
            
            animation:  {
                add:        {opacity: 1},
                duration:   200
            }      
        },
        
        routes: {},
        
        observables:    {},
        
        switched:   false,
        
        set:    function (selector, data) {
            var parts, last, setter, i;

            parts       = selector.split ('.');
            last        = parts.length > 0 ? parts.length : false;
            setter      = last !== false ? storage : false;
            
            if (setter !== false) {
                for (i = 0; i < last; i++) {
                    if ( i < last - 1 ) {
                        if (typeof setter[parts[i]] === 'undefined') { 
                            setter[parts[i]]    = {};
                        } 
                        
                        setter  = setter[parts[i]];
                    } else {
                        setter[parts[i]]    = data;
                    }
                }
            }
        },
        
        get: function (selector) {
            var parts, l;

            parts   = selector.split ('.');
            l       = parts.length;
            
            return l > 0 ? (function (_storage) {
                var i, storage;

                storage = np.jsonClone (_storage);

                for (i=0; i<l; i++) { 
                    if (typeof (storage[parts[i]]) !== 'undefined' )    { storage = storage[parts[i]];  }
                    else                                                { return false;                 }
                }

                return storage;
            }(this)) : false;            
        }
    };
    
    response  = false;
    
    function resolveRoute () {
        var parts, route, hasView;

        route   = storage.newRoute;
        hasView = storage.get ('hasView');

        if (storage.newRoute && hasView) {
            parts   = route.split ('/');
            delete parts[parts.length-1];

            route   = parts.join ('/')+'*';
        }

        return route;
    }
    
    function generateDefaults (options, isSuccessful) {
        var defaults, code, route;
        
        route       = options.route;
        code        = isSuccessful ? 1 : options.error;
        
        defaults    = {route: 'string', origin: 'string', code: 'number', scope: 'string'};
        
        defaults[code]  = {
            auth:       'object',
            plugins:    'object',
            lang:       'string',

            data:   {
                plugin:     'object',

                header:     { html: 'string' },
                main:       { html: 'string' },
                footer:     { html: 'string' },
                hooks:      'object',
                bookmark:   'string',
                
                defaults:   {
                    route:  'string',
                    header: { html: 'string' },
                    footer: { html: 'string' },
                    hooks:  'object'
                },

                view:   'string'      
            },

            definitions:    'object',
            models:         'object',
            paginations:    'object',
            meta:           'object',
            force:          'number',
            scope:          'string'
        };
        
        return defaults;
    }
    
    function prepareOptions (options, isSuccessful) {
        var convOpts, code, scope, lang;

        code            = isSuccessful ? 1 : options.error;
        scope           = typeof options.scope !== 'undefined' ? options.scope : 'custom';
        lang            = 'de';
        
        if (typeof options.lang !== 'undefined') {
            np.client.setLanguage (options.lang);
            
            delete options['lang'];
        }
        
        convOpts        = {route: options.route, origin: options.origin, code: code, scope: scope};
        convOpts[code]  = np.jsonClone (options);
        
        if (!isSuccessful) { delete convOpts['error'];  } 

        return convOpts;
    }
    
    function prepareResponse (options) {
        var defaults, successful, convOpts;

        successful  = typeof options.error === 'undefined';
        
        defaults    = generateDefaults (options, successful);
        convOpts    = prepareOptions (options, successful);  
        response    = np.createObject (defaults, convOpts);
    }
    
    function hasDefaults () {
        var code, l;
        
        code    = response.get ('code');

        for (l in response.getObject ()[code].data.defaults) {
            return response.getObject ()[code].data.defaults[l] !== false;
        }
    }
    
    function setupAuth () {
        var authData, code;
        
        code        = response.get ('code');
        authData    = response.get (code+'.auth');

        if (authData)   { np.auth.setUser (authData, true);   }
    }
    
    function setupAnalytics () {
        var code, route, meta, title;
        
        code    = response.get ('code');
        route   = '/'+response.get (code+'.route');
        meta    = response.get (code+'.meta');
        title   = typeof meta.title !== 'undefined' ? meta.title : 'unknown';

        if (typeof ga === 'function') {
            ga ('set', {
                'hitType':  'pageview',
                'page':     route,
                'title':    title
            });
        }
    }
    
    function preparePlugins () {
        var code, plugins, chain, method, paramName, walking, name, lName, data, 
            i, j;
    
        code        = response.get ('code');
        plugins     = response.get (code+'.plugins') || storage.get ('routes.'+storage.newRoute+'.plugins');

        if (plugins) {
            storage.set ('routes.'+storage.newRoute+'.'+code+'.plugins', plugins);
            
            for (i in plugins) {
                name        = i;
                lName       = name.slice (0, 1).toLowerCase ()+name.slice (1);
                paramName   = false;

                if (typeof np[lName] !== 'undefined' && typeof np[lName].setup !== 'undefined') {
                    chain   = plugins[i];
                    data    = np.jsonClone (chain);
                    walking = (function () {var x; for (x in chain) {return true;} return false;}());
                    method  = np[lName].setup;
                    
                    while (walking) {
                        for (j in chain) {
                            if (typeof method[j] === 'function') {
                                method      = method[j];
                                data        = data[j];
                                chain       = chain[j];
                                
                                walking     = false;
                                break;
                            } else if (typeof method[j] !== 'undefined') {
                                method      = method[j];
                                data        = data[j];
                                chain       = chain[j];
                            } else {
                                walking     = false;
                            }
                            
                            break;
                        }
                    }

                    if (typeof method === 'function') { method (data); }
                }
            }
        }
    }
    
    function setupScope () {
        var code, route, match, scope;
        
        code    = response.get ('code');
        match   = $('html').attr ('class').match (/np-scope-[a-zA-Z]*/g);
        scope   = response.get ('scope');
        route   = response.get ('route');
        
        storage.set ('switched', storage.scope !== scope);
        storage.set ('scope', scope);
        storage.set ('routes.'+route+'.'+code+'.scope', scope);
        
        if (match !== null && match[0] !== 'np-scope-'+scope) {
            $('html').switchClass (match[0], 'np-scope-'+scope);
        } else {
            $('html').addClass ('np-scope-'+scope);
        }
    }
    
    function setupRoute () {
        storage.newRoute        = storage.currentRoute = response.get ('route');
        storage.origin          = response.get ('origin');
    }
    
    function setupPage () {
        var isDefRoute, has_header, has_footer, has_hooks,
            code, scope, route;
        
        code                    = response.get ('code');
        scope                   = response.get ('scope');
        route                   = storage.newRoute;

        isDefRoute              = typeof storage.defaults[scope] !== 'undefined' 
                                  && typeof storage.defaults[scope].route !== 'undefined'
                                  && storage.defaults[scope].route === route;
        
        has_header              = response.get (code+'.data.header.html');
        has_footer              = response.get (code+'.data.footer.html');
        has_hooks               = response.get (code+'.data.hooks');

        storage.useDefHeader    = (!has_header || isDefRoute);
        storage.useDefFooter    = (!has_footer || isDefRoute);
        storage.useDefHooks     = (!has_hooks || isDefRoute);
        
        storage.set ('routes.'+storage.newRoute+'.'+code+'.force', response.get (code+'.force'));

        if (response.get (code+'.data.view') !== false) {
            storage.set ('hasView', true);
            storage.set ('routes.'+storage.newRoute+'.'+code+'.view', response.get (code+'.data.view'));
        } else {
            storage.set ('hasView', false);
        }
    }
    
    function setupBookmark () {
        var code, bookmark;
        
        code        = response.get ('code');
        bookmark    = response.get (code+'.data.bookmark');
        
        if (bookmark) {
            storage.set ('routes.'+storage.newRoute+'.'+code+'.bookmark', bookmark);
        }
    }
    
    function setupDefaults () {
        var code, route, scope, def_route, def_header, def_footer, def_hooks;
        
        code    = response.get ('code');
        route   = response.get ('route');

        if (storage.switched) {
            storage.isDefHeader = null;
            storage.isDefFooter = null;
            storage.isDefHooks  = null;
        }

        if (hasDefaults ()) {
            def_route   = response.get (code+'.data.defaults.route');
            if (def_route)   { def_route = def_route.slice (0, 1).toLowerCase () + def_route.slice (1); }

            def_header  = response.get (code+'.data.defaults.header.html');
            def_footer  = response.get (code+'.data.defaults.footer.html');
            def_hooks   = response.get (code+'.data.defaults.hooks');

            scope       = response.get ('scope');

            if (def_route && def_header && def_footer && scope) {
                storage.defaults[scope] = {
                    route:  def_route,
                    header: {html: def_header},
                    footer: {html: def_footer},
                    hooks:  def_hooks
                };
                
                storage.routes[route][code].defaults    = response.get (code+'.data.defaults');
            } 
        }
    }
    
    function setupMeta () {
        var code, meta, 
            metaTags, titleTag,
            meta_title, meta_description, page_title;
    
        code                = response.get ('code');
        meta                = response.get (code+'.meta');
        
        meta_title          = typeof meta.meta_title !== 'undefined' ? meta.meta_title : false;
        meta_description    = typeof meta.meta_description !== 'undefined' ? meta.meta_description : false;
        page_title          = typeof meta.title !== 'undefined' ? meta.title : false;
        
        metaTags            = $('meta');
        titleTag            = $('title');
        
        metaTags.each (function () {
            if ($(this).attr ('title') && meta_title) {
                $(this).attr ('title', meta_title);
            } else if ($(this).attr ('description') && meta_description) {
                $(this).attr ('description', meta_description);
            }
        });
        
        if (titleTag.length > 0 && page_title) {
            titleTag.html (page_title);
        }
    }
    
    function setupTemplates () {
        var code, route, header, main, footer, hooks;
        
        code            = response.get ('code');
        header          = response.get (code+'.data.header.html');
        main            = response.get (code+'.data.main.html');
        footer          = response.get (code+'.data.footer.html');
        hooks           = response.get (code+'.data.hooks');

        route           = resolveRoute ();

        if (route) {
            if (!storage.get ('routes.'+route+'.'+code+'.header.html')) {
                storage.set ('routes.'+route+'.'+code+'.header.html', (header ? header : ''));
            }
            
            if (!storage.get ('routes.'+route+'.'+code+'.main.html')) {
                storage.set ('routes.'+route+'.'+code+'.main.html', (main ? main : ''));
            }
            
            if (!storage.set ('routes.'+route+'.'+code+'.footer.html')) {
                storage.set ('routes.'+route+'.'+code+'.footer.html', (footer ? footer : ''));
            }
            
            if (!storage.set ('routes.'+route+'.'+code+'.hooks')) {
                storage.set ('routes.'+route+'.'+code+'.hooks', (hooks ? hooks : new Array ()));
            }

            return true;
        } else {
            return false;
        }
    }
    
    function setupPaginations () {
        var code, paginations, name,
            i;
        
        code        = response.get ('code');
        paginations = response.get (code+'.paginations');
        
        if (typeof paginations === 'object') {
            for (i in paginations) {
                name    = i.slice (0, 1).toLowerCase ()+i.slice (1);
                
                np.pagination.set (name, paginations[i]);
            }
        }
    }
    
    function registerModels () {
        var code, page, 
            definitions, definition, 
            models, model, mID, 
            amount, resolved,
            hModel, hasDefinition, exts, extsData, extModel, push, extID, i, j, l, m,
            promise;
        
        promise             = np.Promise ();
        code                = response.get ('code');
        page                = storage.newRoute;
        
        definitions         = response.get (code+'.definitions');
        models              = response.get (code+'.models');
        amount              = definitions ? ((function () { var i, j; j = 0; for (i in definitions) { j++; } return j; }())) : 0;
        resolved            = 0;
        
        if (definitions && amount > 0) {
            np.model.adapter.set (np.model.ajaxAdapter);
            
            for (definition in definitions) {
                model           = typeof models[definition] !== 'undefined' ? models[definition] : new Array ();
                hModel          = definition.slice (0, 1).toUpperCase () + definition.slice (1);
                exts            = np.model.get (hModel);
                hasDefinition   = !$.isArray (definitions[definition]) && !$.isEmptyObject (definitions[definition]);
                
                if (exts && typeof exts.rows !== 'undefined') {
                    extsData    = exts.rows ();

                    if ($.isArray (extsData)) { 
                        extModel    = new Array ();
                        
                        l           = extsData.length;
                        
                        for (i=0; i<l; i++) {
                            extID   = parseInt (extsData[i].id);
                            
                            push    = true;
                            m       = model.length;
                            
                            for (j=0; j<m; j++) {
                                mID     = parseInt (model[j].id, 10);
                                
                                if (extID === mID) { push = false; break; }
                            }
                            
                            if (push) {
                                model.push (extsData[i]);
                            }
                        }
                    }
                }
                
                if (hasDefinition) {
                    np.model.register (definition, definitions[definition], model)
                    .then(function () { 
                        resolved++;

                        if (resolved === amount) { promise.then (); }
                    })
                    .fail(function() {
                        resolved++;

                        if (resolved === amount) { promise.then (); }
                    });
                } else {
                    resolved++;
                    
                    if (resolved === amount) { promise.then (); }
                }
            }
        } else {
            promise.then ();
        }
        
        return promise;
    }
    
    function parseTemplates () {
        var code, route, scope, hasView, selectors, viewSelectors, templatesData, 
            current, awaiting, replace,
            html, i, selector, parsed, parsedHooks,
            hL, hI,
            replaces, templates;

        code        = response.get ('code');
        route       = resolveRoute ();
        scope       = response.get ('scope');

        hasView     = storage.get ('hasView');

        parsedHooks = new Array ();
        
        current     = 0;
        awaiting    = 5;

        replaces    = {
            def_h:      !storage.isDefHeader && storage.useDefHeader,
            def_f:      !storage.isDefFooter && storage.useDefFooter,
            def_hooks:  !storage.isDefHooks && storage.useDefHooks
        };

        selectors   = { 
            def_h_html:         'defaults.'+scope+'.header.html',
            def_h_handlebar:    'defaults.'+scope+'.header.handlebar',
            
            def_f_html:         'defaults.'+scope+'.footer.html',
            def_f_handlebar:    'defaults.'+scope+'.footer.handlebar',
            
            def_hooks:          'defaults.'+scope+'.hooks',
            
            h_html:             'routes.'+storage.newRoute+'.'+code+'.header.html',
            h_handlebar:        'routes.'+storage.newRoute+'.'+code+'.header.handlebar',
            
            m_html:             'routes.'+storage.newRoute+'.'+code+'.main.html',
            m_handlebar:        'routes.'+storage.newRoute+'.'+code+'.main.handlebar',
            
            f_html:             'routes.'+storage.newRoute+'.'+code+'.footer.html',
            f_handlebar:        'routes.'+storage.newRoute+'.'+code+'.footer.handlebar',
            
            hooks:              'routes.'+storage.newRoute+'.'+code+'.hooks'
        };
        
        viewSelectors   = {
            h_html:         'routes.'+route+'.'+code+'.header.html',
            h_handlebar:    'routes.'+route+'.'+code+'.header.handlebar',
            
            m_html:         'routes.'+route+'.'+code+'.main.html',
            m_handlebar:    'routes.'+route+'.'+code+'.main.handlebar',
            
            f_html:         'routes.'+route+'.'+code+'.footer.html',
            f_handlebar:    'routes.'+route+'.'+code+'.footer.handlebar'
        };

        templatesData   = {
            def_h:  {
                selector:   selectors.def_h_handlebar,
                html:       storage.get (selectors.def_h_html)
            },
            def_f:  {
                selector:   selectors.def_f_handlebar,
                html:       storage.get (selectors.def_f_html)
            },
            def_hooks: {
                selector:   selectors.def_hooks,
                html:       storage.get (selectors.def_hooks)
            },
            
            h:  {
                selector:   selectors.h_handlebar,
                html:       hasView ? storage.get (viewSelectors.h_html) : storage.get (selectors.h_html)
            },
            m:  {
                selector:   selectors.m_handlebar,
                html:       hasView ? storage.get (viewSelectors.m_html) : storage.get (selectors.m_html)
            },
            f:  {
                selector:   selectors.f_handlebar,
                html:       hasView ? storage.get (viewSelectors.f_html) : storage.get (selectors.f_html)
            },
            hooks: {
                selector:   selectors.hooks,
                html:       storage.get (selectors.hooks)
            }
        };
        
        for (i in templatesData) {
            replace = true;
            
            if (i==='def_h')            { replace = replaces.def_h;         }
            else if (i==='h')           { replace = !replaces.def_h;        }
            else if (i==='def_f')       { replace = replaces.def_f;         }
            else if (i==='f')           { replace = !replaces.def_f;        } 
            else if (i=== 'def_hooks')  { replace = replaces.def_hooks;     }
            else if (i==='hooks')       { replace = !replaces.def_hooks;    }
        
            if (replace) {
                html            = templatesData[i].html;
                selector        = templatesData[i].selector;

                if (i==='def_hooks' || i==='hooks') {
                    hL  = html.length;
                    
                    for (hI=0; hI<hL; hI++) {
                        parsedHooks.push ({id:html[hI].id, html: html[hI].html.replace (html[hI].html, np.parseHandlebar (html[hI].html))});
                    }
                    
                    storage.set (selector, parsedHooks);
                } else {
                    parsed  = html.replace (html, np.parseHandlebar (html));
                    
                    storage.set (selector, parsed);
                }
            }
        }
    }
    
    function loadTemplate () {
        var code, scope, ani_add, ani_duration,
            header, main, footer,
            isDefRoute,
            new_header, new_main, new_footer, new_hooks,
            replace, i,
            destroy, promise, contents, hooks,
            fromRoute, sluggedRoute, layer, fromLayer,
            hI, hL;
            
        contents    = new Array ();
        promise     = np.Promise ();
        code        = response.get ('code');
        scope       = response.get ('scope');
        
        function tick (ttd) {
            var l, j, k;

            if (ttd < 30000) {
                l   = contents.length;
                k   = 0;

                for (j=0; j<l; j++) {
                    if ($(contents[j]).length > 0) { 
                        k++;   
                    }
                }

                if (k===l) { 
                    promise.then ();  
                } else {
                    ttd++;

                    np.tick (tick, ttd);   
                }
            } else {
                promise.fail ();
            }
        }
        
        if (storage.newRoute) {
            isDefRoute      = typeof storage.defaults[scope] !== 'undefined' 
                              && typeof storage.defaults[scope].route !== 'undefined'
                              && storage.defaults[scope].route === storage.newRoute;
                      
            sluggedRoute    = getRouteSlug ();
            fromRoute       = np.slugify (pageRoute.from);
            
            header          = storage.get ('routes.'+storage.newRoute+'.'+code+'.header.handlebar');
            main            = storage.get ('routes.'+storage.newRoute+'.'+code+'.main.handlebar');
            footer          = storage.get ('routes.'+storage.newRoute+'.'+code+'.footer.handlebar');
            hooks           = storage.get ('routes.'+storage.newRoute+'.'+code+'.hooks');

            ani_add         = storage.defaults.animation.add;
            ani_duration    = storage.defaults.animation.duration;

            new_header      = storage.useDefHeader && !storage.isDefHeader ? $(storage.defaults[scope].header.handlebar) : (header !== false && header !== '' && !isDefRoute ? $(header) : false);
            new_main        = main !== false && main !== '' ? $(main) : false;
            new_footer      = storage.useDefFooter && !storage.isDefFooter ? $(storage.defaults[scope].footer.handlebar) : (footer !== false && footer !== '' && !isDefRoute ? $(footer) : false);
            new_hooks       = storage.useDefHooks && !storage.isDefHooks ? storage.defaults[scope].hooks : hooks;
//            new_hooks       = new_main ? hooks : false;

            replace         = { main: new_main};
            
            storage.isDefHeader = storage.useDefHeader;
            storage.isDefFooter = storage.useDefFooter;
            
            if (new_header !== false)   { replace.header = new_header;  }
            if (new_footer !== false)   { replace.footer = new_footer;  }

            if (typeof replace.header !== 'undefined') {
                if ($('body > header').length === 0) {
                    $('body').prepend ('<header></header>');
                }

                $('header').replaceWith (replace.header); 

                contents.push ('header');
            }

            if (typeof replace.footer !== 'undefined') {
                if ($('body > footer').length === 0) {
                    $('body').append ('<footer></footer>');
                }

                $('footer').replaceWith (replace.footer); 

                contents.push ('footer');
            }

            if (typeof replace.main !== 'undefined') {
                layer       = 'np-route-layer-'+sluggedRoute;
                fromLayer   = 'np-route-layer-'+fromRoute;

                if ($('#'+layer).length === 0) {
                    $('<div id="'+layer+'" class="np-route-layer"></div>').insertBefore ('footer');
                }

                $('#'+layer).removeClass (function (index, css) {
                    return (css.match (/(^|\s)np-route-from\S+/g) || []).join(' ');
                });

                $('#'+layer).addClass ('np-route-from-'+np.slugify (pageRoute.from));

                if ($('#'+layer+' main').length === 0) {
                    $('#'+layer).append ('<main></main>');
                }

                $('#'+layer+' main').replaceWith (replace.main); 
                $('#'+layer).find ('header').remove ();
                $('#'+layer).find ('footer').remove ();

                if (fromLayer !== layer) {
                    $('#'+fromLayer).removeClass ('active');
                }

                $('#'+layer).addClass ('active');

                contents.push ('main');
            }

            if (new_hooks) {
                hL  = new_hooks.length;
                
                for (hI=0; hI<hL; hI++) {
                    $('#'+new_hooks[hI].id).html (new_hooks[hI].html);
                    
                    contents.push ('#'+new_hooks[hI].id);
                }
            }
            
            np.tick (tick, 0);
        } else {
            promise.fail ();
        }
        
        return promise;
    }
    
    function cleanStorage () {
        var routes, route, remove, force, current;
        
        routes  = storage.routes;
        
        for (route in routes) {
            current = routes[route];
            
            force   = typeof current[1] !== 'undefined' && typeof current[1].force !== 'undefined' ? current[1].force : true;
            remove  = force || typeof current[404] !== 'undefined';
            
            if (remove) { delete storage.routes[route]; }
        }
    }
    
    function getRouteSlug () {
        return np.slugify (storage.currentRoute);
    }
    
    function getPageClass () {
        return $('html').attr ('class').replace (/np-page-[a-zA-Z0-9_]*/g, '')+' np-page-'+getRouteSlug ();
    }
    
    function setPageClass () {
        $('html').attr ('class', getPageClass ());
    }
    
    function setReady (isReady) { ready = isReady;  }
    
    function routeBefore (routeData) {
        var promise, _settings, _fncBefore, _callbackBefore;
        
        promise     = np.Promise ();
        
        _settings   = typeof np.setup.getSettings === 'function' ?  np.setup.getSettings () : false;
        _fncBefore  = _settings 
                        && typeof _settings.route !== 'undefined' 
                        && typeof _settings.route.change !== 'undefined' 
                        && typeof _settings.route.change.before === 'function' 
                        ? _settings.route.change.before : false;
                        
        if (_fncBefore) {
            try { 
                _callbackBefore  = _fncBefore (routeData.from, routeData.to, routeData.$from, routeData.$to);
                
                if (_callbackBefore instanceof np.Promise) {
                    _callbackBefore
                    .then (function () {
                        promise.then ();
                    })
                    .fail (function () {
                        promise.fail ();
                    });
                } else {
                    window.setTimeout (function () {
                        promise.then ();
                    }, 1);
                }
            } catch (e) {}
        } else {
            window.setTimeout (function () {
                promise.then ();
            }, 1);
        }
        
        return promise;
    }

    function routeAfter (routeData) {
        var promise, _settings, _fncAfter, _callbackAfter;
        
        promise     = np.Promise ();
        
        _settings   = typeof np.setup.getSettings === 'function' ?  np.setup.getSettings () : false;
        _fncAfter   = _settings 
                        && typeof _settings.route !== 'undefined' 
                        && typeof _settings.route.change !== 'undefined' 
                        && typeof _settings.route.change.after === 'function' 
                        ? _settings.route.change.after : false;
                        
        if (_fncAfter) {
            try { 
                _callbackAfter  = _fncAfter (routeData.from, routeData.to, routeData.$from, routeData.$to);
                
                if (_callbackAfter instanceof np.Promise) {
                    _callbackAfter
                    .then (function (removeLayerBefore) {
                        promise.then (removeLayerBefore !== false);
                    })
                    .fail (function (removeLayerBefore) {
                        promise.fail (removeLayerBefore !== false);
                    });
                } else {
                    window.setTimeout (function () {
                        promise.then (_callbackAfter !== false);
                    }, 1);
                }
            } catch (e) {}
        } else {
            window.setTimeout (function () {
                promise.then (true);
            }, 1);
        }
        
        return promise;
    }
    
    function finalizeRouteChange (removeLayerBefore) {
        if (removeLayerBefore) {
            $('.np-route-layer:not(.active)').remove ();
        }

        np.view.gc ();
        np.observable.gc ();
        np.handlebars.gc ();
        cleanStorage ();

        setReady (true); 

        np.observable.triggerSystemEvent ('route.change', true);
        np.observable.triggerSystemEvent ('route.after', pageRoute);
    }
    
    return {
        setRoute:    function (options) {     
            setReady (false);

            np.hook ('route', {status: 'parsing data', perc: 40});

            prepareResponse (options);

            setupAuth ();
            
            setupScope ();
            setupRoute ();
            setupDefaults ();
            setupPage ();
            setupBookmark ();

            setupPaginations ();
            
            preparePlugins ();
            
            setupMeta ();            
            setupAnalytics ();

            np.hook ('route', {status: 'loading models', perc: 60});
            
            registerModels ().then (function () {
                np.model.adapter.set (np.model.ajaxAdapter);

                np.hook ('route', {status: 'loading templates', perc: 80});
                
                setupTemplates ();
                parseTemplates ();

                loadTemplate ()
                .then (function () {
                    setPageClass ();
                    
                    np.model.adapter.set (np.model.ajaxAdapter);
                    
                    np.hook ('route', {status: 'done', perc: 100});

                    routeAfter (pageRoute)
                    .then (function (removeLayerBefore) {
                        finalizeRouteChange (removeLayerBefore);
                    })
                    .fail (function (removeLayerBefore) {
                        finalizeRouteChange (removeLayerBefore);
                    });
                })
                .fail (function () { 
                    /* TODO: Warn user */
                    np.hook ('route', {status: 'done', perc: 100});
                });
            });
        },
        
        switchRoute:    function (route) {
            var code, scope, cached_route, force, options, _this;

            _this       = this;
            
            pageRoute   = {
                from:   storage.newRoute !== false ? np.slugify (storage.newRoute) : np.slugify (route),
                to:     np.slugify (route)
            };
            
            pageRoute.$from = '#np-route-layer-'+pageRoute.from;
            pageRoute.$to   = '#np-route-layer-'+pageRoute.to;

            
            $('html').removeClass (function (index, css) {
                return (css.match (/(^|\s)np-route-from\S+/g) || []).join (' ');
            });
            
            $('html').removeClass (function (index, css) {
                return (css.match (/(^|\s)np-route-to\S+/g) || []).join (' ');
            });

            $('html').addClass ('np-route-from-'+pageRoute.from);
            $('html').addClass ('np-route-to-'+pageRoute.to);

            routeBefore (pageRoute)
            .then (function () {
                np.observable.triggerSystemEvent ('route.before', pageRoute);

                cached_route    = storage.get ('routes.'+route) ? storage.get ('routes.'+route) : false;

                code            = parseInt ((function () { var i; for (i in cached_route) { return i; }}()), 10);
                scope           = cached_route !== false && typeof cached_route[code].scope !== 'undefined' ? cached_route[code].scope : 'custom';
                force           = cached_route !== false && typeof cached_route[code].force !== 'undefined' ? cached_route[code].force : false;

                if (cached_route !== false && force == 0) {
                    options         = {route: route, scope: scope};
                    options['data'] = cached_route[code];

                    if (code > 1) { options['error'] = code;    }

                    _this.setRoute (options);

                    return true;
                } else {
                    return false;
                }                
            })
            .fail (function () {
                np.observable.triggerSystemEvent ('route.before', pageRoute);

                cached_route    = storage.get ('routes.'+route) ? storage.get ('routes.'+route) : false;

                code            = parseInt ((function () { var i; for (i in cached_route) { return i; }}()), 10);
                scope           = cached_route !== false && typeof cached_route[code].scope !== 'undefined' ? cached_route[code].scope : 'custom';
                force           = cached_route !== false && typeof cached_route[code].force !== 'undefined' ? cached_route[code].force : false;

                if (cached_route !== false && force == 0) {
                    options         = {route: route, scope: scope};
                    options['data'] = cached_route[code];

                    if (code > 1) { options['error'] = code;    }

                    _this.setRoute (options);

                    return true;
                } else {
                    return false;
                }                
            });
        },
        
        refreshRoute: function () {
            this.switchRoute (storage.newRoute);
        },
        
        getObservable: function (observable) {
            return storage.get ('observables.'+observable);
        },
        
        isReady: function () { return ready;    },
        
        getStorage: function () {
            return storage;
        },
        
        getRoute: function () {
            return storage.currentRoute;
        },
        
        getBookmark: function () {
            var cached_route, code, bookmark;
            
            cached_route    = storage.get ('routes.'+storage.currentRoute);
            code            = parseInt ((function () { var i; for (i in cached_route) { return i; }}()), 10);
            
            bookmark        = storage.get ('routes.'+storage.currentRoute+'.'+code+'.bookmark');
            
            return bookmark ? bookmark : '';
        },
        
        getResources: function () {
            var resources;
            
            resources   = storage.currentRoute.replace (storage.origin.replace (/(\/\*)*/g, ''), '');

            if (resources.indexOf ('/') === 0) {
                resources   = resources.slice (1);
            }

            return resources;
        }
    };
}()));