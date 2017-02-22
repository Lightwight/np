np.view.extend ('AdminProductOverviewView', {
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    disableUndeleteProduct: function (model) {
        var isDeleted;
        
        isDeleted   = parseInt (model.get ('deleted'), 10) === 1;

        if (isDeleted) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
        
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }
    .observes ('sending').on ('change')
    .observes ('deleted').on ('change'),
    
    disableRemoveProduct: function (model) {
        var isDeleted;
        
        isDeleted   = parseInt (model.get ('deleted'), 10) === 1;
        
        if (isDeleted) {
            this.addClass ('no-display');
        } else {
            this.removeClass ('no-display');
        }
        
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }
    .observes ('sending').on ('change')
    .observes ('deleted').on ('change'),
    
    notRemoved: function (model) {
        var message, buttons;
        
        if (!model.get ('removed')) {
            message     = 'Der Artikel konnte nicht entfernt werden.<br>';
            message    += 'Bitte kontaktieren Sie Ihren Systemadministrator.';
            
            vex.dialog.alert ({className: 'vex-theme-top', message: message});
        }
    }.observes ('removed').on  ('change'),
    
    removed: function (model) {
        var _t;
        
        _t  = this;
        
        if (model.get ('removed')) {
            _t.fadeOut (350, function () {
                _t.remove ();
            });
            
        }
    }.observes ('removed').on ('change'),
    
    isDeleted: function (model) {
        var isDeleted;
        
        isDeleted   = parseInt (model.get ('deleted'), 10) === 1;

        if (isDeleted) {
            this.removeClass ('no-display');
        } else {
            this.addClass ('no-display');
        }
    }.observes ('deleted').on ('change')
});