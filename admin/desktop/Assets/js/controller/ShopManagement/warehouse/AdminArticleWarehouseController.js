np.controller.extend ('AdminArticleWarehouseController', (function () {
    var currentWarehouse;
    
    function getPage ()
    {
        return parseInt (np.route.getBookmarkItem (), 10);
    }
    
    return {
        view:   'AdminArticleWarehouseView',
        model:  function () {
            var warehouse;
            
            np.model.Article_warehouses.findByWarehouseId (getPage ()).each (function (row) {
                currentWarehouse    = row;
                warehouse           = row.getAll ();
            });
            
            warehouse.sending    = false;
            warehouse.success    = false;
            
            return {AdminArticleWarehouse: warehouse};
        },
        
        events: {
            setName: function (view) {
                this.set ('name', view.get ('name'));
            },
            
            saveWarehouse: function () {
                var _t;
                
                _t  = this;
               
                currentWarehouse.setName (_t.get ('name'));
                
                _t.set ('sending', true);
                
                currentWarehouse
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