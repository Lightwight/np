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

np.controller.extend ('AdminPluginMailItemController', (function () {
    var newFieldID;
    
    newFieldID  = 0;
    
    function getPage () {
        return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminPluginMailItemView',
        model:  function () {
            var i;
            
            this.deleting           = false;
            this.errorDeleted       = false;
            this.removed            = false;

            if (typeof this.values === 'object') {
                
                for (i in this.values) {
                    this.values[i].containment  = '#admin-plugin-mail-value-sortarea-'+this.id;
                }
            }
            
            this.item_sort_id   = 'admin-plugin-mail-value-sortarea-'+this.id;
            
            return {AdminPluginMailItem: this};
        },
        
        events: { 
            setType: function (view) {
                this.set ('type', view.get ('selected_type'));
            },
            
            setLabel: function (view) {
                this.set ('label', view.get ('label'));
            },
            
            setPlaceholder: function (view) {
                this.set ('placeholder', view.get ('placeholder'));
            },
            
            addValue: function () {
                var modelField, html, template, newID, newOrder, localValues, values, mapped;
                
                newID       = 1;
                newOrder    = 1;
                
                values      = np.observable.getModelByContext ('AdminPluginMailValue');
                localValues = this.get ('values');
                
                if (!$.isEmptyObject (values)) {
                    mapped = $.map (values, function(value, index) {
                        return [value];
                    });
                    
                    newID   = mapped.reduce (function (max, arr) {
                        return max >= arr['id'] ? max : arr['id'];
                    }, 0) + 1;
                }

                if ($.isArray (localValues)) {
                    newOrder    = localValues.reduce (function (max, arr) {
                        var cur;
                        
                        cur = parseInt (arr['order'], 10);

                        return max > cur ? max : cur;
                    }, 0) + 1;
                }

                modelField  = {
                    AdminPluginMailValue: {
                        id:         newID,
                        value:      '',
                        order:      newOrder
                    }    
                };
                
                localValues.push (modelField.AdminPluginMailValue);
                this.set ('values', localValues);
    
                template    = np.handlebars.getTemplate ('AdminPluginMailValueView');
                html        = np.parseHandlebar (template, modelField);
                html        = $($(html)[0]);

                $('#'+this.get ('item_sort_id')).append (html);                
            },
    
            moveFieldPositionUp: function (view) {
                var fields;
                
                this.set ('order', this.get ('order') - 1);

                fields  = np.observable.getModelByContext ('AdminPluginMailItem');

                if (fields) {
                    $.each (fields, function (inx, field) {
                        np.observable.update ('AdminPluginMailItem', field.id, 'changed_order', true);
                    });
                }        
            },

            moveFieldPositionDown: function (view) {
                var fields;
                
                this.set ('order', this.get ('order') + 1);
                
                fields  = np.observable.getModelByContext ('AdminPluginMailItem');

                if (fields) {
                    $.each (fields, function (inx, field) {
                        np.observable.update ('AdminPluginMailItem', field.id, 'changed_order', true);
                    });
                }        
            },
            
            removeField: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                _t.set ('deleting', true);
                
                np.mail_form.deleteField (getPage (), this.get ('id'))
                .then (function () {
                    var fields;

                    _t.set ('deleting', false);
                    _t.set ('errorDeleted', false);
                    _t.set ('removed', true);
                    
                    fields  = np.observable.getModelByContext ('AdminPluginMailItem');
                    
                    if (fields) {
                        np.observable.removeContext ('AdminPluginMailItem', id);

                        $.each (fields, function (inx, field) {
                            np.observable.update ('AdminPluginMailItem', field.id, 'order', field.order);
                        });

                        $.each (fields, function (inx, field) {
                            np.observable.update ('AdminPluginMailItem', field.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('deleting', false);
                    _t.set ('errorDeleted', true);
                });
            },
            
            sort: function (view, e, ui) {
                var fields;
                
                fields  = np.observable.getModelByContext ('AdminPluginMailItem');
                
                $.each (fields, function (inx, field) {
                    np.observable.update ('AdminPluginMailItem', field.id, 'changed_order', true);
                });
            }
        }
    };
})());