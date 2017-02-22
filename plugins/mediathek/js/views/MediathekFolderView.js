np.view.extend ('MediathekFolderView', {
    isApplying: function (model) {
        if (model.get ('applying')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('applying').on ('change'),
    
    hasApplies: function (model) {
        if (model.get ('applied')) {
            /* TODO: Message to user: successfull applied */
        } else {
            /* TODO: Message to user: error on save */
        }
    }.observes ('applied').on ('change'),
    
    isRemoving: function (model) {
        if (model.get ('removing')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('removing').on ('change'),
    
    hasRemoved: function (model) {
        if (model.get ('removed')) {
            np.observable.removeContext ('MediathekFolder', model.get ('id'));
            
            this.remove ();
        } else {
            /* TODO: VEX MODAL - ERROR ON Remove */
        }
    }.observes ('removed').on ('change')
});