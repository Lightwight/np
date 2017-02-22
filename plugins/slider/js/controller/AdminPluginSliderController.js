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

np.controller.extend ('AdminPluginSliderController', (function () {
    function getPage () {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminPluginSliderView',
        model:  function () {
            var model;

            model                                   = this;

            model.AdminPluginSlider.saving          = false;
            model.AdminPluginSlider.src             = false;
            model.AdminPluginSlider.new_title       = '';
            model.AdminPluginSlider.new_seo_title   = '';
            model.AdminPluginSlider.new_seo_alt     = '';
            model.AdminPluginSlider.type            = 'image';
            model.AdminPluginSlider.errorNewSlide   = false;
            model.AdminPluginSlider.successNewSlide = false;

            return model;
        },

        events: {
            addSlide: function () {
                this.set ('addSlide', true);
            },
            
            saveSlides: function (view) {
                var _t, mSlides, slides, page;

                _t          = this;
                mSlides     = np.observable.getModelByContext ('AdminPluginSlide');
                slides      = new Array ();
                page        = getPage ();

                $.each (mSlides, function (inx, slide) {
                    if (slide.id > -1) {
                        slides.push ({
                            id:         slide.id,
                            src:        slide.src,
                            title:      slide.title,
                            thumbnail:  slide.thumbnail,
                            thumbnails: slide.thumbnails,
                            seo_title:  slide.seo_title,
                            seo_alt:    slide.seo_alt,
                            type:       slide.type,
                            order:      slide.order
                        });
                    }
                });

                np.slider.saveSlides ({slides: slides, route_id: page})
                .then (function (success) {
                    _t.set ('successUpdate', true);
                })
                .fail (function (error) {
                    _t.set ('error', error.statusCode);
                });                
            },            

            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'src', 'type');
            },

            saveNewSlide: function (view) {
                var _t, slides, order, route_id, src, thumb, thumbs, title, seo_title, seo_alt, type;

                _t          = this;
                slides      = np.observable.getModelByContext ('AdminPluginSlide');

                order       = slides ? Object.keys (slides).length + 1: 1;
                route_id    = getPage ();
                type        = this.get ('type');
                src         = this.get ('src');
                thumb       = this.get ('thumbnail');
                thumbs      = this.get ('thumbnails');
                title       = view.get ('new_title');
                seo_title   = view.get ('new_seo_title');
                seo_alt     = view.get ('new_seo_alt');
                
                _t.set ('saving', true);
                
                np.slider.addSlide ({
                    route_id:   route_id,
                    src:        src,
                    title:      title,
                    seo_title:  seo_title,
                    seo_alt:    seo_alt,
                    type:       type,
                    thumbnail:  thumb,
                    thumbnails: thumbs,
                    order:      order
                })
                .then (function (success) {
                    var viewNodeID, modelSlide, html, template;

                    modelSlide  = {
                        AdminPluginSlide: {
                            id:         success.data,
                            src:        src,
                            title:      title,
                            seo_title:  seo_title,
                            seo_alt:    seo_alt,
                            type:       type,
                            thumbnail:  thumb,
                            thumbnails: thumbs,
                            order:      order
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginSlideView');
                    html        = np.parseHandlebar (template, modelSlide);
                    html        = $($(html)[0]);
                    
                    html.addClass ('new-slide');
                    
                    $('#admin-plugin-slider-sortarea').append (html);
                    
                    $.each (slides, function (inx, slide) {
                        np.observable.update ('AdminPluginSlide', slide.id, 'order', slide.order);
                    });
                    
                    _t.set ('saving', false);
                    _t.set ('src', false);
                    _t.set ('new_title', '');
                    _t.set ('new_seo_title', '');
                    _t.set ('new_seo_alt', '');
                    _t.set ('addSlide', false);
                    
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('error', error.statusCode);
                });
            },
            
            cancelNewSlide: function (view) {
                this.set ('src', false);
                this.set ('new_title', '');
                this.set ('new_seo_title', '');
                this.set ('new_seo_alt', '');

                this.set ('addSlide', false);
            }
        }
    };
}()));