np.controller.extend ('AdminArticleTaxController', (function () {
    var currentTax;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleTaxView',
        model:  function () {
            var tax;
            
            np.model.Taxes.findByTaxId (getPage ()).each (function (row) {
                currentTax  = row;
                tax         = row.getAll ();
            });
            
            tax.sending    = false;
            tax.success    = false;
            
            return {AdminArticleTax: tax};
        },
        
        events: {
            setTax: function (view) {
                this.set ('tax', view.get ('tax'));
            },
            
            saveTax: function () {
                var _t;
                
                _t  = this;
               
                currentTax.setTax (_t.get ('tax'));
                
                _t.set ('sending', true);
                
                currentTax
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