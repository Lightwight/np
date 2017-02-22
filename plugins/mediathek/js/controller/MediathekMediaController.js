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

np.controller.extend ('MediathekMediaController', {
    view:   'MediathekMediaView',
    model:  function () {
        $('#mediathek-folder-selection').niceSelect ('destroy');
        
        return {
            MediathekMedia: 
            {
                id:             -1, 
                files:          np.mediathek.getMedia (),
                folders:        np.mediathek.getFolders (),
                folder_id:      0,
                media_filter:   {
                    src:    ''
                }
            }
        };
    },
    
    events: {
        setFolderID: function (view) {
            var media, folderID;
            
            folderID    = parseInt (view.get ('f_id'), 10);
            
            this.set ('folder_id', folderID);
            
            media   = np.observable.getModelByContext ('MediaItem');
            
            $.each (media, function (inx, mediaItem) {
                np.observable.update ('MediaItem', parseInt (mediaItem.id, 10), 'filter_folder', folderID);
            });
        },
        
        setFilter: function (view) {
            var media, filter;
            
            filter  = {src: view.get ('m_filter')};
            
            this.set ('media_filter', filter);
            
            media   = np.observable.getModelByContext ('MediaItem');

            $.each (media, function (inx, mediaItem) {
                np.observable.update ('MediaItem', parseInt (mediaItem.id, 10), 'media_filter', filter);
            });
            
        }
    }
});