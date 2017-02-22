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

np.controller.extend ('AdminPluginSlideController', (function () {
    function getPage () {
        var bookmark;

        bookmark    = np.route.getBookmark ();
        
        return bookmark.length > 0 ? parseInt (bookmark.split ('/')[0]) : 1;
    }
          
    return {
        view:   'AdminPluginSlideView',
        model:  function () {
            this.deleting           = false;
            this.successDeleted     = false;

            return {AdminPluginSlide: this};
        },

        events: { 
            setTitle: function (view) {
                this.set ('title', view.get ('title'));
            },
            
            setSeoTitle: function (view) {
                this.set ('seo_title', view.get ('seo_title'));
            },
            
            setSeoAlt: function (view) {
                this.set ('seo_alt', view.get ('seo_alt'));
            },
            
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'src', 'type');
            },

            moveSlidePositionUp: function (view) {
                var slides;
                
                this.set ('order', this.get ('order') - 1);

                slides      = np.observable.getModelByContext ('AdminPluginSlide');

                if (slides) {
                    $.each (slides, function (inx, slide) {
                        np.observable.update ('AdminPluginSlide', slide.id, 'changed_order', true);
                    });
                }        
            },

            moveSlidePositionDown: function (view) {
                var slides;
                
                this.set ('order', this.get ('order') + 1);
                
                slides      = np.observable.getModelByContext ('AdminPluginSlide');

                if (slides) {
                    $.each (slides, function (inx, slide) {
                        np.observable.update ('AdminPluginSlide', slide.id, 'changed_order', true);
                    });
                }        
            },
            
            removeSlide: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                np.slider.deleteSlide (getPage (), this.get ('id'))
                .then (function () {
                    var slides;

                    _t.set ('successDeleted', true);
                    
                    slides      = np.observable.getModelByContext ('AdminPluginSlide');
                    
                    if (slides) {
                        np.observable.removeContext ('AdminPluginSlide', id);

                        $.each (slides, function (inx, slide) {
                            np.observable.update ('AdminPluginSlide', slide.id, 'order', slide.order);
                        });

                        $.each (slides, function (inx, slide) {
                            np.observable.update ('AdminPluginSlide', slide.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('successDeleted', false);
                });
            },
            
            sort: function (view, e, ui) {
                var slides, id, order;
                
                slides  = np.observable.getModelByContext ('AdminPluginSlide');
                
                $.each (slides, function (inx, slide) {
                    np.observable.update ('AdminPluginSlide', slide.id, 'changed_order', true);
                });
            }
        }
    };
}()));