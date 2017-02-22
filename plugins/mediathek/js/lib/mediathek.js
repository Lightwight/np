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
    
np.plugin.extend ('mediathek', (function () {
    var storage, uploadFiles;
    
    storage         = {
        context:        null,
        media:          new Array (),
        folders:        new Array (),
        initialMenu:    'show'
    };
    
    uploadFiles     = new Array ();
    
    function addFolder (options) {
        var prepared;
        
        prepared    = {
            id:         options.id, 
            folder_id:  options.folder_id,
            folder:     options.folder
        };
        
        mergeStorage (new Array (prepared), 'folders');
    }
    
    function removeFolder (folder_id) {
        var folders;
        
        folder_id   = parseInt (folder_id, 10);
        folders     = storage.folders;
        
        $.each (folders, function (inx, _obj) {
            if (parseInt (_obj.MediaItem.folder_id, 10) === folder_id) {
                storage.folders.splice (inx, 1);
            }
        });
    }
    
    function addImage (medium) {
        var id, name, prepared,
            i;
        
        for (i in medium) {
            name    = i;
            id      = medium[i].id;
        }
        
        prepared    = {
            id:             id,
            name:           name,
            src:            '/assets/mediathek/',
            category:       0,
            type:           'image'
            
        };

        mergeStorage (new Array (prepared, 'media'));
    }

    function updateImage (image) {
        var media, id, title, description, folder_id;
        
        media           = storage.media;
        id              = parseInt (image.id, 10);
        title           = image.title;
        description     = image.description;
        folder_id       = image.folder_id;
        
        $.each (media, function (inx, val) {
            if (parseInt (val.MediaItem.id, 10) === id) {
                val.MediaItem.title         = title;
                val.MediaItem.description   = description;
                val.MediaItem.folder_id     = folder_id;
                
                return false;
            }
        });
    }

    function addYoutubeVideo (medium) {
        var id, name, src, prepared,
            i;

        name    = medium.name;
        id      = medium.id;
        src     = medium.src;
        
        prepared    = {
            id:             id,
            name:           name,
            src:            src,
            category:       0,
            type:           'youtube'
            
        };

        mergeStorage (new Array (prepared, 'media'));
    }
    
    function mergeStorage (media, type) {
        var closure, found, 
            si, sl,
            mi, ml;
        
        type    = typeof type !== 'string' || type === 'media' ? 'media' : 'folders';
        ml      = media.length;
        sl      = storage[type].length;

        for (mi=0; mi<ml; mi++) {
            found   = false;
            
            for (si=0; si<sl; si++) {
                if (storage[type][si]['MediaItem'].id === media[mi].id) {
                    storage[type][si]['MediaItem']  = media[mi];
                    found                           = true;
                    break;
                }
            }
            
            if (!found) { 
                storage[type].push ({MediaItem: media[mi]}); 
            } 
        }
    }
    
    function removeFromStorage (id, type) {
        var i, l;
        
        type    = typeof type !== 'string' || type === 'media' ? 'media' : 'folders';
        l       = storage[type].length;
        
        for (i=0; i<l; i++) {
            if (storage[type][i].id === id) {
                delete storage[type][i];
            }
        }
    }
    
    return {
        setup: function (data) {
            if (typeof data.mediathek !== 'undefined') {
                if ($.isArray (data.mediathek) && data.mediathek.length > 0) {
                    mergeStorage (data.mediathek, 'media');
                }

                if ($.isArray (data.mediathek_folders) && data.mediathek_folders.length > 0) {
                    mergeStorage (data.mediathek_folders, 'folders');
                }
            }
        },
        
        show: function (context, initialMenu, mutliple, columnSrc, columnType, thumbnailSize) {
            storage.context = {
                model:              context,
                columnSrc:          columnSrc,
                columnType:         columnType,
                thumbnailSize:      typeof thumbnailSize === 'string' && $.inArray (thumbnailSize, new Array ('xs', 'sm', 'md', 'lg')) ? thumbnailSize : 'sm'
            };
            
            storage.initialMenu = initialMenu;

            np.observable.update ('Mediathek', -1, 'menu', initialMenu);
            np.observable.update ('Mediathek', -1, 'isVisible', true);
        },
        
        getContext: function ()     { return storage.context;                   },
        getMedia: function ()       { return storage.media;                     },
        getFolders: function ()     { return storage.folders;                   },
        getInitialMenu: function () { return storage.initialMenu;               },
        
        applyFolder: function (data) {
            var promise, request;
            
            promise     = np.Promise ();

            request = {
                mediathek: {update: {folder: {folder: data.folder, folder_id: data.folder_id}}},
                type:   'mediathek'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                mergeStorage (data, 'folders');
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise; 
        },
        
        removeFolder: function (folder_id) {
            var promise, request;
            
            promise     = np.Promise ();

            request = {
                mediathek: {del: {folder_id: folder_id}},
                type:   'mediathek'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                removeFolder (folder_id);
                
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise;            
        },
        
        saveFolder: function (folder) {
            var promise, request;
            
            promise     = np.Promise ();

            request = {
                mediathek: {add: {folder: folder}},
                type:   'mediathek'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                var params;
                
                params  = {id: rsp.data.id, folder: folder, folder_id: rsp.data.folder_id};
                
                addFolder (params);
                promise.then (params);
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise;
        },
        
        updateMediaItem: function (data) {
            var promise, request, type;
            
            promise     = np.Promise ();

            type        = data.type;
            
            request = {
                mediathek: {update: {media: data}},
                type:   'mediathek'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (rsp) {
                if (type === 'image') { updateImage (data); }
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise;            
        },
        
        saveMedia: function (file, folderID, model) {
            var promise, data;

            folderID    = typeof folderID === 'undefined' ? 1 : folderID;
            model       = typeof model === 'undefined' ?  false : model;

            if (file) {
                data    = new FormData ();
                data.append ('type', 'fupload');
                data.append ('file', file);
                data.append ('folder', folderID);
                data.append ('model', model);
            }

            promise     = np.Promise ();

            np.ajax ({
                type:           'POST',
                cache:          false,
                contentType:    false,
                processData:    false,
                url:            '/',
                data:           data,
                file:           file.name,
                test:           'test'
            }).then (function (rsp) {
                addImage (rsp.data.files);
                
                promise.then (rsp.data.files);
            }).fail (function (error) {
                promise.fail (error.data.responseJSON.files);
            }).pending (function (file, progress) {
                promise.pending (file, progress);
            });             

            return promise;
        },

        saveYoutubeVideo: function (options) {
            var promise, request;
            
            promise = np.Promise ();
            
            request = {
                mediathek: {add: {video: options}},
                type:   'mediathek'
            };

            np.ajax(
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (id) {
                addYoutubeVideo ({id: id, src: options.videoID, name: options.title});
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise;
        },
        
        setUploadFiles: function (files) {
            var mapped, 
                i, l;
            
            mapped  = new Array ();
            l       = files.length;
            
            for (i=0; i<l; i++) {
                mapped.push ({
                    MediaItem: {
                        id:             -1-i,
                        progress:       0,
                        name:           files[i].name,
                        src:            '',
                        type:           'image',
                        category:       0,

                        success:        false,
                        fail:           false
                    }
                });
            }
            
            uploadFiles = mapped;  
        },
        
        removeItem: function (id) {
            var promise, request;
            
            promise = np.Promise ();
            
            request = {
                mediathek: {
                    del: {id: id}
                },
                type: 'mediathek'
            };
            
            np.ajax (
            {
                type:           'POST',
                dataType:       'json',
                contentType:    'application/json',
                url:            '/',
                data:           request
            }).then (function (id) {
                removeFromStorage (id);
                promise.then ();
            }).fail (function (error) {
                promise.fail ();
            });
            
            return promise;            
        },
        
        getUploadFiles: function ()         { return uploadFiles;   }
    };
}()));