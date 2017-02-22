np.controller.extend ('Test1Controller', {
    view:   'Test1View',
    model:  function () {
        return {Test: this};
    },
    
    events: {
        changeText: function (node) {
            this.set ('text', node.get ('text'));
        },
        
        rerender: function (view) {
            view.rerender (null, true);
        }
    }    
});