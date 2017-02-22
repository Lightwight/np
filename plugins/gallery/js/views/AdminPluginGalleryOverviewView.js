np.view.extend ('AdminPluginGalleryOverviewView', {
    saving: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    savingNewGallery: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    disableSaveNewGallery: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),
    
    disableSaveGallery: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),
    
    setMediaSrc: function (model) {
        var src, thumb, type;

        src     = model.get ('src');
        type    = model.get ('type');
        thumb   = model.get ('thumbnail');

        if (type === 'youtube' && src.length > 0) {
            this.css ('background-image', '');
            this.css ('color', '');
            
            this.html ('<iframe class="youtube-iframe-preview" type="text/html" width="200" height="200" src="https://www.youtube.com/embed/'+src+'?autoplay=0&origin=http://hunde.de" frameborder="0"/>');
        } else if (thumb && thumb.length > 0) {
            this.html ('');
            this.css ('background-image', 'url('+thumb+')');
            this.css ('color', '#FFFFFF');
        } else {
            this.html ('Vorschau');
            this.css ('background-image', '');
            this.css ('color', '');
        } 
    }.observes ('src').on ('change'),
    
    showError: function (model) {
        var code, title, message, buttons;
        
        code    = model.get ('error');
        
        if (code !== false) {
            title       = 'Ups!';

            message     = 'Die Gallerie konnte nicht gespeichert werden.<br><br>';
            message    += 'Bitte überprüfen Sie Ihre Internetverbindung und wiedeholen Sie den Vorgang.<br><br>';
            message    += 'Sollte der Fehler erneut auftauchen, dann setzen Sie sich bitte mit Ihrem Systemadministrator in Verbindung.';

            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
            );

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons
            });
        }
    }.observes ('error').on ('change'),
    
    showAddGallery: function (model) {
        if (model.get ('addGallery')) {
            this.addClass ('fadeIn');
        } else {
            this.removeClass ('fadeIn');
        }
    }.observes ('addGallery').on ('change'),
    
    showAddButton: function (model) {
        if (model.get ('addGallery')) {
            this.addClass ('fadeOut');
        } else {
            this.removeClass ('fadeOut');
        }
    }.observes ('addGallery').on ('change')
});