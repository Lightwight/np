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

np.view.extend ('AdminUserProfileView', {
    didInsert: function () {
        this ('select').selectpicker ();
    },
    
    salutation: function (model) {
        if (model.get ('gender') === 'male') {
            this.val ('Herr');
        } else {
            this.val ('Frau');
        }
    }.observes ('gender').on ('change'),
    
   group: function (model) {
       this.val (model.get ('group_name'));
   }.observes ('group_name').on ('change'),
   
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
   
    enableSubmit: function (model) {
       var user, valid, changed,
           uGender, uGroup, uName, uPrename,
           mGender, mGroup, mName, mPrename;
       
       user     = np.model.Users.findByID (model.get ('id'));
       
       uGender  = user.getGender ();
       uGroup   = user.getGroupName ();
       uName    = user.getName ();
       uPrename = user.getPrename ();
       
       valid    = mName.length > 0 && mPrename.length > 0;
       changed  = mGender !== uGender
                  || mGroup !== uGroup
                  || mName !== uName
                  || mPrename !== mPrename;

       if (valid && changed)    { this.removeClass ('disabled');    }
       else                     { this.addClass ('disabled');       }
    }
    .observes ('gender').on ('change')
    .observes ('group_name').on ('change')
    .observes ('prename').on ('change')
    .observes ('name').on ('change')
});