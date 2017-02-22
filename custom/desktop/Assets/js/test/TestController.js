np.controller.extend ('TestController', {
    view:   'TestView',
    model:  function () {
        var m;
        
        m   = new Array ({id: 1, text: "text1"});
        
        return {Tests: m};
    }
});