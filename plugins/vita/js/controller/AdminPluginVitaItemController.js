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

np.controller.extend ('AdminPluginVitaItemController', (function () {
    function getPage () {
       return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminPluginVitaItemView',
        model:  function () {
            this.deleting           = false;
            this.successDeleted     = false;

            return {AdminPluginVitaItem: this};
        },
        
        events: { 
            setDateFrom: function (view) {
                this.set ('from', view.get ('date_from'));
            },
            
            setDateTo: function (view) {
                this.set ('to', view.get ('date_to'));
            },
            
            setVitaContent: function (view) {
                var tmp, content;
                
                tmp             = document.createElement ('div');
                content         = view.get ('vita_content');
                
                tmp.innerHTML   = content;

                this.set ('content', tmp.textContent || tmp.innerText || '');
            },

            moveVitaPositionUp: function (view) {
                var vitas;
                
                this.set ('order', this.get ('order') - 1);

                vitas   = np.observable.getModelByContext ('AdminPluginVitaItem');

                if (vitas) {
                    $.each (vitas, function (inx, vita) {
                        np.observable.update ('AdminPluginVitaItem', vita.id, 'changed_order', true);
                    });

                    $.each (vitas, function (inx, vita) {
                        np.observable.update ('AdminPluginVitaItem', vita.id, 'order', vita.order);
                    });
                }        
            },

            moveVitaPositionDown: function (view) {
                var vitas;
                
                this.set ('order', this.get ('order') + 1);
                
                vitas   = np.observable.getModelByContext ('AdminPluginVitaItem');

                if (vitas) {
                    $.each (vitas, function (inx, vita) {
                        np.observable.update ('AdminPluginVitaItem', vita.id, 'changed_order', true);
                    });
                }        
            },
            
            removeVita: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                np.vita.deleteVita (getPage (), this.get ('id'))
                .then (function () {
                    var vitas;

                    _t.set ('successDeleted', true);
                    
                    vitas   = np.observable.getModelByContext ('AdminPluginVitaItem');
                    
                    if (vitas) {
                        np.observable.removeContext ('AdminPluginVitaItem', id);

                        $.each (vitas, function (inx, vita) {
                            np.observable.update ('AdminPluginVitaItem', vita.id, 'order', vita.order);
                        });

                        $.each (vitas, function (inx, vita) {
                            np.observable.update ('AdminPluginVitaItem', vita.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('successDeleted', false);
                });
            },
            
            sort: function (view, e, ui) {
                var vitas, id, order;
                
                vitas   = np.observable.getModelByContext ('AdminPluginVitaItem');
                
                $.each (vitas, function (inx, vita) {
                    np.observable.update ('AdminPluginVitaItem', vita.id, 'changed_order', true);
                });
            }
        }
    };
})());