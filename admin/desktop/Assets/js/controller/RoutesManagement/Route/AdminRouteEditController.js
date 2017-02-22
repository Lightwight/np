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

np.controller.extend ('AdminRouteEditController', (function () {
    var origin;
    
    function getPage () {
        var resources;
        
        resources   = np.route.getResources ().split ('/');
        
        return resources[0] !== '' ? parseInt (resources[0], 10) : 1;
    }
    
    return {
        view:   'AdminRouteEditView',
        model:  function () {
            var route;
            
            route   = {id: -1};
            
            np.model.Routes.findByID (getPage ()).each (function (row) {
                route   = row.getAll ();
            });
            
            route.editRoute             = false;
            route.routeLabel            = route.route;

            route.savingRouteSettings   = false;
            route.errorRouteSettings    = false;
            
            route.savingSeoSettings     = false;
            route.errorSeoSettings      = false;

            route.errorPluginsSettings  = false;
            route.savingPluginsSettings = false;

            origin                      = np.jsonClone (route);
            
            return {Route: route};
        },
        
        events: {
            setTitle: function (view) {
                this.set ('title', view.get ('title'));
            },
            
            setContent: function (view) {
                this.set ('content', view.get ('content'));
            },
            
            editRoute: function () {
                this.set ('editRoute', true);
            },

            applyRoute: function (view) {
                origin.route    = view.get ('route');
                
                $('#routeAnchor').attr ('href', origin.route);
                this.set ('routeLabel', origin.route);
                this.set ('editRoute', false);
            },            
            
            cancelEditRoute: function () {
                this.set ('editRoute', false);
                $('#routeAnchor').attr ('href', origin.route);
                this.set ('routeLabel', origin.route);
                this.set ('route', origin.route);
            },
            
            toggleEnabled: function (view) {
                this.set ('enabled', !this.get ('enabled'));
            },
            
            toggleForce: function (view) {
                this.set ('force', !this.get ('force'));
            },
            
            toggleContentEnabled: function (view) {
                this.set ('content_enabled', !this.get ('content_enabled'));
            },
            
            saveRouteSettings: function (view) {
                var _t, model;
                
                _t      = this;

                _t.set ('savingRouteSettings', true);
                
                model   = np.model.Routes.findByID (_t.get ('id'));

                model.each (function (row) {
                    row.setEnabled (_t.get ('enabled') == true ? 1 : 0);
                    row.setForce (_t.get ('force') == true ? 1 : 0);
                    row.setContentEnabled (_t.get ('content_enabled') == true ? 1 : 0);
                    
                    row.save ()
                    .then (function (result) {
                        origin  = np.jsonClone (_t.getAll ());
                
                        _t.set ('savingRouteSettings', false);
                        _t.set ('errorRouteSettings', false);
                    })
                    .fail (function (result) {
                        _t.set ('savingRouteSettings', false);
                        _t.set ('errorRouteSettings', true);                
                    });
                });
            },
            
            setRoute: function (view) {
                this.set ('route', view.get ('route'));
            },
            
            savePageContent: function () {
                var _t, model, title, content, route;

                _t          = this;
                title       = this.get ('title');

                $('#inpRouteContent').html (np.wysiwyg.cleanHtml ($('#inpRouteContent').html ()));
                content     = $('#inpRouteContent').html ();

                route       = this.get ('route');
                
                this.set ('savingPageContent', true);
                
                model       = np.model.Routes.findByID (this.get ('id'));

                model.each (function (row) {
                    row.setTitle (title);
                    row.setContent (content);
                    row.setRoute (route);

                    row.save ()
                    .then (function (result) {
                        origin  = np.jsonClone (_t.getAll ());
                
                        _t.set ('savingPageContent', false);
                        _t.set ('errorPageContent', false);                        
                    })
                    .fail (function (result) {
                        _t.set ('savingPageContent', false);
                        _t.set ('errorPageContent', true);
                    });
                });
            },
            
            savePluginsSettings: function (view) {
                var _t, plugins;
                
                _t          = this;
                _t.set ('savingPluginsSettings', true);
                
                plugins     = np.observable.getModelByContext ('AdminPluginSettings');

                $.each (plugins, function (inx, plugin) {
                    np.model.Plugins.findByID (plugin.id).each (function (row) {
                        row.setPluginEnabled (plugin.plugin_enabled);
                    });
                });            
                
                np.model.Plugins.save ()
                .then (function () {
                    _t.set ('savingPluginsSettings', false);
                    _t.set ('errorPluginsSettings', false);

                    view.rerender ('AdminRoutePluginsContentView');
                })
                .fail (function () {
                    _t.set ('savingPluginsSettings', false);
                    _t.set ('errorPluginsSettings', true);
                });
            },
            
            
            setSeoDescription: function (view) {
                this.set ('seo_description', view.get ('seo_description'));
            },

            setSeoKeywords: function (view) {
                this.set ('seo_keywords', view.get ('seo_keywords'));
            },

            setSeoFrequency: function (view) {
                this.set ('seo_frequency', view.get ('seo_frequency'));
            },

            setSeoPriority: function (view) {
                this.set ('seo_priority', view.get ('seo_priority'));
            },
            
            setCrawlable: function () {
                this.set ('crawlable', 1);
            },
            
            setNotCrawlable: function () {
                this.set ('crawlable', 0);
            },
            
            savePageSeo: function (view) {
                var _t, model;
                
                _t      = this;

                _t.set ('savingSeoSettings', true);
                
                model   = np.model.Routes.findByID (_t.get ('id'));

                model.each (function (row) {
                    row.setSeoDescription (_t.get ('seo_description'));
                    row.setSeoKeywords (_t.get ('seo_keywords'));
                    row.setSeoFrequency (parseInt (_t.get ('seo_frequency'), 10));
                    row.setSeoPriority (parseInt (_t.get ('seo_priority'), 10));
                    row.setCrawlable (_t.get ('crawlable'));
                    
                    row.save ()
                    .then (function (result) {
                        origin  = np.jsonClone (_t.getAll ());
                
                        _t.set ('savingSeoSettings', false);
                        _t.set ('errorSeoSettings', false);
                    })
                    .fail (function (result) {
                        _t.set ('savingSeoSettings', false);
                        _t.set ('errorSeoSettings', true);                
                    });
                });
            }
        }
    };
}()));