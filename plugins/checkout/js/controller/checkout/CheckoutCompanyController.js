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

np.controller.extend ('CheckoutCompanyController', {
    view:   'CheckoutCompanyView',
    model:  function () { return this;  },
    
    events: {
        setCompany: function (node) {
            var company;
            
            company = node.get ('company.company');
            
            np.checkout.setOrder ('company', 'company', company);
            
            this.set ('company.company', company);
        },
        
        setUstID: function (node) {
            var ustid;
            
            ustid   = node.get ('company.ustid');
            
            np.checkout.setOrder ('company', 'ustid', ustid);
            
            this.set ('company.ustid', ustid);
        },
        
        applyCompany: function () {
            var _this, promise, 
                oldCompany, oldUstID,
                settCompany, settUstID;
            
            _this       = this;
            promise     = np.Promise ();
            
            oldCompany  = this.get ('company', 'company');
            oldUstID    = this.get ('company', 'ustid');
            
            settCompany = np.checkout.getOrigCompany ('company');
            settUstID   = np.checkout.getOrigCompany ('ustid');
            
            np.checkout.setOrder ('company', 'company', settCompany);
            np.checkout.setOrder ('company', 'ustid', settUstID);
            
            this.set ('company.company', settCompany);
            this.set ('company.ustid', settUstID);
        
            np.checkout.saveOrder ()
            .then (function () {
                _this.set ('error', false);
                _this.set ('success', true);
                _this.set ('sending', false);

                promise.then ();
            })
            .fail (function (error) {
                np.checkout.setOrder ('company', 'company', oldCompany);
                np.checkout.setOrder ('company', 'ustid', oldUstID);
                
                _this.set ('company.company', oldCompany);
                _this.set ('company.ustid', oldUstID);
                
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