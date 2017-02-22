np.hook ('ajaxLoader', 'route', function (options) {
    var loader, $loader;
    
    loader  = '<div id="ajaxLoader"></div>';
    
    if ($('#ajaxLoader').length === 0) { $('body').prepend (loader);    }
    
    $loader = $('#ajaxLoader');
    
    $loader.stop (true, true);
    
    $loader.animate ({width: options.perc+'%'}, 250);
    
    if (options.perc < 100) {
        if ($loader.css ('display') !== 'block')    {
            $loader.css ('display', 'block');
        } 
    } else {
        if ($loader.css ('display') !== 'none')    {
            $loader.fadeOut (450, function () {
                $loader.css ('display', 'none');
                $loader.css ('width', '0');
            });
        } 
    }
});