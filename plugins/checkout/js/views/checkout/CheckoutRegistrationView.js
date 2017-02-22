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

np.view.extend ('CheckoutRegistrationView', {
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

    invalidMailConfirmation: function (model) {
        if (!model.get ('email_confirmation').empty () 
            && model.get ('email') !== model.get ('email_confirmation')
        ) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('email_confirmation').on ('change').observes ('email').on ('change'),
    
    validMailConfirmation: function (model) {
        if (!model.get ('email_confirmation').empty () && model.get ('email') === model.get ('email_confirmation')) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }
    }.observes ('email_confirmation').on ('change').observes ('email').on ('change'),
    
    badPassword: function (model) {
        var isBadPassword, len, strength, _t, msg;
        
        _t  = this;
        
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
    
    invalidPasswordConfirmation: function (model) {
        if (!model.get ('password_confirmation').empty () && 
            model.get ('password') !== model.get ('password_confirmation')
        ) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }        
    }.observes ('password_confirmation').on ('change').observes ('password').on ('change'),
    
    validPasswordConfirmation: function (model) {
        if (!model.get ('password_confirmation').empty () && 
            model.get ('password') === model.get ('password_confirmation')
        ) {
            this.addClass ('show');
        } else {
            this.removeClass ('show');
        }        
    }.observes ('password_confirmation').on ('change').observes ('password').on ('change'),
    
    validRegistration: function (model) {
        var sending,
            validMail, validMailConfirmation,
            validPassword, validPasswordConfirmation,
            len, strength;
    
        sending                 = model.get ('sending');
        len                     = model.get ('password').length;
        strength                = model.get ('password').strength ();

        validMail               = model.get ('email').complies ('mail');
        validMailConfirmation   = model.get ('email') === model.get ('email_confirmation');

        validPassword               = len >= 4 && strength >= 2;
        validPasswordConfirmation   = model.get ('password') === model.get ('password_confirmation');
    
        if (!sending && validMail && validMailConfirmation && validPassword && validPasswordConfirmation) {
            this.removeClass ('disabled');
            this.data ('disabled', false);
        } else {
            this.addClass ('disabled');
            this.data ('disabled', true);
        }
    }.observes ('email').on ('change')
     .observes ('email_confirmation').on ('change')
     .observes ('password').on ('change')
     .observes ('password_confirmation').on ('change')
     .observes ('sending').on ('change'),
     
     registrationErrors: function (model) {
        var error, title, type, message, buttons;
         
        type        = 'error';
        title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Registrierung fehlgeschlagen</h4>';
        message     = '';
        error       = model.get ('error');

        if (error === 102) {
            message += 'Dieser Benutzer existiert bereits<br><br>';
            message += 'Wenn Sie Ihr Passwort vergessen haben, ';
            message += 'dann k&ouml;nnen Sie Sich ein neues erstellen.<br>';
            message += 'Klicken Sie hierf&uuml;r einfach auf den Button ';
            message += '"Passwort vergessen".';
            message += '<br>';
            
            buttons = new Array ({
                label:     'Passwort vergessen',
                icon:      'glyphicon glyphicon-chevron-right',
                action:    function (dlg) {
                    dlg.close ();
                     
                    document.location.href = '#/user/passwort/vergessen';
                }
            });
        } else {
            message += 'Interner Fehler<br><br>';
            message += 'Bitte versuchen Sie es in ein paar Minuten erneut. ';
            message += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';
            message += '<br>';
        }
            
        np.ui.dialog.show (type, title, message, buttons);
     }.observes ('error').on ('change'),
     
    registrated: function (model) {
        var title, message, buttons;
         
        if (model.get ('success') === true) {
            title       = 'Registrierung erfolgreich';
            message     = 'Vielen Dank, dass Sie unseren Shop nutzen m&ouml;chten.<br><br>';
            message    += 'Sie erh&auml;ten in K&uuml;rze eine Best&auml;tigungs-E-Mail.<br>';
            message    += 'Bitte &ouml;ffnen Sie diese in Ihrem E-Mail Postfach und klicken Sie dann auf ';
            message    += 'den Aktivierungs-Link, um Ihr Konto zu aktivieren.';

            buttons = new Array 
            (
                $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
            );

            vex.dialog.open ({
                className:  'vex-theme-top',
                message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                buttons:    buttons,
                callback:   function (data) {
                    if (data === true) { document.location.href = '/';  }
                }
            });
        }
     }.observes ('success').on ('change'),
     
     sending: function (model) {
         if (model.get ('sending') === true) {
             this.addClass ('show');
         } else {
             this.removeClass ('show');
         }
     }.observes ('sending').on ('change')     
});