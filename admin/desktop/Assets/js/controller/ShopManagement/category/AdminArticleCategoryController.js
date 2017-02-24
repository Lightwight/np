np.controller.extend ('AdminArticleCategoryController', (function () {
    var currentCategory;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleCategoryView',
        model:  function () {
            var category, categories;
            
            categories  = new Array ();
            
            np.model.Article_categories.findByID (getPage ()).each (function (row) {
                currentCategory = row;
                category        = row.getAll ();
            });
            
            np.model.Article_categories.findAll ().each (function (row) {
                if (row.getID () !== currentCategory.getID ()) {
                    categories.push (row.getAll ());
                }
            });
            
            category.sending    = false;
            category.success    = false;
            category.categories = categories;
            
            return {AdminArticleCategory: category};
        },
        
        events: {
            setKeyBeschreibung: function (view) {
                this.set ('KeyBeschreibung', view.get ('KeyBeschreibung'));
            },
            
            setSort: function (view) {
                this.set ('Sort', view.get ('Sort'));
            },
            
            setMainCategory: function (view) {
                this.set ('KeyOberkategorie', view.get ('main_category'));
            },
            
            saveCategory: function () {
                var _t;
                
                _t  = this;

                currentCategory.setKeyOberkategorie (_t.get ('KeyOberkategorie'));
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