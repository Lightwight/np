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

np.controller.extend ('AdminPluginNewsOverviewController', (function () {
    function getPage () {
        return parseInt (np.route.getBookmarkItem (), 10);        
    }
    
    return {
        view:   'AdminPluginNewsOverviewView',
        model:  function () {
            var model;

            model                                   = this;

            model.AdminPluginNews.saving            = false;
            model.AdminPluginNews.src               = '';
            model.AdminPluginNews.type              = '';
            model.AdminPluginNews.news_content      = '';
            model.AdminPluginNews.errorNewNews      = false;
            model.AdminPluginNews.successNewNews    = false;

            return model;
        },

        events: {
            showMediathek: function () {
                np.mediathek.show (this, 'show', false, 'src', 'type');
            },
            
            addNews: function () {
                this.set ('addNews', true);
            },
            
            setTitle: function (view) {
                this.set ('title', view.get ('new_title'));
            },
            
            setContent: function (view) {
                var tmp;
                
                tmp             = document.createElement ('div');
                tmp.innerHTML   = view.get ('new_content').replace (/\<br\>/gim, "\n");
                
                this.set ('content', tmp.textContent || tmp.innerText || '');
            },
            
            saveNews: function (view) {
                var _t, mNews, news, page;

                _t          = this;
                mNews       = np.observable.getModelByContext ('AdminPluginNewsItem');
                news        = new Array ();
                page        = getPage ();
                
                $.each (mNews, function (inx, newsItem) {
                    news.push ({
                        id:         newsItem.id,
                        title:      newsItem.title,
                        src:        newsItem.src,
                        type:       newsItem.type,
                        content:    newsItem.content,
                        order:      newsItem.order
                    });
                });

                np.news.saveNews ({news: news, route_id: page})
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

            saveNewNews: function (view) {
                var _t, news, order, route_id, src, type, title, content;

                _t          = this;
                news        = np.observable.getModelByContext ('AdminPluginNewsItem');
                order       = news ? Object.keys (news).length + 1 : 1;
                route_id    = getPage ();
                src         = this.get ('src');
                type        = this.get ('type');
                title       = this.get ('title');
                content     = this.get ('content');
                
                _t.set ('saving', true);
                
                np.news.addNews ({
                    route_id:   route_id,
                    src:        src,
                    type:       type,
                    title:      title,
                    content:    content,
                    order:      order
                })
                .then (function (success) {
                    var modelNews, html, template;

                    modelNews   = {
                        AdminPluginNewsItem: {
                            id:         success.data,
                            src:        src,
                            type:       type,
                            title:      title,
                            content:    content,
                            order:      order
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('AdminPluginNewsItemView');
                    html        = np.parseHandlebar (template, modelNews);
                    html        = $($(html)[0]);
                    
                    html.addClass ('new-news');
                    
                    $('#admin-plugin-news-sortarea').append (html);
                    
                    $.each (news, function (inx, newsItem) {
                        np.observable.update ('AdminPluginNewsItem', newsItem.id, 'order', newsItem.order);
                    });
                    
                    _t.set ('saving', false);
                    _t.set ('src', '');
                    _t.set ('type', '');
                    _t.set ('new_title', '');
                    _t.set ('new_content', '');
                    _t.set ('addNews', false);
                    
                })
                .fail (function (error) {
                    _t.set ('saving', false);
                    _t.set ('error', error.statusCode);
                });
            },
            
            cancelNewNews: function (view) {
                this.set ('src', '');
                this.set ('type', '');
                this.set ('new_title', '');
                this.set ('new_content', '');

                this.set ('addNews', false);
            }
        }
    };
}()));