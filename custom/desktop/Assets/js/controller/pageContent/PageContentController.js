np.controller.extend ('PageContentController', {
    view:   'PageContentView',
    model:  function () {
        var content;
        
        content = new Array ();
        
        np.model.Page_content.findAll ().each (function (row) {
            content = row.getAll ();
        });
        
        return {PageContent: content};
    }
});