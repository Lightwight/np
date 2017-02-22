np.controller.extend ('AdminArticleUnitController', (function () {
    var currentUnit;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleUnitView',
        model:  function () {
            var unit;
            
            np.model.Article_units.findByUnitId (getPage ()).each (function (row) {
                currentUnit     = row;
                unit            = row.getAll ();
            });
            
            unit.sending    = false;
            unit.success    = false;
            
            return {AdminArticleUnit: unit};
        },
        
        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },
            
            saveUnit: function () {
                var _t;
                
                _t  = this;
               
                currentUnit.setName (_t.get ('name'));
                
                _t.set ('sending', true);
                
                currentUnit
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