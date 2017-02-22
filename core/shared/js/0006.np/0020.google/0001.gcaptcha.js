var recaptchaCallback = function () {
    var subscribers;
            
    subscribers = np.gcaptcha.getSubscribers ();
    
    $.each (subscribers, function (inx, captcha) {
        var nodeID, cData, parsed;
        
        nodeID      = captcha[0];
        cData       = captcha[1];
        parsed      = cData._parsed;
        
        if (!parsed) {
            np.gcaptcha.setIsParsed (inx);
            
            window.grecaptcha.render ('recaptcha-'+nodeID, {
                sitekey:    np.INITIAL_DATA.captcha,

                callback:   function (rsp) {
                    var subscribers;

                    subscribers = np.gcaptcha.getSubscribers ();

                    $.each (subscribers, function (inx, data) {
                        var view, subscriber, success;

                        view        = data[1]._view;
                        subscriber  = data[1]._subscriber;
                        success     = data[1]._success;

                        success.call (subscriber, {view: view, response: rsp});
                    });

                },

                'expired-callback': function (rsp) {
                    var subscribers;

                    subscribers = np.gcaptcha.getSubscribers ();

                    $.each (subscribers, function (inx, data) {
                        var view, subscriber, expired;

                        view        = data[1]._view;
                        subscriber  = data[1]._subscriber;
                        expired     = data[1]._expired;

                        expired.call (subscriber, {view: view, response: rsp});
                    });
                }
            }); 
        }
    });
};

np.module ('gcaptcha', (function () {
    var subscribers, scriptAppended;
    
    subscribers     = new Array ();
    scriptAppended  = false;
    
    function appendScript () {
        if (!scriptAppended) {
            scriptAppended  = true;
            
            $('body').append ('<script src=\"https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit\" async defer></script>');    
        }
    }
    
    return {
        setIsParsed: function (inx) {
            if (typeof subscribers[inx] !== 'undefined' && typeof subscribers[inx]['_parsed'] !== 'undefined') {
                subscribers[inx]._parsed = true;
            }
        },
        
        addCaptcha: function (nodeID, context, subscriber) {
            var selector, view, viewNodeID, viewName, viewManip, 
                controller, captchaFailed, captchaSuccess, captchaExpired;
            
            appendScript ();

            selector        = $('[data-node="'+nodeID+'"]');
            selector.append ('<div id="recaptcha-'+nodeID+'" style="transform:scale(1);transform-origin:0;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:0;transform-origin:0 0;"></div>');

            view            = selector.parents ('[data-type="view"]:first');
            viewNodeID      = parseInt (view.data ('node'), 10);
            viewName        = view.data ('handle');
            viewManip       = np.view.manip (viewNodeID, context);;

            controller      = np.controller.getByView (viewName);

            captchaFailed   = controller && typeof controller.events !== 'undefined' && typeof controller.events['captchaFail'] === 'function' ? controller.events['captchaFail'] : function () {};
            captchaSuccess  = controller && typeof controller.events !== 'undefined' && typeof controller.events['captchaSuccess'] === 'function' ? controller.events['captchaSuccess'] : function () {};
            captchaExpired  = controller && typeof controller.events !== 'undefined' && typeof controller.events['captchaExpire'] === 'function' ? controller.events['captchaExpire'] : function () {};
    
            subscribers.push (new Array (nodeID, {
                _subscriber:    subscriber,
                _view:          viewManip,
                _success:       captchaSuccess,
                _failed:        captchaFailed,
                _expired:       captchaExpired,
                _parsed:        false
            }));
        },
        
        getSubscribers: function () {
            return subscribers;
        }
    };
})());