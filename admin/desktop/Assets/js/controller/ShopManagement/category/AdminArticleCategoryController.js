np.controller.extend ('AdminArticleCategoryController', (function () {
    var currentCategory;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleCategoryView',
        model:  function () {
            var category;
            
            np.model.Article_categories.findByID (getPage ()).each (function (row) {
                currentCategory = row;
                category        = row.getAll ();
            });
            
            category.sending    = false;
            category.success    = false;
            
            return {AdminArticleCategory: category};
        },
        
        events: {
            setKeyBeschreibung: function (view) {
                this.set ('KeyBeschreibung', view.get ('KeyBeschreibung'));
            },
            
            setSort: function (view) {
                this.set ('Sort', view.get ('Sort'));
            },
            
            saveCategory: function () {
                var _t;
                
                _t  = this;
               
                currentCategory.setKeyBeschreibung (_t.get ('KeyBeschreibung'));
                currentCategory.setSort (_t.get ('Sort'));
                
                _t.set ('sending', true);
                
                currentCategory
                .save ()
                .then (function () {
                    _t.set ('sending', false);
                    _t.set ('success', true);
                })
                .fail (function () {
                    _t.set ('sending', false);
                    _t.set ('success', false);
                });
            }
        }
    };
})());