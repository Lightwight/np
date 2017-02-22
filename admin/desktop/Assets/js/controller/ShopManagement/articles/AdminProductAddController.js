np.controller.extend ('AdminProductAddController', (function () {
    function addNewArticle (rsp) {
        var template, html, model;
        
        
        model  = {
            AdminProduct: rsp.getAll ()
        };        
        
        template    = np.handlebars.getTemplate ('AdminProductOverviewView');
        html        = np.parseHandlebar (template, model);
        html        = $($(html)[0]);

        $(html).insertBefore ('#admin-article-add');
    }
    
    return {
        view:   'AdminProductAddView',
        model:  function () {
            var _def, _row;

            _def    = np.model.Products.definition ();
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

            return {Product: _row};
        },

        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },

            saveArticle: function () {
                var newRow, _t;

                _t      = this;
                newRow  = np.jsonClone (this.getAll ());

                delete newRow.id;
                delete newRow.sending;
                delete newRow.success;
                delete newRow.failed;

                _t.set ('sending', true);

                np.model.Products.add (newRow);

                np.model.Products.save ()
                .then (function (rsp) {
                    _t.set ('sending', false);
                    _t.set ('name', '');
                    
                    addNewArticle (rsp);

                })
                .fail (function () {
                    _t.set ('sending', false);
                });
            }
        }
    };
}()));