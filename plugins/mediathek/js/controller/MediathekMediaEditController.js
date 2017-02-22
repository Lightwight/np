np.controller.extend ('MediathekMediaEditController', {
    view:   'MediathekMediaEditView',
    model:  function () {
        this.folders        = np.mediathek.getFolders ();
        this.title          = typeof this.title === 'undefined' ? '' : this.title;
        this.description    = typeof this.description === 'undefined' ? '' : this.description;
        
        this.sending        = false;
        this.success        = false;

        return {MediaEditItem: this};
    },
    
    events: {
        setTitle: function (view) {
            this.set ('title', view.get ('title'));
        },
        
        setDescription: function (view) {
            this.set ('description', view.get ('description'));
        },
        
        setFolderID: function (view) {
            this.set ('folder_id', view.get ('fse_id'));
        },
        
        applyChanges: function (view) {
            var _t, id, title, description, folder_id;
            
            _t          = this;
            
            id          = parseInt (_t.get ('id'), 10);
            title       = _t.get ('title');
            description = _t.get ('description');
            folder_id   = parseInt (_t.get ('folder_id'), 10);

            _t.set ('sending', true);
            
            np.mediathek.updateMediaItem ({
                type:           'image',
                id:             id,
                title:          title,
                description:    description,
                folder_id:      folder_id
            })
            .then (function () {
                _t.set ('sending', false);
                _t.set ('success', true);
                
                view.rerender ('MediathekMediaView');
            })
            .fail (function () {
                _t.set ('sending', false);
                _t.set ('success', false);
            });
        }
    }
});