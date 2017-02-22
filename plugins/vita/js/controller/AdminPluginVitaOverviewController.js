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

np.controller.extend ('AdminPluginVitaOverviewController', (function () {
    function getPage () {
       return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminPluginVitaOverviewView',
        model:  function () {
            var model;

            model                                   = this;
            
            model.AdminPluginVita.saving            = false;
            model.AdminPluginVita.main_type         = typeof this.AdminPluginVita.data.main_type !== 'undefined' ? this.AdminPluginVita.data.main_type: '';
            model.AdminPluginVita.main_src          = typeof this.AdminPluginVita.data.main_src !== 'undefined' ? this.AdminPluginVita.data.main_src : '';
            model.AdminPluginVita.main_title        = typeof this.AdminPluginVita.data.main_title !== 'undefined' ? this.AdminPluginVita.data.main_title : '';
            model.AdminPluginVita.main_content      = typeof this.AdminPluginVita.data.main_content !== 'undefined' ? this.AdminPluginVita.data.main_content : '';
            
            model.AdminPluginVita.new_from          = '';
            model.AdminPluginVita.new_to            = '';
            model.AdminPluginVita.new_vita_content  = '';

            model.AdminPluginVita.errorNewVita      = false;
            model.AdminPluginVita.successNewVita    = false;

            return model;
        },
        
        events: {
            addVita: function () {
                this.set ('addVita', true);
            },
    
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'main_src', 'main_type');
            }, 
            
            setTitle: function (view) {
                this.set ('main_title', view.get ('main_title'));
            },
            
            setContent: function (view) {
                var tmp, content;
                
                tmp             = document.createElement ('div');
                content         = view.get ('main_content');
                
                tmp.innerHTML   = content;

                this.set ('main_content', tmp.textContent || tmp.innerText || '');
            },
            
            setDateFrom: function (view) {
                this.set ('new_from', view.get ('new_from'));
            },
            
            setDateTo: function (view) {
                this.set ('new_to', view.get ('new_to'));
            },
            
            setVitaContent: function (view) {
                this.set ('new_vita_content', view.get ('new_vita_content'));
            },
            
            saveNewVita: function () {
                var _t, route_id, vitas, order, from, to, content;
                
                _t          = this;
                
                vitas       = np.observable.getModelByContext ('AdminPluginVitaItem');

                order       = vitas ? Object.keys (vitas).length + 1 : 1;
                route_id    = getPage ();
                from        = this.get ('new_from');
                to          = this.get ('new_to');
                content     = this.get ('new_vita_content');
                
                _t.set ('saving', true);
                
                np.vita.addVita ({
                    route_id:   route_id,
                    from:       from,
                    to:         to,
                    content:    content,
                    order:      order
                })
                .then (function (success) {
                    var modelVita, html, template;

                    modelVita  = {
                        AdminPluginVitaItem: {
                            id:         success.data,
                            from:       from,
                            to:         to,
                            content:    content,
                            order:      order
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginVitaItemView');
                    html        = np.parseHandlebar (template, modelVita);
                    html        = $($(html)[0]);
                    
                    html.addClass ('new-vita');
                    
                    $('#admin-plugin-vita-sortarea').append (html);
                    
                    $.each (vitas, function (inx, vita) {
                        np.observable.update ('AdminPluginVitaItem', vita.id, 'order', vita.order);
                    });
                    
                    _t.set ('saving', false);
                    _t.set ('new_from', '');
                    _t.set ('new_to', '');
                    _t.set ('new_vita_content', '');
                    _t.set ('addVita', false);
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('error', error.statusCode);
                });                
            },

            cancelNewVita: function (view) {
                this.set ('new_from', '');
                this.set ('new_to', '');
                this.set ('new_vita_content', '');

                this.set ('addVita', false);
            },
            
            saveVita: function () {
                var _t, mVitas, vitas, page;

                _t          = this;
                mVitas      = np.observable.getModelByContext ('AdminPluginVitaItem');
                vitas       = new Array ();
                page        = getPage ();
                
                $.each (mVitas, function (inx, vita) {
                    if (vita.id > -1) {
                        vitas.push ({
                            id:         vita.id,
                            from:       vita.from,
                            to:         vita.to,
                            content:    vita.content,
                            order:      vita.order
                        });
                    }
                });

                _t.set ('saving', true);

                np.vita.saveVita ({
                    main_type:      this.get ('main_type'),
                    main_src:       this.get ('main_src'),
                    main_title:     this.get ('main_title'),
                    main_content:   this.get ('main_content'),
                    vitas:          vitas,                    
                    route_id:       page
                })
                .then (function (success) {
                    _t.set ('saving', false);
                    _t.set ('successUpdate', true);
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('error', error.statusCode);
                });                
            }            
        }
    };
})());