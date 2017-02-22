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

np.controller.extend ('AdminPluginGalleryOverviewController', (function () {
    function getPage () {
       return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminPluginGalleryOverviewView',
        model:  function () {
            var model;

            model                                       = this;

            model.AdminPluginGallery.type               = '';
            model.AdminPluginGallery.src                = false;
            model.AdminPluginGallery.sending            = false;
            model.AdminPluginGallery.new_title          = '';
            model.AdminPluginGallery.new_content        = '';
            model.AdminPluginGallery.errorNewGallery    = false;
            model.AdminPluginGallery.successNewGallery  = false;

            return model;
        },

        events: {
            addGallery: function () {
                this.set ('addGallery', true);
            },
            
            saveGallery: function (view) {
                var _t, mGalleries, galleries, page;

                _t          = this;
                mGalleries  = np.observable.getModelByContext ('AdminPluginGallery');
                galleries   = new Array ();
                page        = getPage ();

                $.each (mGalleries, function (inx, gallery) {
                    if (gallery.id > -1) {
                        galleries.push ({
                            id:         gallery.id,
                            src:        gallery.src,
                            thumbnail:  gallery.thumbnail,
                            thumbnails: gallery.thumbnails,
                            title:      gallery.title,
                            content:    gallery.content,
                            type:       gallery.type,
                            order:      gallery.order
                        });
                    }
                });
                
                _t.set ('sending', true);
                
                np.gallery.saveGallery ({galleries: galleries, route_id: page})
                .then (function (success) {
                    _t.set ('sending', false);
                    _t.set ('successUpdate', true);
                })
                .fail (function (error) {
                    _t.set ('sending', false);
                    _t.set ('error', error.statusCode);
                });                
            },            

            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'src', 'type', 'sm');
            },

            saveNewGallery: function (view) {
                var tmp, _t, galleries, order, route_id, src, thumb, thumbs, title, type, content;

 
                tmp             = document.createElement ('div');
                tmp.innerHTML   = view.get ('new_content').replace (/\<br\>/gim, "\n");
                
                _t              = this;
                galleries       = np.observable.getModelByContext ('AdminPluginGallery');
                order           = galleries ? Object.keys (galleries).length : 1;
                route_id        = getPage ();
                type            = this.get ('type');
                src             = this.get ('src');
                thumb           = this.get ('thumbnail');
                thumbs          = this.get ('thumbnails');
                title           = view.get ('new_title');
                content         = tmp.textContent || tmp.innerText || '';
                
                _t.set ('sending', true);
                
                np.gallery.addGallery ({
                    route_id:   route_id,
                    src:        src,
                    thumbnail:  thumb,
                    thumbnails: thumbs,
                    title:      title,
                    type:       type,
                    content:    content,
                    order:      order
                })
                .then (function (success) {
                    var modelGallery, html, template;

                    modelGallery  = {
                        id:         success.data,
                        src:        src,
                        thumbnail:  thumb,
                        thumbnails: thumbs,
                        title:      title,
                        type:       type,
                        content:    content,
                        order:      order
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginGalleryView');
                    html        = np.parseHandlebar (template, modelGallery);
                    html        = $($(html)[0]);
                    
                    html.addClass ('new-gallery');
                    
                    $('#admin-plugin-gallery-sortarea').append (html);
                    
                    $.each (galleries, function (inx, gallery) {
                        np.observable.update ('AdminPluginGallery', gallery.id, 'order', gallery.order);
                    });
                    
                    _t.set ('sending', false);
                    _t.set ('src', false);
                    _t.set ('thumbnail', false);
                    _t.set ('thumbnails', false);
                    _t.set ('new_title', '');
                    _t.set ('new_content', '');
                    _t.set ('type', '');
                    _t.set ('addGallery', false);
                    
                })
                .fail (function (error) {
                    _t.set ('sending', false);
                    _t.set ('error', error.statusCode);
                });
            },
            
            cancelNewGallery: function (view) {
                this.set ('src', false);
                this.set ('new_title', '');
                this.set ('new_content', '');
                this.set ('type', '');

                this.set ('addGallery', false);
            }
        }
    };
}()));