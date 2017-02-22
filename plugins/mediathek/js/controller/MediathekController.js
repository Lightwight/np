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

np.controller.extend ('MediathekController', (function () {
    return {
        view:   'MediathekView',
        model:  function () {
            var mediathek;

            mediathek   = {
                Mediathek: {
                    id:                     -1, 
                    isVisible:              false,
                    menu:                   'show',
                    
                    savingYoutubeVideo:     false,
                    errorYoutubeVideo:      false,
                    
                    applyVideo:             false,
                    cancelVideo:            false,
                    
                    videoID:                '',
                    videoSrc:               '',
                    videoTitle:             '',
                    editItemID:             0,

                    uploading:              false,
                    uploaded:               false,

                    progress:               0,
                    
                    folders:                np.mediathek.getFolders (),
                    
                    folder_id:              1
                }
            };

            return mediathek;
        },

        events: {
            setFolderID: function (view) {
                this.set ('folder_id', view.get ('fs_id'));
            },
    
            hideMediathek: function () {
                this.set ('isVisible', false);
            },
            
            setFiles: function (view) {
                var _this, folderID, input, fileList, progress,
                    done, total,
                    i, l;
                
                _this       = this;
                folderID    = parseInt (this.get ('folder_id'), 10);

                input       = view.getNode().find ('.file-input');
                fileList    = input[0].files;
                total       = fileList.length;
                progress    = 0;
                done        = 0;
                
                if (total > 0) {
                    np.mediathek.setUploadFiles (fileList);
                    
                    view.rerender ('MediathekUploadItemsView');
                    this.set ('uploading', true);
                    this.set ('progress', 0);

                    for (i=0; i<total; i++) {
                        np.mediathek.saveMedia (fileList[i], folderID)
                        .then (function (fileObj) {
                            var files, fileID, name, src,
                                i, l;

                            for (i in fileObj) {
                                name    = i;
                                src     = fileObj[i].src;
                            }

                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === name) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }                        

                            np.observable.update ('MediaItem', fileID, 'src', src);
                            np.observable.update ('MediaItem', fileID, 'success', true);
                            
                            done++;
                            
                            progress    = Math.ceil ((done / total)*100);
                            
                            _this.set ('progress', progress);
                            
                            if (done === total) { 
                                _this.set ('uploading', false);   
                                view.rerender ('MediathekMediaView');
                            }
                        })
                        .fail (function (fileObj) {
                            var files, fileID, name;

                            for (i in fileObj) {
                                name    = i;
                            }
                            
                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === name) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }                        
                            
                            np.observable.update ('MediaItem', fileID, 'fail', true);
                            
                            done++;
                            
                            progress    = Math.ceil ((done / total)*100);
                            
                            _this.set ('progress', progress);
                            
                            if (done === total) { 
                                _this.set ('uploading', false);   
                                view.rerender ('MediathekMediaView');
                            }
                        })
                        .pending (function (state) {
                            var files, fileID,
                                i, l;

                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === state.file) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }

                            np.observable.update ('MediaItem', fileID, 'progress', state.progress);
                        });
                    }
                }
            },
            
            addMedia: function (view, e) {
                var _this, folderID, addMedia, total, done, progress,
                    i, l;

                _this   = this;

                if (typeof e.originalEvent.dataTransfer !== 'undefined'
                    && typeof e.originalEvent.dataTransfer.files !== 'undefined'
                ) {
                    addMedia    = e.originalEvent.dataTransfer.files;
                    total       = addMedia.length;
                    done        = 0;
                    folderID    = parseInt (this.get ('folder_id'), 10);
                    
                    np.mediathek.setUploadFiles (addMedia);

                    view.rerender ('MediathekUploadItemsView');

                    this.set ('uploading', true);
                    this.set ('progress', 0);

                    for (i=0; i<total; i++) {
                        np.mediathek.saveMedia (addMedia[i], folderID)
                        .then (function (fileObj) {
                            var files, fileID, name, src,
                                i, l;
                            
                            for (i in fileObj) {
                                name    = i;
                                src     = fileObj[i].src;
                            }

                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === name) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }                        

                            np.observable.update ('MediaItem', fileID, 'src', src);
                            np.observable.update ('MediaItem', fileID, 'success', true);
 
                            done++;
                            
                            progress    = Math.ceil ((done / total)*100);
                            
                            _this.set ('progress', progress);
                            
                            if (done === total) { 
                                _this.set ('uploading', false);   
                                view.rerender ('MediathekMediaView');
                            }
                        })
                        .fail (function (fileObj) {
                            var files, fileID, name;
                    
                            for (i in fileObj) {
                                name    = i;
                            }
                            
                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === name) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }                        
                            
                            np.observable.update ('MediaItem', fileID, 'fail', true);
                            
                            done++;
                            
                            progress    = Math.ceil ((done / total)*100);
                            
                            _this.set ('progress', progress);
                            
                            if (done === total) { 
                                _this.set ('uploading', false);   
                                view.rerender ('MediathekMediaView');
                            }
                        })
                        .pending (function (state) {
                            var files, fileID,
                                i, l;

                            files   = np.mediathek.getUploadFiles ();

                            l       = files.length;

                            for (i=0; i<l; i++) {
                                if (files[i].MediaItem.name === state.file) {
                                    fileID  = files[i].MediaItem.id;

                                    break;
                                }
                            }

                            np.observable.update ('MediaItem', fileID, 'progress', state.progress);
                        });
                    }
                }
            },
            
            saveVideo: function (view) {
                var _t;
                
                _t  = this;
                
                _t.set ('savingYoutubeVideo', true);

                np.mediathek.saveYoutubeVideo ({
                    videoID:    this.get ('videoID'),
                    title:      this.get ('videoTitle')
                })
                .then (function () {
                    view.rerender ('MediathekMediaView');                    
            
                    _t.set ('errorYoutubeVideo', false);
                    _t.set ('savingYoutubeVideo', false);
                })
                .fail (function () {
                    _t.set ('errorYoutubeVideo', true);
                    _t.set ('savingYoutubeVideo', false);
                });
            },
            
            setVideoID: function (view) {
                var url, id, src;
                
                url = view.get ('videoID');
                url = url.replace (/(>|<)/gi,'').split (/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
                src = false;
                id  = false;

                if (typeof url[2] !== 'undefined') {
                    id  = url[2].split (/[^0-9a-z_\-]/i);
                    id  = id[0]; 
                } else {
                    id  = url[0];
                }
                
                if (id) {
                    src = 'https://www.youtube.com/embed/'+id+'?autoplay=1&origin=http://hunde.de';
                }

                this.set ('videoID', id);
                this.set ('videoSrc', src);
            },
            
            setVideoTitle: function (view) {
                this.set ('videoTitle', view.get ('videoTitle'));
            },
            
            showMediaContainer: function () {
                if (this.get ('menu') !== 'show')   { this.set ('menu', 'show');        }
            },
            
            showImageContainer: function () {
                if (this.get ('menu') !== 'image')  { this.set ('menu', 'image');       }
            },
            
            showVideoContainer: function () {
                if (this.get ('menu') !== 'video')  { this.set ('menu', 'video');       }
            },
            
            showFolderContainer: function () {
                if (this.get ('menu') !== 'folder') { this.set ('menu', 'folder');      }
            },
            
            cancelVideo: function () {
                this.set ('cancelVideo', true);
                this.set ('videoID', '');
                this.set ('videoSrc', '');
                this.set ('videoTitle', '');
            },
            
            applyVideo: function (view) {
                var context, model, columnSrc, columnType;
            
                context     = np.mediathek.getContext ();
                model       = context.model;
                columnSrc   = context.columnSrc;
                columnType  = context.columnType;

                model.set (columnType, 'youtube');
                model.set (columnSrc, this.get ('videoID'));
                
                this.set ('cancelVideo', true);
                this.set ('videoID', '');
                this.set ('videoSrc', '');
                this.set ('videoTitle', '');
                
                this.set ('isVisible', false);                
            }
        }
    };
}()));