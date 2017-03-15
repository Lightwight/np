/*
*   This software called - np - is a lightwight MVP Framework for building web applications and
*   was developed by Christian Peters
*
*   Copyright (C) 2016 Christian Peters
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
*   Contact: Christian Peters <c.peters.eshop@gmail.com>
*/

np.view.extend ('CtaNotificationView', (function () {
    var timer;
    
    timer   = false;
    
    return {
        setNotificationType: function (model) {
            this.removeClass ('success');
            this.removeClass ('fail');

            this.addClass (model.get ('type'));
        }.observes ('type').on ('change'),

        show: function (model) {
            var _t, timeout;

            _t      = this;
            timeout = model.get ('timeout');
            
            if (timer ) {
                this.removeClass ('show');
                
                window.clearTimeout (timer);
            }
            
            if (model.get ('show')) {
                this.addClass ('show');

                timer = window.setTimeout (function () {
                    _t.removeClass ('show');
                    
                    timer   = false;
                }, timeout);
            }
        }.observes ('show').on ('change'),

        hide: function (model) {
            if (model.get ('hide')) {
                this.removeClass ('show');
            }
        }.observes ('hide').on ('change'),

        setMessage: function (model) {
            this.html (model.get ('message'));
        }.observes ('message').on ('change')
    };
})());