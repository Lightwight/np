np.module ('languageSwitch', {
    switchLanguage: function (language) {
        var request;
        
        request = {
            type:   'lang',
            lang:   language
        };
        
        np.ajax ({
            type:       'POST',
            dataType:   'json',
            url:        '/',
            data:       request
        })
        .then (function () {
            np.routeTo ();
        })
        .fail (function () {
            /* TODO: show user message i.e. something went wrong! */
        });
    }
});