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

np.view.extend ('AuthLoginView', (function () {
    return {
        disableOnSend: function (model) {
            if (model.get ('sending')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('sending').on ('change'),
        
        disableLogout: function (model) {
            if (model.get ('sending')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('sending').on ('change'),
        
        invalidMail: function (model) {
            if (!model.get ('email').empty () && !model.get ('email').complies ('mail')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('email').on ('change'),

        validMail: function (model) {
            if (model.get ('email').empty () || !model.get ('email').complies ('mail')) {
                this.removeClass ('show');
            } else if (!model.get ('email').empty ()){
                this.addClass ('show');
            }
        }.observes ('email').on ('change'),

        givenPassword: function (model) {
            if (!model.get ('password').empty ()) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('password').on ('change'),

        validUser: function (model) {
            var email, password, sending;

            email       = model.get ('email');
            password    = model.get ('password');
            sending     = model.get ('sending');
            
            if (!sending && !email.empty () && email.complies ('mail') && !password.empty ()) {
                this.removeClass ('disabled');
            } else {
                this.addClass ('disabled');
            }
        }
        .observes ('password').on ('change')
        .observes ('email').on ('change')
        .observes ('sending').on ('change'),

        sending: function (model) {
            if (model.get ('sending') === true) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('sending').on ('change'),


        userDataFullfilled: function (model) {
            var gender, name, prename, empty;
            
            gender  = model.get ('gender'); 
            name    = model.get ('name'); 
            prename = model.get ('prename'); 
            
            empty   = gender.empty () || name.empty () || prename.empty ();
            
            if (!empty) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        userDataNotFullfilled: function (model) {
            var gender, name, prename, empty;
            
            gender  = model.get ('gender'); 
            name    = model.get ('name'); 
            prename = model.get ('prename'); 
            
            empty   = gender.empty () || name.empty () || prename.empty ();
            
            if (empty) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },

        loginError: function (model) {
            var error, title, type, message, buttons;

            type        = 'error';
            title       = 'Anmelung fehlgeschlagen';
            message     = '';
            error       = model.get ('error');
            buttons     = new Array ();

            callback    = function (data) {
                if (data === false) { return false;                                         }
                else                { document.location.href = '#/auth/forgot/password';    }
            };

            if (error === 580) {
                message  = 'Bitte &uuml;berpr&uuml;fen Sie Ihre Anmeldedaten.<br>';
                message += 'Wenn Sie Ihre Passwort vergessen haben, dann k&ouml;nnen Sie sich ein neues erstellen.<br>';
                message += 'Klicken Sie hierf&uuml;r einfach auf den Button "Passwort vergessen".';
                
                buttons = new Array 
                (
                    $.extend ({}, vex.dialog.buttons.YES, {text: 'Passwort vergessen'}),
                    $.extend ({}, vex.dialog.buttons.NO, {text: 'Schließen'})
                );
                
            } else {
                message  = 'Interner Fehler<br><br>';
                message += 'Bitte veruchen Sie es in ein paar Minuten erneut. ';
                message += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';
            }

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons,
                callback:   callback
            });
         }.observes ('error').on ('change'),

        loginSuccess: function () {
            document.location.reload ();
         }.observes ('success').on ('change'),

        logoutSuccess: function () {
            np.routeTo ('/auth/loggedout');
         }.observes ('logout_success').on ('change')
    };
}()));