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

np.controller.extend ('AdminPluginSimpleOfferController', (function () {
    function getPage () {
        var bookmark;

        bookmark    = np.route.getBookmark ();
        
        return bookmark.length > 0 ? parseInt (bookmark.split ('/')[0]) : 1;
    }
          
    return {
        view:   'AdminPluginSimpleOfferView',
        model:  function () {
            this.deleting           = false;
            this.successDeleted     = false;

            return {AdminPluginSimpleOffer: this};
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
                np.mediathek.show (this, 'show', false, 'src', 'type');
            },

            moveOfferPositionUp: function (view) {
                var offers;
                
                this.set ('order', this.get ('order') - 1);

                offers  = np.observable.getModelByContext ('AdminPluginSimpleOffer');

                if (offers) {
                    $.each (offers, function (inx, offer) {
                        np.observable.update ('AdminPluginSimpleOffer', offer.id, 'changed_order', true);
                    });
                }        
            },

            moveOfferPositionDown: function (view) {
                var offers;
                
                this.set ('order', this.get ('order') + 1);
                
                offers  = np.observable.getModelByContext ('AdminPluginSimpleOffer');

                if (offers) {
                    $.each (offers, function (inx, offer) {
                        np.observable.update ('AdminPluginSimpleOffer', offer.id, 'changed_order', true);
                    });
                }        
            },
            
            removeOffer: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                np.simple_offers.deleteOffer (getPage (), this.get ('id'))
                .then (function () {
                    var offers;

                    _t.set ('successDeleted', true);
                    
                    offers  = np.observable.getModelByContext ('AdminPluginSimpleOffer');
                    
                    if (offers) {
                        np.observable.removeContext ('AdminPluginSimpleOffer', id);

                        $.each (offers, function (inx, offer) {
                            np.observable.update ('AdminPluginSimpleOffer', offer.id, 'order', offer.order);
                        });

                        $.each (offers, function (inx, offer) {
                            np.observable.update ('AdminPluginSimpleOffer', offer.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('successDeleted', false);
                });
            },
            
            sort: function (view, e, ui) {
                var offers;
                
                offers  = np.observable.getModelByContext ('AdminPluginSimpleOffer');
                
                $.each (offers, function (inx, offer) {
                    np.observable.update ('AdminPluginSimpleOffer', offer.id, 'changed_order', true);
                });
            }
        }
    };
}()));