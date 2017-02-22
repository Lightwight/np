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

np.view.extend ('CheckoutOverviewView', {
    setWelcome: function (model) {
        var user, gender, name;
        
        user    = model.get ('user');
        gender  = typeof user.gender === 'string' && user.gender.length > 0 ? (user.gender === 'male' ? 'Herr' : 'Frau') : false;
        name    = typeof user.name === 'string' && user.name.length > 0 ? user.name : false;
        
        if (gender && name) {
            this.html ('Herzlich Willkommen '+gender+' '+name+',');
        } else {
            this.html ('Herzlich Willkommen,');
        }
    }
});