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

np.controller.extend ('MediahtekFolderController', {
    view:   'MediathekFolderView',
    model:  function () {
        this.MediaItem.removed  = false;
        this.MediaItem.removing = false;
        
        return { MediathekFolder: this.MediaItem };
    },
    
    events: {
        setFolder: function (view) {
            this.set ('folder', view.get ('folder'));
        },

        removeFolder: function (view) {
            var _t, folder_id;
            
            _t          = this;
            
            _t.set ('removing', true);
            folder_id   = _t.get ('folder_id');
            
            np.mediathek.removeFolder (folder_id)
            .then (function () {
                _t.set ('removing', false);
                _t.set ('removed', true); 
                
                view.rerender ('MediathekMediaView');
            })
            .fail (function () {
                _t.set ('removing', false);
                _t.set ('removed', false);
            });
        },
        
        applyFolder: function (view) {
            var _t, folder, folder_id;
            
            _t          = this;
            
            _t.set ('applying', true);
            
            folder      = _t.get ('folder');
            folder_id   = _t.get ('folder_id');
            
            np.mediathek.applyFolder ({folder_id: folder_id, folder: folder})
            .then (function () {
                _t.set ('applying', false);
                _t.set ('applied', true); 
            })
            .fail (function () {
                _t.set ('applying', false);
                _t.set ('applied', false);
            });
        }
    }
});