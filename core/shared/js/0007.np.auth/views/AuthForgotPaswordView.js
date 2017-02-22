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

np.view.extend ('AuthForgotPasswordView', {
    validMail:  function (model) {
        var sending;
        
        sending = model.get ('sending');
        
        if (!sending && !model.get ('reset_email').empty () && model.get ('reset_email').complies ('mail')) {
            this.removeClass ('disabled');
        } else {
            this.addClass ('disabled');
        }
    }
    .observes ('reset_email').on ('change')
    .observes ('sending').on ('change'),
    
    validMailInput:  function (model) {
        if (!model.get ('reset_email').empty ()) {
            if (model.get ('reset_email').complies ('mail')) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn'); 
            }
        } else {
            this.removeClass ('fadeIn');
        }
    }.observes ('reset_email').on ('change'),    
    
    invalidMailInput:  function (model) {
        var _t;
        
        _t  = this;
        
        if (!model.get ('reset_email').empty ()) {
            if (!model.get ('reset_email').complies ('mail')) {
                this.addClass ('fadeIn');
                
                this.qtip ({
                    content:    { text: 'Bitte geben Sie eine g&uuml;ltige E-Mail Adresse ein.' },
                    style: {
                        classes: 'qtip-dark',
                        tip: {
                            corner: 'bottom center'
                        }
                    },
                    position: {
                        my: 'bottom center',
                        at: 'top center',
                        target: _t
                    }
                });                
            } else {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                    $('.qtip').remove ();
                }

                this.removeClass ('fadeIn'); 
            }
        } else {
            if ($(this).qtip ('api')) { 
                $(this).qtip ('api').hide ();    
                $(this).qtip ('api').disable ();    
                $('.qtip').remove ();
            }

            this.removeClass ('fadeIn');
        }
    }.observes ('reset_email').on ('change'),    
    
    resetSuccess: function () {
        var title, message, buttons;
         
        title       = 'Die E-Mail wurde versendet';
        
        message     = 'Ihnen wurde eine E-Mail mit den Anweisungen zur Vergabe eines neuen Passworts zugesandt.<br><br>';
        message    += 'Bitte &ouml;ffnen Sie diese in Ihrem E-Mail-Postfach und folgen Sie einfach den dort beschriebenen Anweisungen.';

        buttons = new Array 
        (
            $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
        );

        vex.dialog.open ({
            className:  'vex-theme-top',
            message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
            buttons:    buttons
        });
    }.observes ('success').on ('change'),
    
    sendSuccess: function () {
        this.val ('');
    }.observes ('success').on ('change'),
    
    resetError: function (model) {
        var error, title, message, buttons;

        title       = 'Link zusenden fehlgeschlagen';
        message     = '';
        error       = model.get ('error');

        if (error === 581) {
            message += 'Der Reset-Code konnte nicht versendet werden<br><br>';
            message += 'Möglicherweise existiert die E-Mail-Adresse nicht.<br>';
            message += 'Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.<br>';
        } else {
            message += 'Interner Fehler<br><br>';
            message += 'Bitte veruchen Sie es in ein paar Minuten erneut. ';
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