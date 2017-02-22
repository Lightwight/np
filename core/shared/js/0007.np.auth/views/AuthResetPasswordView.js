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

np.view.extend ('AuthResetPasswordView', {
    badPassword: function (model) {
        var len, strength;
        
        if (!model.get ('password').empty ()) {
            len         = model.get ('password').length;
            strength    = model.get ('password').strength ();

            if (len < 4 || strength < 2) {
                if (this.hasClass ('tooltip')) {
                    this.html (len < 4 ? 'Das Passwort muss mindestens 4 Zeichen lang sein.' : 'Zu schwaches Passwort. Verwenden Sie Sonderzeichen (_, #, $, ...).');
                }
                
                this.addClass ('show');
            } else {
                this.removeClass ('show');                
            }
        } else {
            this.removeClass ('show');
        }
    }.observes ('password').on ('change'),
    
    goodPassword: function (model) {
        var len, strength;

        if (!model.get ('password').empty ()) {
            len         = model.get ('password').length;
            strength    = model.get ('password').strength ();

            if (len >= 4 && strength >= 2) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        } else {
            this.removeClass ('show');
        }
    }.observes ('password').on ('change'),
    
    badPasswordConfirmation: function (model) {
        var pw, pw_conf;
        
        pw      = model.get ('password');
        pw_conf = model.get ('password_confirmation');
        
        if (!pw_conf.empty () && pw !== pw_conf) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');            
        }
    }
    .observes ('password_confirmation').on ('change')
    .observes ('password').on ('change'),
    
    goodPasswordConfirmation: function (model) {
        var pw, pw_conf;
        
        pw      = model.get ('password');
        pw_conf = model.get ('password_confirmation');
        
        if (!pw_conf.empty ()) {
            if (pw === pw_conf) {
                this.addClass ('show');                
            } else {
                this.removeClass ('show');                
            }
        } else {
            this.removeClass ('show');
        }
    }
    .observes ('password_confirmation').on ('change')
    .observes ('password').on ('change'),
    
    enableSubmit: function (model) {
        var sending,
            pw_temp, pw, pw_conf,
            goodPWTemp, goodPW;
        
        sending = model.get ('sending');
        pw_temp = model.get ('pw_temp');
        pw      = model.get ('password');
        pw_conf = model.get ('password_confirmation');
        
        goodPWTemp  = !pw_temp.empty ();
        goodPW      = !pw.empty () && pw.length >= 4 && pw.strength () >= 2 && pw === pw_conf;

        if (!sending && goodPWTemp && goodPW) {
            this.removeClass ('disabled');
        } else {
            this.addClass ('disabled');
        }
    }
    .observes ('pw_temp').on ('change')
    .observes ('password').on ('change')
    .observes ('password_confirmation').on ('change')
    .observes ('sending').on ('change'),
    
    resetError:    function (model) {
        var error, title, buttons, message;
         
        title       = 'Das Passwort konnte nicht ge&auml;ndert werden';
        message    = '';
        error       = model.get ('error');
         
        if (error === 580) {
            message += 'Bitte überprüfen Sie Ihren eingegebenen Reset-Code und versuchen es erneut.';
        } else {
            message += 'Interner Fehler<br><br>';
            message += 'Bitte veruchen Sie es in ein paar Minuten erneut.<br>';
            message += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';
        }

        buttons = new Array 
        (
            $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
        );

        vex.dialog.open ({
            className:  'vex-theme-top',
            message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
            buttons:    buttons
        });
    }.observes ('error').on ('change'),
    
    resetSuccess: function () {
        var title, message, buttons;
         
        title       = 'Passwort erfolgreich ge&auml;ndert';
        message     = 'Ihr Passwort wurde erfolgreich ge&auml;ndert.<br>';
        message    += 'Sie können sich ab sofort mit Ihrem neuen Passwort anmelden.';

        buttons = new Array 
        (
            $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
        );

        callback    = function () {
            document.location.href = '#/auth/login';
        };        
        
        vex.dialog.open ({
            className:  'vex-theme-top',
            message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
            buttons:    buttons,
            callback:   callback
        });
    }.observes ('success').on ('change'),
    
    sending: function (model) {
        var _this, _btn;

        _this  = this;
        _btn   = _this.parents ('.btn:first');

        if (model.get ('sending') === true) {
            _this.removeClass ('fadeOut');
            _this.addClass ('fadeIn');
            _btn.addClass ('disabled');
        } else {
            _this.removeClass ('fadeIn');
            _this.addClass ('fadeOut');
            _btn.removeClass ('disabled');
        }
    }.observes ('sending').on ('change')
});