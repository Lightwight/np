np.view.extend ('AdminPluginGalleryView', {
    setContent: function (model) {
        var tmp, content;
                
        tmp             = document.createElement ('div');
        content         = model.get ('content');
        tmp.innerHTML   = content.replace (/\<br\>/gim, "\n");

        this.val (tmp.textContent || tmp.innerText || '');
    },
    
    setMediaSrc: function (model) {
        var src, thumb, type;

        src     = model.get ('src');
        thumb   = model.get ('thumbnail');
        type    = model.get ('type');

        if (type === 'youtube' && src.length > 0) {
            this.css ('background-image', '');
            this.css ('color', '');
            
            this.html ('<iframe class="youtube-iframe-preview" type="text/html" width="200" height="200" src="https://www.youtube.com/embed/'+src+'?autoplay=0&origin=http://hunde.de" frameborder="0"/>');
        } else if (thumb.length > 0) {
            this.css ('background-image', 'url('+thumb+')');
            this.css ('color', '#FFFFFF');
            
            this.html ('<span class="media-src">'+src+'</span>');            
        } else {
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
    
    enableGalleryUp: function (model) {
        var order;
        
        order   = model.get ('order');
        
        if (order === 1) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('order').on ('change'),

    changedOrder: function (model) {
        var position, order;
        
        position    = this.index () + 1;
        order       = model.get ('order');

        if (position !== order) {
            np.observable.update ('AdminPluginGallery', model.get ('id'), 'order', position);
        }
    }.observes ('changed_order').on ('change'),

    enableGalleryDown: function (model) {
        var len, order;

        len     = $('#admin-plugin-gallery-sortarea .admin-plugin-gallery-edit').length;
        order   = model.get ('order');

        if (order === len) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('order').on ('change'),
    
    orderChanged: function (model) {
        var _t, container, position, order, len;
        
        container   = this.parents ('*:first');
        position    = this.index () + 1;
        order       = model.get ('order');
        len         = this.parents ('*:first').find ('.admin-plugin-gallery-edit').length;
        _t          = this;
        
        if (position !== order) {
            this.addClass ('fadeOut');
            window.setTimeout (function () { _t.removeClass ('fadeOut');},450);

            if (position > order) {
                this.insertBefore (container.find ('.admin-plugin-gallery-edit:eq('+(order-1)+')'));
            } else {
                this.insertAfter (container.find ('.admin-plugin-gallery-edit:eq('+(order-1)+')'));
            }
        }
    }.observes ('order').on ('change'),
    
    deleted: function (model) {
        var title, message, buttons;

        if (model.get ('successDeleted') === true) {
            this.remove ();
        } else {
            title       = 'Ups!';

            message     = 'Die Gallerie konnte nicht gelöscht werden.<br><br>';
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
    }.observes ('successDeleted').on ('change')
});