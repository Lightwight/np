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

np.controller.extend ('MediathekFoldersController', {
    view:   'MediathekFoldersView',
    model:  function () {
        return {
            MediathekFolders: {
                id:         -1,
                folders:    this.Mediathek.folders,
                folder:     '',
                success:    false,
                sending:    false
            }
        };
    },
    
    events: {
        setFolder: function (view) {
            this.set ('folder', view.get ('new_folder'));
        },
        
        addFolder: function (view) {
            var _t, folder;
            
            _t      = this;
            folder  = _t.get ('folder');
            
            if (!folder.empty ()) {
                _t.set ('sending', true);
                
                np.mediathek.saveFolder (folder)
                .then (function (folder) {
                    var modelFolder, template, html;
            
                    _t.set ('sending', false);
                    _t.set ('success', true);
                    
                    modelFolder = {
                        MediaItem: {
                            id:         folder.id,
                            folder_id:  folder.folder_id,
                            folder:     folder.folder
                        }    
                    };
                    
                    template    = np.handlebars.getTemplate ('MediathekFolderView');
                    html        = np.parseHandlebar (template, modelFolder);
                    html        = $($(html)[0]);

                    $(html).insertBefore ('#mediathek-folders-view .form-group.menu');    
                    
                    view.rerender ('MediathekMediaView');
                })
                .fail (function () {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                });
            }
        }
    }
});