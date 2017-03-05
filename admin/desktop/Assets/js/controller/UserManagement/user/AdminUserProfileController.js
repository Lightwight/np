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

np.controller.extend ('AdminUserProfileController', {
    view:   'AdminUserProfileView',
    model:  function () {
        var hiGroup, hiGroupName, result, user, authGroups, userID;
        
        hiGroup     = 0;
        hiGroupName = '';
        
        userID      = parseInt (np.route.getBookmarkItem (), 10);
        authGroups  = (function () {
            var groups;
            
            groups  = new Array ();
            
            np.model.Auth_groups.findAll ().each (function (row) {
                var groupID;
                
                groupID = row.getID ();

                if (groupID > hiGroup) { 
                    hiGroup     = groupID; 
                    hiGroupName = row.getGroup ();
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
                failed_id:  userID
            };
        } else {
            user    = {
                id:         -1,
                groups:     authGroups,
                prename:    '',
                name:       '',
                gender:     'male',
                group:      hiGroup,
                group_name: hiGroupName
            };
        }
        
        return {
            User: user
        };
    },
    
    events: {
        setSalutation: function (view) {
            this.set ('gender', (view.get ('salutation') === 'Herr' ? 'male' : 'female'));
        },
        
        setGroup: function (view) {
            this.set ('group_name', view.get ('group'));
        },
        
        setPrename: function (view) {
            this.set ('prename', view.get ('prename'));
        },
        
        setName: function (view) {
            this.set ('name', view.get ('name'));
        }
    }
});