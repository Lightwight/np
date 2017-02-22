np.view.extend ('AdminArticleTaxOverviewView', {
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    removed: function (model) {
        this.remove ();
    }.observes ('removed').on ('change'),
    
    disableRemoveRow: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change')
});