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

np.controller.extend ('CheckoutUserController', {
    view: 'CheckoutUserView',
    model: function ()  { 
        if (this.Checkout.user.gender.empty ()) {
            this.Checkout.user.gender = 'male';
            np.checkout.setOrder ('user', 'gender', 'male');
        }
        return this;  
    },
    
    events: {
        setMale: function () {
            if (this.get ('user.gender') !== 'male') { 
                np.checkout.setOrder ('user', 'gender', 'male');
                
                this.set ('user.gender', 'male');  
                
                if (!this.get ('shipping.customShipping')) {
                    this.set ('shipping.gender', 'male');

                    np.checkout.setOrder ('shipping', 'gender', 'male');
                }
            }
        },
        
        setFemale: function () {
            if (this.get ('user.gender') !== 'female') {
                np.checkout.setOrder ('user', 'gender', 'female');
                
                this.set ('user.gender', 'female');  
                
                if (!this.get ('shipping.customShipping')) {
                    this.set ('shipping.gender', 'female');

                    np.checkout.setOrder ('shipping', 'gender', 'female');
                }
            }
        },
        
        setPrename: function (node) {
            var prename;
            
            prename = node.get ('user.prename');
            
            np.checkout.setOrder ('user', 'prename', prename);

            this.set ('user.prename', prename);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.prename', prename);

                np.checkout.setOrder ('shipping', 'prename', prename);
            }
        },
        
        setName: function (node) {
            var name;
            
            name    = node.get ('user.name');
            
            np.checkout.setOrder ('user', 'name', name);

            this.set ('user.name', name);
            
            if (!this.get ('shipping.customShipping')) {
                this.set ('shipping.name', name);

                np.checkout.setOrder ('shipping', 'name', name);
            }
        },
        
        setMail: function (node) {
            var mail;
            
            mail    = node.get ('user.email');
            
            np.checkout.setOrder ('user', 'email', mail);
            
            this.set ('user.email', mail);
        },
        
        setMailConfirmation: function (node) {
            var confirmation;
            
            confirmation    = node.get ('user.email_confirmation');
            np.checkout.setOrder ('user', 'email_confirmation', confirmation);
            
            this.set ('user.email_confirmation', confirmation);
        },
        
        applyUser: function () {
            var _this, promise, authUser, 
                oldName, oldPrename, oldMail, oldMailConfirmation,
                newName, newPrename, newMail, newMailConfirmation;
            
            _this               = this;
            promise             = np.Promise ();
            
            authUser            = np.auth.user ('user');
            
            oldName             = this.get ('user.name');
            oldPrename          = this.get ('user.prename');
            oldMail             = this.get ('user.email');
            oldMailConfirmation = this.get ('user.email_confirmation');
            
            newName             = authUser.name;
            newPrename          = authUser.prename;
            newMail             = newMailConfirmation = authUser.email;
            
            np.checkout.setOrder ('user', 'name', newName);
            np.checkout.setOrder ('user', 'prename', newPrename);
            np.checkout.setOrder ('user', 'email', newMail);
            np.checkout.setOrder ('user', 'email_confirmation', newMailConfirmation);
            
            this.set ('user.name', newName);
            this.set ('user.prename', newPrename);
            this.set ('user.email', newMail);
            this.set ('user.email_confirmation', newMailConfirmation);
        
            np.checkout.saveOrder ()
            .then (function () {
                _this.set ('error', false);
                _this.set ('success', true);
                _this.set ('sending', false);

                promise.then ();
            })
            .fail (function (error) {
                np.checkout.setOrder ('user', 'name', oldName);
                np.checkout.setOrder ('user', 'prename', oldPrename);
                np.checkout.setOrder ('user', 'email', oldMail);
                np.checkout.setOrder ('user', 'email_confirmation', oldMailConfirmation);
                
                _this.set ('user.name', oldName);
                _this.set ('user.prename', oldPrename);
                _this.set ('user.email', oldMail);
                _this.set ('user.email_confirmation', oldMailConfirmation);
                
                _this.set ('success', false);
                _this.set ('error', error);
                _this.set ('sending', false);

                /* 
                 * TODO insert modal error window into view after error to 
                 * inform the user bout it
                 * */           
                
                promise.fail ();
            });  

            return promise;
        }        
    }
});