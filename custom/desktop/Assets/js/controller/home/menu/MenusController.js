np.controller.extend ('MenusController', {
    view:   'MenusView',
    model:  function () {
        var menus;
        
        menus   = new Array ();
        
        np.model.Menus.findAll ().orderBy ('id').each (function (row) {
            menus.push (row.getAll ());
        });
        
        return {Menus: menus};
    }
});