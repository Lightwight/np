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

np.view.extend ('AdminUserProfileView', (function () {
    var _nsGender, _nsGroup;
    
    _nsGender   = '#admin-user-gender';
    _nsGroup    = '#admin-user-group';

    return {
        didInsert: function () {
            $(_nsGender).niceSelect ();
            $(_nsGroup).niceSelect ();
        },

        salutation: function (model) {
            $(_nsGender).val (model.get ('gender')).niceSelect ('update');
        }.observes ('gender').on ('change'),

        group: function (model) {
            $(_nsGroup).val (model.get ('group')).niceSelect ('update');
       }.observes ('group').on ('change'),

        validName: function (model) {
            if (!model.get ('name').empty ()) {
                if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');         }
                if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
            } else {
                if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');      }
            }
        }.observes ('name').on ('change'),

        invalidName: function (model) {
            var _t, msg;

            _t  = this;

            if (model.get ('name').empty ()) {
                msg = 'Bitte geben Sie einen Nachnamen ein.';

                this.qtip ({
                    content:    { text: msg },
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

                if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');     }
                if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut'); }
            } else {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                    $('.qtip').remove ();
                }

                if (!this.hasClass ('fadeOut')) { this.addClass ('fadeOut');    }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            }
        }.observes ('name').on ('change'),

        validPrename: function (model) {
            if (!model.get ('prename').empty ()) {
                if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');         }
                if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
            } else {
                if (this.hasClass ('fadeOut'))  { this.removeClass ('fadeOut');     }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');      }
            }
        }.observes ('prename').on ('change'),

        invalidPrename: function (model) {
            var _t, msg;

            _t  = this;

            if (model.get ('prename').empty ()) {
                msg = 'Bitte geben Sie einen Vorname ein.';

                this.qtip ({
                    content:    { text: msg },
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

                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');  }
                if (this.hasClass ('fadeOut'))   { this.removeClass ('fadeOut');  }
            } else {
                if ($(this).qtip ('api')) { 
                    $(this).qtip ('api').hide ();    
                    $(this).qtip ('api').disable ();    
                    $('.qtip').remove ();
                }

                if (!this.hasClass ('fadeOut'))   { this.addClass ('fadeOut');  }
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            }       
        }.observes ('prename').on ('change'),

        invalidMail: function (model) {
            if (!model.get ('email').empty () && !model.get ('email').complies ('mail')) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('email').on ('change'),

        validMail: function (model) {
            if (model.get ('email').empty () || !model.get ('email').complies ('mail')) {
                this.removeClass ('fadeIn');
            } else if (!model.get ('email').empty ()) {
                this.addClass ('fadeIn');
            }
        }.observes ('email').on ('change'),

        invalidMailConfirmation: function (model) {
            if (!model.get ('email_confirmation').empty () 
                && model.get ('email') !== model.get ('email_confirmation')
            ) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('email_confirmation').on ('change').observes ('email').on ('change'),

        validMailConfirmation: function (model) {
            if (!model.get ('email_confirmation').empty () && model.get ('email') === model.get ('email_confirmation')) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('email_confirmation').on ('change').observes ('email').on ('change'),

        enableMailConfirmation: function (model) {
            var user, mMail, uMail;
            
            user    = np.model.Users.findByID (model.get ('id'));
            
            mMail   = model.get ('email');
            uMail   = user.getEmail ();

            if (mMail !== uMail) {
                this.removeClass ('hide');
            } else {
                this.addClass ('hide');
            }
        }.observes ('email').on ('change'),

        enableSubmit: function (model) {
            var user, isNewUser, valid, changed,
               uGender, uGroup, uName, uPrename, uMail,
               mGender, mGroup, mName, mPrename, mMail, mMailConf;

            user        = np.model.Users.findByID (model.get ('id'));
            isNewUser   = parseInt (model.get ('id'), 10) === -1;

            uGender     = user.getGender ();
            uGroup      = parseInt (user.getGroup (), 10);
            uName       = user.getName ();
            uPrename    = user.getPrename ();
            uMail       = user.getEmail ();
            
            mGender     = model.get ('gender');
            mGroup      = parseInt (model.get ('group'), 10);
            mName       = model.get ('name');
            mPrename    = model.get ('prename');
            mMail       = model.get ('email');
            mMailConf   = model.get ('email_confirmation');

            valid       = mName.length > 0 && mPrename.length > 0
                          && mMailConf === mMail;

            if (isNewUser) {
                valid   = valid && !mMail.empty () && mMail.complies ('email') && mMail === mMailConf;
                changed = true;
            } else {
                changed  = mGender !== uGender
                           || mGroup !== uGroup
                           || mName !== uName
                           || mPrename !== uPrename
                           || mMail !== uMail;
            }

            if (valid && changed)    { this.removeClass ('disabled');    }
            else                     { this.addClass ('disabled');       }
        }
        .observes ('gender').on ('change')
        .observes ('group').on ('change')
        .observes ('prename').on ('change')
        .observes ('name').on ('change')
        .observes ('email').on ('change')
        .observes ('email_confirmation').on ('change'),

        applying: function (model) {
            if (model.get ('sending')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('sending').on ('change'),
        
        notifySuccess: function (model) {
            var isNewUser, msg, timeout;
            
            if (model.get ('success')) {
                isNewUser   = parseInt (model.get ('id'), 10) === -1;
                msg         = isNewUser ? 'Der Benutzer wurde angelegt und erhält eine E-Mail zur Vergabe eines Passworts.' : 'Die Änderungen wurden gespeichert.';
                timeout     = isNewUser ? 5000 : 3000;
                
                np.notify (msg).asSuccess ().timeout (timeout).show ();
            }
        }.observes ('success').on ('change'),
        
        notifyError: function (model) {
            var error;
            
            error   = model.get ('error');
            if (error) {
                np.notify (error).asError ().timeout (3000).show ();
            }
        }.observes ('error').on ('change'),
        
        flushUser: function () {
            np.model.Users.flush ();
        }.observes ('route.before').on ('change')
    };
})());