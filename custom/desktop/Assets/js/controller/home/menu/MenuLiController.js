np.controller.extend ('MenuLiController', {
    view:   'MenuLiView',
    model:  function () {
        return {Menu: this};
    }
});