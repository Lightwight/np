np.controller.extend ('AdminArticleManufacturerController', (function () {
    var currentManufacturer;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }

    return {
        view:   'AdminArticleManufacturerView',
        model:  function () {
            var manufacturer;
            
            np.model.Article_manufacturers.findByManufacturerId (getPage ()).each (function (row) {
                currentManufacturer = row;
                manufacturer        = row.getAll ();
            });
            
            manufacturer.sending    = false;
            manufacturer.success    = false;
            
            return {AdminArticleManufacturer: manufacturer};
        },
        
        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },
            
            setCountry: function (view) {
                this.set ('country', view.get ('geo'));
            },
            
            setCity: function (view) {
                this.set ('city', view.get ('city'));
            },
            
            setPostal: function (view) {
                this.set ('postal', view.get ('postal'));
            },
            
            setStreet: function (view) {
                this.set ('street', view.get ('street'));
            },
            
            setStreetNumber: function (view) {
                this.set ('street_number', view.get ('street_number'));
            },
            
            saveManufacturer: function () {
                var _t;
                
                _t  = this;

                currentManufacturer.setName (_t.get ('name'));
                currentManufacturer.setCountry (_t.get ('country'));
                currentManufacturer.setPostal (_t.get ('postal'));
                currentManufacturer.setCity (_t.get ('city'));
                currentManufacturer.setStreet (_t.get ('street'));
                currentManufacturer.setStreetNumber (_t.get ('street_number'));
                
                _t.set ('sending', true);
                
                currentManufacturer
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