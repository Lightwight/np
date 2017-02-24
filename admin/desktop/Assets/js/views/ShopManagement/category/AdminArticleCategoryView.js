np.view.extend ('AdminArticleCategoryView', {
    didInsert: function () {
        $('#nice_main_category').niceSelect ();        
    },
    
    sending: function (model) {
        if (model.get ('sending')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('sending').on ('change'),
    
    disableSaveCategory: function (model) {
        if (model.get ('sending')) {
            this.addClass ('disabled');
        } else {
            this.removeClass ('disabled');
        }
    }.observes ('sending').on ('change'),
    
    setMainCategory: function (model) {
        this.find ('option').each (function () {
            $(this).prop ('selected', '');
        });

        this.find ('option:nth-child('+(model.get ('KeyOberkategorie') + 1)+')').prop ('selected', 'selected');
    }
});