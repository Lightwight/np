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

np.controller.extend ('AdminPluginGalleryController', (function () {
    function getPage () {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
          
    return {
        view:   'AdminPluginGalleryView',
        model:  function () {
            var parts;

            parts                   = this.src.split ('/');
            
            this.deleting           = false;
            this.successDeleted     = false;
            this.name               = parts[parts.length - 1];
            
            return {AdminPluginGallery: this};
        },

        events: { 
            setTitle: function (view) {
                this.set ('title', view.get ('title'));
            },
            
            setContent: function (view) {
                var tmp, content;
                
                tmp             = document.createElement ('div');
                content         = view.get ('content');
                
                tmp.innerHTML   = content;

                this.set ('content', tmp.textContent || tmp.innerText || '');
            },
            
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'src', 'type', 'md');
            },

            moveGalleryPositionUp: function (view) {
                var galleries;
                
                this.set ('order', this.get ('order') - 1);

                galleries   = np.observable.getModelByContext ('AdminPluginGallery');

                if (galleries) {
                    $.each (galleries, function (inx, gallery) {
                        np.observable.update ('AdminPluginGallery', gallery.id, 'changed_order', true);
                    });
                }        
            },

            moveGalleryPositionDown: function (view) {
                var galleries;
                
                this.set ('order', this.get ('order') + 1);
                
                galleries   = np.observable.getModelByContext ('AdminPluginGallery');

                if (galleries) {
                    $.each (galleries, function (inx, gallery) {
                        np.observable.update ('AdminPluginGallery', gallery.id, 'changed_order', true);
                    });
                }        
            },
            
            removeGallery: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                np.gallery.deleteGallery (getPage (), this.get ('id'))
                .then (function () {
                    var galleries;

                    _t.set ('successDeleted', true);
                    
                    np.observable.removeContext ('AdminPluginGallery', id);
                    
                    galleries   = np.observable.getModelByContext ('AdminPluginGallery');
                    
                    if (galleries) {
                        $.each (galleries, function (inx, gallery) {
                            np.observable.update ('AdminPluginGallery', gallery.id, 'order', gallery.order);
                        });
                        
                        $.each (galleries, function (inx, gallery) {
                            np.observable.update ('AdminPluginGallery', gallery.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('successDeleted', false);
                });
            },
            
            sort: function (view, e, ui) {
                var galleries;
                
                galleries   = np.observable.getModelByContext ('AdminPluginGallery');
                
                $.each (galleries, function (inx, gallery) {
                    np.observable.update ('AdminPluginGallery', gallery.id, 'changed_order', true);
                });
            }
        }
    };
}()));