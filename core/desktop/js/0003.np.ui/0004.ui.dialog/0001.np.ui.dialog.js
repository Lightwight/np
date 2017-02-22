np.module ('ui.dialog', (function () {
    function createSuccessDialog (options) {
        var title, message, customButtons, buttons, defaults,
            i, l;
        
        title           = options.title;
        message         = options.message;
        customButtons   = options.buttons;
        defaults        = options.defaults;
        
        buttons         = new Array ();
        
        if (customButtons) {
            l   = customButtons.length;
            
            for (i=0; i<l; i++) {
                buttons.push (customButtons[i]);
            }
        }
        
        if (defaults) {
            buttons.push ({
                label:      'OK',
                icon:       'glyphicon glyphicon-check',
                cssClass:   'btn-primary',
                hotkey:     $.ui.keyCode.ENTER,
                action:     function (dlg) { dlg.close (); }
            });
        }
        
        BootstrapDialog.show({
            type:       BootstrapDialog.TYPE_SUCCESS,
            closable:   false,
            title:      title,
            message:    message,
            buttons:    buttons,
            nl2br:      false
        });                   
    }
    
    function createWarningDialog (options) {
        var title, message, customButtons, buttons, defaults,
            i, l;
        
        title           = options.title;
        message         = options.message;
        customButtons   = options.buttons;
        defaults        = options.defaults;
        
        buttons         = new Array ();
        
        if (customButtons) {
            l   = customButtons.length;
            
            for (i=0; i<l; i++) {
                buttons.push (customButtons[i]);
            }
        }
        
        if (defaults) {
            buttons.push ({
                label:      'OK',
                icon:       'glyphicon glyphicon-check',
                cssClass:   'btn-primary',
                action:     function (dlg) { dlg.close (); }
            });
        }
        
        BootstrapDialog.show({
            type:       BootstrapDialog.TYPE_WARNING,
            closable:   false,
            title:      title,
            message:    message,
            buttons:    buttons,
            nl2br:      false
        });  
    }
    
    function createErrorDialog (options) {
        var title, message, customButtons, buttons, defaults,
            i, l;
        
        title           = options.title;
        message         = options.message;
        customButtons   = options.buttons;
        defaults        = options.defaults;
        
        buttons         = new Array ();
        
        if (customButtons) {
            l   = customButtons.length;
            
            for (i=0; i<l; i++) {
                buttons.push (customButtons[i]);
            }
        }
        
        if (defaults) {
            buttons.push ({
                label:      'OK',
                icon:       'glyphicon glyphicon-check',
                cssClass:   'btn-primary',
                action:     function (dlg) { dlg.close (); }
            });
        }
        
        BootstrapDialog.show({
            type:       BootstrapDialog.TYPE_DANGER,
            closable:   false,
            title:      title,
            message:    message,
            buttons:    buttons,
            nl2br:      false
        });           
    }
    
    return {
        show:   function (type, title, message, buttons, defaultButton) {
            var options, types;
            
            defaultButton   = typeof defaultButton === 'boolean' ? defaultButton : true;
            
            types           = new Array ('error', 'warning', 'information', 'success' , 'default');
            type            = typeof type === 'string' && types.indexOf (type) > -1 ?  type : 'default';
            
            options = {
                title:      typeof title === 'string' ? title : 'NO TITLE GIVEN',
                message:    typeof message === 'string' ? message: 'NO MESSAGE GIVEN',
                buttons:    $.isArray (buttons) && buttons.length > 0 ? buttons: false,
                defaults:   defaultButton
            };
            
            switch (type) {
                case 'success':
                    createSuccessDialog (options);
                    break;
                case 'error':
                    createErrorDialog (options);
                    break;
                case 'warning':
                    createWarningDialog (options);
                    break;
            }
        }
    };
}()));