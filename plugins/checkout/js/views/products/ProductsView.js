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

np.view.extend ('ProductsView', {
    appendDummies: function () {
        var container, amount, rest, missing, dummies,
            i;
        
        container   = this.find ('.products-spread:first');
        
        if (np.client.isLG ()) {
            
            amount      = container.find ('.product.col-3').length;
            rest        = amount % 4;
            dummies     = '';
            
            if (rest > 0) {
                missing = (amount - rest + 4) - amount;
                
                for (i=0; i<missing; i++) {
                    dummies += '<div class="product dummy col-3"></div>'+"\r\n";
                }
                
                container.append (dummies);
            }
        } else {
            container.find ('.product.dummy.col-3').remove ();
        }
    }.observes ('window.size').on ('change')
});