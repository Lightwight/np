np.controller.extend ('AdminArticleTaxAddController', (function () {
    var model, retModel, renderView, anchor;
    
    model       = 'Taxes';
    retModel    = 'AdminArticleTax';
    renderView  = 'AdminArticleTaxOverviewView';
    anchor      = '#admin-article-tax-add';
    
    function addNewRow (rsp) {
        var template, html, model;
        
        model           = {};
        model[retModel] = rsp.getAll ();
        
        template        = np.handlebars.getTemplate (renderView);
        html            = np.parseHandlebar (template, model);
        html            = $($(html)[0]);

        $(html).insertBefore (anchor);
    }
    
    return {
        view:   'AdminArticleTaxAddView',
        model:  function () {
            var _def, _row;

            _def    = np.model[model].definition ();
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

            return {ArticleUnit: _row};
        },

        events: {
            setTax: function (view) {
                var tax;
                
                tax = parseInt (view.get ('tax'), 10);
                if (isNaN (tax)) { tax  = '';   }
                
                this.set ('tax', tax);
            },

            saveRow: function () {
                var newRow, _t;

                _t      = this;
                newRow  = np.jsonClone (this.getAll ());

                delete newRow.id;
                delete newRow.sending;
                delete newRow.success;
                delete newRow.failed;

                _t.set ('sending', true);

                np.model[model].add (newRow);

                np.model[model].save ()
                .then (function (rsp) {
                    _t.set ('sending', false);
                    _t.set ('tax', '');
                    
                    addNewRow (rsp);

                })
                .fail (function () {
                    _t.set ('sending', false);
                });
            }
        }
    };
}()));