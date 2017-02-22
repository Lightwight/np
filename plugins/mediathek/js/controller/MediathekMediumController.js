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

np.controller.extend ('MediathekMediumController', {
    view:   'MediathekMediumView',
    model:  function () {
        this.removeSuccess              = false;
        this.removing                   = false;
        this.MediaItem.filter_folder    = 0;
        this.MediaItem.media_filter     = {src: ''};
        
        return this;
    },
    
    events: {        
        editImage: function (view) {
            np.observable.update ('Mediathek', -1, 'editItemID', this.get ('id'));
            view.rerender ('MediathekMediaEditView');
            np.observable.update ('Mediathek', -1, 'menu', 'editImage');
        },

        applyImage: function () {
            var src, id,
                context, model, columnSrc, columnType, preview, thumbs;
            
            src             = this.get ('src');
            id              = this.get ('id');
            
            context         = np.mediathek.getContext ();
            model           = context.model;
            columnSrc       = context.columnSrc;
            columnType      = context.columnType;
            preview         = 'thumb_'+context.thumbnailSize;
            thumbs          = {
                xs: src+id+this.get ('thumb_xs'),
                sm: src+id+this.get ('thumb_sm'),
                md: src+id+this.get ('thumb_md'),
                lg: src+id+this.get ('thumb_lg')
            };

            model.set (columnType, 'image');
            model.set ('thumbnails', thumbs);
            model.set ('thumbnail', this.get ('src')+this.get ('id')+this.get (preview));
            model.set (columnSrc, this.get ('src')+this.get ('id')+this.get ('name'));

            np.observable.update ('Mediathek', -1, 'isVisible', false);
        },
        
        applyYoutubeVideo: function () {
            var context, model, columnSrc, columnType;
            
            context     = np.mediathek.getContext ();
            model       = context.model;
            columnSrc   = context.columnSrc;
            columnType  = context.columnType;

            model.set (columnType, 'youtube');
            model.set (columnSrc, this.get ('src'));

            np.observable.update ('Mediathek', -1, 'isVisible', false);
        },
        
        removeItem: function () {
            var _t, id;
            
            _t  = this;
            id  = _t.get ('id');
            
            _t.set ('removing', true);
            
            np.mediathek.removeItem (id)
            .then (function () {
                _t.set ('removing', false);
                _t.set ('removeSuccess', true);
            })
            .fail (function () {
                _t.set ('removing', false);
                _t.set ('removeSuccess', false);
            });
        }
    }
});
