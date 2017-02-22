np.view.extend ('AdminProductAddView', {
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('sending');
        } else {
            this.removeClass ('sending');
        }
    }.observes ('sending').on ('change'),
    
    disableSaveArticle: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change')
});