np.view.extend ('HomeSliderView', {
    didInsert: function () {
        $('#home-slider').slideme ({
            pagination:     false,
            arrows:         true,
            css3:           true,
            labels:         {
                prev:   '<',
                next:   '>'
            },
            loop:           true,
            transition:     'fade',
            touch:          true
        });
    },
    
    sliderEnabled: function (model) {
        if (model.get ('slides').length === 0) {
            $('#home-slider').css ('display', 'none');
        }
    }.observes ('slides').on ('change')
});