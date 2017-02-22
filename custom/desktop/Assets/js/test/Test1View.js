np.view.extend ('Test1View', {
    refreshing: function (view) {
        var _this, timFadeOut, timRemove;
        _this       = this;
        
        timFadeOut  = 'node'+_this.data('node')+'_fadeOut';
        timRemove   = 'node'+_this.data('node')+'_rem';

        if (_this.hasClass('fadeOut')) {
            np.timeout.clear (timFadeOut);
            np.timeout.clear (timRemove);

            _this.removeClass ('fadeOut');
        } 

        if (!_this.hasClass ('fadeIn')) { _this.addClass ('fadeIn'); }

        np.timeout.set (timFadeOut, function () {
            _this.addClass ('fadeOut');
            _this.removeClass ('fadeIn');
            
            np.timeout.set (timFadeOut, function () {
                _this.addClass ('fadeIn');
                _this.removeClass ('fadeOut');
            }, 450);        
        }, 450);     
    }.observes ('text').on ('change')
});