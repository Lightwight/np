np.controller.extend ('AdminArticleCategoryAddController', (function () {
    function addNewCategory (rsp) {
        var template, html, model;
        
        
        model  = {
            AdminArticleCategory: rsp.getAll ()
        };        
        
        template    = np.handlebars.getTemplate ('AdminArticleCategoryOverviewView');
        html        = np.parseHandlebar (template, model);
        html        = $($(html)[0]);

        $(html).insertBefore ('#admin-article-category-add');
    }
    
    return {
        view:   'AdminArticleCategoryAddView',
        model:  function () {
            var _def, _row;

            _def    = np.model.Article_categories.definition ();
            _row    = {
                id:         -1,
                sending:    false,
                success:    false,
                failed:     false
            };

            $.map (_def, function (v, k) {
                if (k !== 'id') { 
                    _row[k] = v === 'number' ? 0 : ''; 
                }
            });

            return {ArticleCategory: _row};
        },

        events: {
            setName: function (view) {
                this.set ('KeyBeschreibung', view.get ('KeyBeschreibung'));
            },

            setSort: function (view) {
                this.set ('Sort', parseInt (view.get ('Sort'), 10));
            },

            saveCategory: function () {
                var newRow, _t;

                _t      = this;
                newRow  = np.jsonClone (this.getAll ());

                delete newRow.id;
                delete newRow.sending;
                delete newRow.success;
                delete newRow.failed;

                _t.set ('sending', true);

                np.model.Article_categories.add (newRow);

                np.model.Article_categories.save ()
                .then (function (rsp) {
                    _t.set ('sending', false);
                    _t.set ('KeyBeschreibung', '');
                    _t.set ('Sort', 0);
                    
                    addNewCategory (rsp);

                })
                .fail (function () {
                    _t.set ('sending', false);
                });
            }
        }
    };
}()));