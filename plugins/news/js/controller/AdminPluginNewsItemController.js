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

np.controller.extend ('AdminPluginNewsItemController', (function () {
    function getPage () {
       return parseInt (np.route.getBookmarkItem (), 10);
    }
          
    return {
        view:   'AdminPluginNewsItemView',
        model:  function () {
            this.deleting           = false;
            this.successDeleted     = false;
            this.src                = typeof this.src === 'string' ? this.src : '';
            this.type               = typeof this.type === 'string' ? this.type : 'image';

            return {AdminPluginNewsItem: this};
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

            moveNewsPositionUp: function (view) {
                var news;
                
                this.set ('order', this.get ('order') - 1);

                news    = np.observable.getModelByContext ('AdminPluginNewsItem');

                if (news) {
                    $.each (news, function (inx, newsItem) {
                        np.observable.update ('AdminPluginNewsItem', newsItem.id, 'changed_order', true);
                    });
                }        
            },

            moveNewsPositionDown: function (view) {
                var news;
                
                this.set ('order', this.get ('order') + 1);
                
                news    = np.observable.getModelByContext ('AdminPluginNewsItem');

                if (news) {
                    $.each (news, function (inx, newsItem) {
                        np.observable.update ('AdminPluginNewsItem', newsItem.id, 'changed_order', true);
                    });
                }        
            },
            
            removeNews: function () {
                var id, _t;
                
                _t  = this;
                id  = _t.get ('id');
                
                np.news.deleteNews (getPage (), this.get ('id'))
                .then (function () {
                    var news;

                    _t.set ('successDeleted', true);
                    
                    news    = np.observable.getModelByContext ('AdminPluginNewsItem');
                    
                    if (news) {
                        np.observable.removeContext ('AdminPluginNewsItem', id);

                        $.each (news, function (inx, newsItem) {
                            np.observable.update ('AdminPluginNewsItem', newsItem.id, 'order', newsItem.order);
                        });

                        $.each (news, function (inx, newsItem) {
                            np.observable.update ('AdminPluginNewsItem', newsItem.id, 'changed_order', true);
                        });
                    }
                })
                .fail (function () {
                    _t.set ('successDeleted', false);
                });
            },
            
            sort: function (view, e, ui) {
                var news, id, order;
                
                news    = np.observable.getModelByContext ('AdminPluginNewsItem');
                
                $.each (news, function (inx, newsItem) {
                    np.observable.update ('AdminPluginNewsItem', newsItem.id, 'changed_order', true);
                });
            }
        }
    };
}()));