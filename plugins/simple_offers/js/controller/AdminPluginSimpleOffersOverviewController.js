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

np.controller.extend ('AdminPluginSimpleOffersOverviewController', (function () {
    function getPage () {
        return parseInt (np.route.getBookmarkItem (), 10);    
    }
    
    return {
        view:   'AdminPluginSimpleOffersOverviewView',
        model:  function () {
            var model;

            model                                           = this;

            model.AdminPluginSimpleOffers.saving            = false;
            model.AdminPluginSimpleOffers.src               = false;
            model.AdminPluginSimpleOffers.new_title         = '';
            model.AdminPluginSimpleOffers.new_content       = '';
            model.AdminPluginSimpleOffers.errorNewOffer     = false;
            model.AdminPluginSimpleOffers.successNewOffer   = false;

            return model;
        },

        events: {
            addOffer: function () {
                this.set ('addOffer', true);
            },
            
            saveOffers: function (view) {
                var tmp, content, _t, mOffers, offers, page;

                _t          = this;
                mOffers     = np.observable.getModelByContext ('AdminPluginSimpleOffer');
                offers      = new Array ();
                page        = getPage ();
                
                $.each (mOffers, function (inx, offer) {
                    if (offer.id > -1) {
                        offers.push ({
                            id:         offer.id,
                            src:        offer.src,
                            title:      offer.title,
                            content:    offer.content,
                            type:       offer.type,
                            order:      offer.order
                        });
                    }
                });

                np.simple_offers.saveOffers ({offers: offers, route_id: page})
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

            saveNewOffer: function (view) {
                var tmp, _t, offers, order, route_id, src, title, content, type;
                
                tmp             = document.createElement ('div');
                tmp.innerHTML   = view.get ('new_content').replace (/\<br\>/gim, "\n");

                _t          = this;
                offers      = np.observable.getModelByContext ('AdminPluginSimpleOffer');
                order       = offers ? Object.keys (offers).length + 1 : 1;
                route_id    = getPage ();
                type        = this.get ('type');
                src         = this.get ('src');
                title       = view.get ('new_title');
                content     = tmp.textContent || tmp.innerText || '';
                
                _t.set ('saving', true);
                
                np.simple_offers.addOffer ({
                    route_id:   route_id,
                    src:        src,
                    title:      title,
                    content:    content,
                    type:       type,
                    order:      order
                })
                .then (function (success) {
                    var modelOffer, html, template;

                    modelOffer  = {
                        AdminPluginSimpleOffer: {
                            id:         success.data,
                            src:        src,
                            title:      title,
                            content:    content,
                            type:       type,
                            order:      order
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginSimpleOfferView');
                    html        = np.parseHandlebar (template, modelOffer);
                    html        = $($(html)[0]);
                    
                    html.addClass ('new-offer');
                    
                    $('#admin-plugin-simple-offers-sortarea').append (html);
                    
                    $.each (offers, function (inx, offer) {
                        np.observable.update ('AdminPluginSimpleOffer', offer.id, 'order', offer.order);
                    });
                    
                    _t.set ('saving', false);
                    _t.set ('src', false);
                    _t.set ('new_title', '');
                    _t.set ('new_content', '');
                    _t.set ('type', '');
                    _t.set ('addOffer', false);
                    
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('error', error.statusCode);
                });
            },
            
            cancelNewOffer: function (view) {
                this.set ('src', false);
                this.set ('new_title', '');
                this.set ('new_content', '');
                this.set ('type', '');

                this.set ('addOffer', false);
            }
        }
    };
}()));