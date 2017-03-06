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

np.controller.extend ('AdminUserProfileController', (function () {
    var hiGroup, isNewUser;
    
    return {
        view:   'AdminUserProfileView',
        model:  function () {
            var result, user, authGroups, userID;

            hiGroup     = 0;

            userID      = parseInt (np.route.getBookmarkItem (), 10);
            isNewUser   = userID === -1;

            authGroups  = (function () {
                var groups;

                groups  = new Array ();

                np.model.Auth_groups.findAll ().each (function (row) {
                    var groupID;

                    groupID = row.getID ();

                    if (groupID > hiGroup) { 
                        hiGroup     = groupID; 
                    }

                    groups.push (row.getAll ());
                });

                return groups;
            }());

            result      = np.model.Users.findByID (userID);

            if (result.length () === 1)  {
                user        = result.getAll ();
                user.groups = authGroups;
            } else if (userID !== -1) {
                user    = {
                    id:         -2,
                    failed_id:  userID,
                    email:      ''
                };
            } else {
                user    = {
                    id:                 -1,
                    groups:             authGroups,
                    prename:            '',
                    name:               '',
                    gender:             'male',
                    email:              '',
                    group:              hiGroup
                };

                // Remove new user (if exists) from local storage:
                np.model.Users.findByID (-1).each (function (row) {
                    row.flush ();
                });

                // Add new user to local storage:
                np.model.Users.add (user);
            }
            
            user.sending            = false;
            user.success            = false;
            user.hidenotify         = false;
            user.email_confirmation = user.email;

            return {
                User: user
            };
        },

        events: {
            setSalutation: function (view) {
                this.set ('gender', (view.get ('salutation') === 'male' ? 'male' : 'female'));
            },

            setGroup: function (view) {
                this.set ('group', view.get ('group'));
            },

            setPrename: function (view) {
                this.set ('prename', view.get ('prename'));
            },

            setName: function (view) {
                this.set ('name', view.get ('name'));
            },

            setEmail: function (view) {
                var user, vEmail, email;
                
                vEmail      = view.get ('email');
                
                user        = np.model.Users.findByID (this.get ('id'));
                email       = user.getEmail ();

                if (vEmail === email) {
                    this.set ('email_confirmation', vEmail);
                } else {
                    this.set ('email_confirmation', '');
                }
                    
                this.set ('email', vEmail);
            },

            setEmailConfirmation: function (view) {
                this.set ('email_confirmation', view.get ('email_confirmation'));
            },

            applyUser: function (view) {
                var _this, gender, group, prename, name, email;
                
                _this               = this;
                gender              = this.get ('gender');
                name                = this.get ('name');
                prename             = this.get ('prename');
                email               = this.get ('email');
                group               = this.get ('group');
                
                this.set ('hidenotify', true);
                this.set ('sending', true);

                if (isNewUser) {
                    np.auth.adminRegister (this.getAll ())
                    .then (function () {
                        _this.set ('sending', false);
                        _this.set ('success', true);

                        // ToDo: move to view and call before route change!
                        np.model.Users.flush ();
                    })
                    .fail (function (error) {
                        _this.set ('sending', false);
                        _this.set ('error', error);
                    });
                } else {
                     np.auth.adminChangeUser (this.getAll ())
                    .then (function () {
                        _this.set ('sending', false);
                        _this.set ('success', true);
                        
                        np.model.Users.findByID (_this.get ('id')).each (function (row) {
                            row.setGender (gender);
                            row.setName (name);
                            row.setPrename (prename);
                            row.setEmail (email);
                            row.setGroup (group);
                            
                            _this.set ('group', group);
                        });
                    })
                    .fail (function (error) {
                        _this.set ('sending', false);
                        _this.set ('success', error);
                    });
                }
            }
        }
    };
})());