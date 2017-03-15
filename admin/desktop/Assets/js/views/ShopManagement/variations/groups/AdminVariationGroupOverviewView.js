np.view.extend ('AdminVariationGroupOverviewView', {
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    disableUndeleteGroup: function (model) {
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
    
    disableRemoveGroup: function (model) {
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
    }.observes ('deleted').on ('change'),
    
    onSuccess: function (model) {
        var success;
        
        success = model.get ('success');
        
        if (success) {
            np.notify (success).asSuccess ().timeout (1500).show ();
        }
    }.observes ('success').on ('change'),
    
    onError: function (model) {
        var error;
        
        error   = model.get ('error');
        
        if (error) {
            np.notify (error).asError ().timeout (4000).show ();
        }
    }.observes ('error').on ('change')
});