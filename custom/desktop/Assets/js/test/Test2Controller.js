np.controller.extend ('Test2Controller', {
    view:   'Test2View',
    model:  function () {
        return {Test: this};
    },
    
    events: {
        changeText: function (node) {
            this.set ('text', node.get ('text'));
        }
    }
});