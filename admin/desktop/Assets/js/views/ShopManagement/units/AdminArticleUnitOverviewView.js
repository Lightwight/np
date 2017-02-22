np.view.extend ('AdminArticleUnitOverviewView', {
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    disabledRemoveProduct: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),
    
    notRemoved: function (model) {
        var message, buttons;
        
        if (!model.get ('removed')) {
            message     = 'Die Artikeleinheit konnte nicht entfernt werden.<br>';
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
    }.observes ('removed').on ('change')
});