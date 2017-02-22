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

np.controller.extend ('AdminPluginMailOverviewController', (function () {
    var newFieldID;
    
    newFieldID  = 0;
    
    function getPage () {
       return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminPluginMailOverviewView',
        model:  function () {
            var model;

            model                                   = this;

            model.AdminPluginMailForm.main_type         = typeof this.AdminPluginMailForm.data.main_type !== 'undefined' ? this.AdminPluginMailForm.data.main_type: '',
            model.AdminPluginMailForm.main_src          = typeof this.AdminPluginMailForm.data.main_src !== 'undefined' ? this.AdminPluginMailForm.data.main_src : '',
            model.AdminPluginMailForm.main_title        = typeof this.AdminPluginMailForm.data.main_title !== 'undefined' ? this.AdminPluginMailForm.data.main_title: '',
            model.AdminPluginMailForm.main_content      = typeof this.AdminPluginMailForm.data.main_content !== 'undefined' ? this.AdminPluginMailForm.data.main_content : '',
            model.AdminPluginMailForm.main_subject      = typeof this.AdminPluginMailForm.data.main_subject !== 'undefined' ? this.AdminPluginMailForm.data.main_subject : '',
            model.AdminPluginMailForm.main_receiver     = typeof this.AdminPluginMailForm.data.main_receiver !== 'undefined' ? this.AdminPluginMailForm.data.main_receiver : '',
            
            model.AdminPluginMailForm.new_label         = '';
            model.AdminPluginMailForm.new_type          = '';
            model.AdminPluginMailForm.new_placeholder   = '';

            model.AdminPluginMailForm.saving            = false;
            
            model.AdminPluginMailForm.errorSaving       = false;
            model.AdminPluginMailForm.errorNewField     = false;

            return model;
        },
        
        events: {
            addField: function () {
                this.set ('addField', true);
            },
    
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'main_src', 'main_type');
            }, 
            
            setTitle: function (view) {
                this.set ('main_title', view.get ('main_title'));
            },
            
            setContent: function (view) {
                var tmp;
                
                tmp             = document.createElement ('div');
                tmp.innerHTML   = view.get ('main_content').replace (/\<br\>/gim, "\n");
                
                this.set ('main_content', tmp.textContent || tmp.innerText || '');                
            },
            
            setSubject: function (view) {
                this.set ('main_subject', view.get ('main_subject'));
            },
            
            setReceiver: function (view) {
                this.set ('main_receiver', view.get ('main_receiver'));
            },
            
            setNewLabel: function (view) {
                this.set ('new_label', view.get ('new_label'));
            },

            setNewPlaceholder: function (view) {
                this.set ('new_placeholder', view.get ('new_placeholder'))
            },
            
            setNewType: function (view) {
                this.set ('new_type', view.get ('selected_new_type'));
            },
            
            saveNewField: function () {
                var _t, route_id, fields, values, order, type, label, placeholder;
                
                _t          = this;
                
                route_id    = getPage ();
                
                fields      = np.observable.getModelByContext ('AdminPluginMailItem');
                values      = np.observable.getModelByContext ('AdminPluginMailNewValue');

                order       = fields ? Object.keys (fields).length + 1 : 1;
                
                type        = this.get ('new_type');
                label       = this.get ('new_label');
                placeholder = this.get ('new_placeholder');
                
                this.set ('saving', true);

                np.mail_form.addField ({
                    route_id:       route_id,
                    type:           type,
                    label:          label,
                    placeholder:    placeholder,
                    values:         values,
                    order:          order
                })
                .then (function (success) {
                    var modelField, html, template;
                    
                    _t.set ('saving', false);
                    _t.set ('errorNewField', false);
                    
                    modelField  = {
                        AdminPluginMailItem: {
                            id:             success.data,
                            type:           type,
                            label:          label,
                            placeholder:    placeholder,
                            values:         values,
                            order:          order
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginMailItemView');
                    html        = np.parseHandlebar (template, modelField);
                    html        = $($(html)[0]);
                    
                    $('#admin-plugin-mail-sortarea').append (html);
                    
                    $.each (fields, function (inx, field) {
                        np.observable.update ('AdminPluginMailItem', field.id, 'order', field.order);
                    });
                    
                    _t.set ('new_label', '');
                    _t.set ('new_type', '');
                    _t.set ('new_placeholder', '');

                    values  = np.observable.getModelByContext ('AdminPluginMailNewValue');

                    $.each (values, function (inx, value) {
                        np.observable.update ('AdminPluginMailNewValue', value.id, 'removed', true);
                        np.observable.removeContext ('AdminPluginMailNewValue', value.id);
                    });       

                    newFieldID  = 0;

                    _t.set ('addField', false);
                    
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('errorNewField', true);
                });                
            },

            cancelNewField: function (view) {
                var values;
                
                this.set ('new_label', '');
                this.set ('new_type', '');
                this.set ('new_placeholder', '');

                values  = np.observable.getModelByContext ('AdminPluginMailNewValue');
                
                $.each (values, function (inx, value) {
                    np.observable.update ('AdminPluginMailNewValue', value.id, 'removed', true);
                    np.observable.removeContext ('AdminPluginMailNewValue', value.id);
                });       
                
                newFieldID  = 0;
                
                this.set ('addField', false);
            },
            
            saveMailForm: function () {
                var _t, mFields, mValues, fields, page;

                _t          = this;
                mFields     = np.observable.getModelByContext ('AdminPluginMailItem');
                
                fields      = new Array ();
                page        = getPage ();

                _t.set ('saving', true);
                
                $.each (mFields, function (inx, field) {
                    if (field.id > -1) {
                        fields.push ({
                            id:             field.id,
                            label:          field.label,
                            type:           field.type,
                            placeholder:    field.placeholder,
                            order:          field.order,
                            values:         field.values
                        });
                    }
                });

                np.mail_form.saveMailForm ({
                    main_type:      this.get ('main_type'),
                    main_src:       this.get ('main_src'),
                    main_title:     this.get ('main_title'),
                    main_content:   this.get ('main_content'),
                    main_subject:   this.get ('main_subject'),
                    main_receiver:  this.get ('main_receiver'),
                    fields:         fields,                    
                    route_id:       page
                })
                .then (function (success) {
                    _t.set ('saving', false);
                    _t.set ('errorSaving', false);
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('errorSaving', true);
                });                
            },
            
            addValue: function () {
                var modelField, html, template;
                
                newFieldID--;
                
                modelField  = {
                    AdminPluginMailNewValue: {
                        id:         newFieldID,
                        field_id:   '',
                        value:      '',
                        order:      newFieldID*(-1)
                    }    
                };

                template    = np.handlebars.getTemplate ('AdminPluginMailNewValueView');
                html        = np.parseHandlebar (template, modelField);
                html        = $($(html)[0]);
                
                $('#admin-plugin-mail-new-value-sortarea').append (html);
            }
        }
    };
})());