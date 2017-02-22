np.view.extend ('MediathekMediaEditView', {
    didInsert: function () {
        $('#mediathek-edit-folder-selection').niceSelect ();
    },
    
    saving: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    setTitle: function (model) {
        this.val (model.get ('title'));
    },
    
    setDescription: function (model) {
        this.val (model.get ('description'));
    },
    
    setFolderID: function (model) {
        var id;

        id  = parseInt (model.get ('folder_id'), 10);
        
        this.find ('option').each (function () {
            if (parseInt ($(this).val (), 10) === id) {
                $(this).prop ('selected', 'selected');
            } else {
                $(this).prop ('selected', '');
            }
        });        
    },    
    
    setSrc: function (model) {
        var src;
        
        src     = model.get ('src') + model.get ('id') + model.get ('name');
        
        this.attr ('src', src);
    },
    
    setSrcThumbLG: function (model) {
        var src;
        
        src     = model.get ('src') + model.get ('id') + model.get ('thumb_lg');
        
        this.attr ('src', src);
    },
    
    setSrcThumbMD: function (model) {
        var src;
        
        src     = model.get ('src') + model.get ('id') + model.get ('thumb_md');
        
        this.attr ('src', src);
    },
    
    setSrcThumbSM: function (model) {
        var src;
        
        src     = model.get ('src') + model.get ('id') + model.get ('thumb_sm');
        
        this.attr ('src', src);
    },
    
    setSrcThumbXS: function (model) {
        var src;
        
        src     = model.get ('src') + model.get ('id') + model.get ('thumb_xs');
        
        this.attr ('src', src);
    }
});