np.controller.extend ('AdminArticleManufacturerAddController', (function () {
    var model, retModel, renderView, anchor;
    
    model       = 'Article_manufacturers';
    retModel    = 'AdminArticleManufacturer';
    renderView  = 'AdminArticleManufacturerOverviewView';
    anchor      = '#admin-article-manufacturer-add';
    
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
        view:   'AdminArticleManufacturerAddView',
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

            return {ArticleManufacturer: _row};
        },

        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
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
                    _t.set ('name', '');
                    
                    addNewRow (rsp);

                })
                .fail (function () {
                    _t.set ('sending', false);
                });
            }
        }
    };
}()));