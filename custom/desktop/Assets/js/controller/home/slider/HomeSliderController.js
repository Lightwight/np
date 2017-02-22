np.controller.extend ('HomeSliderController', {
    view:       'HomeSliderView',
    orderBy:    'order',

    model:  function () {
        var slides;
        
        slides  = np.slider.getSlides ();
        
        return {HomeSliders: {
            id:     -1,
            slides: slides
        }};
    }
});