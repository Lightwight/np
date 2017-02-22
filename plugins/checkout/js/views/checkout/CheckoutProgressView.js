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

np.view.extend ('CheckoutProgressView', (function () {
    var currentStep;
    
    currentStep = 0;
    
    function toggleUser (view) {
        var node, anchor;
        
        node    = view.find ('.checkout-step:nth-child(1)');
        anchor  = node.find ('a');
        
        if (currentStep === 1) {
            if (!node.hasClass ('active'))      { node.addClass ('active');         }
            if (!anchor.hasClass ('disabled'))  { anchor.addClass ('disabled');     }
            if (node.hasClass ('enabled'))      { node.removeClass ('enabled');     }
        } else {
            if (node.hasClass ('active'))       { node.removeClass ('active');      }
            if (anchor.hasClass ('disabled'))   { anchor.removeClass ('disabled');  }
            if (!node.hasClass ('enabled'))     { node.addClass ('enabled');        }
        }
    }
    
    function toggleAddress (view) {
        var node, anchor;
        
        node    = view.find ('.checkout-step:nth-child(2)');
        anchor  = node.find ('a');
        
        if (currentStep === 2) {
            if (!node.hasClass ('active'))      { node.addClass ('active');         }
            if (!anchor.hasClass ('disabled'))  { anchor.addClass ('disabled');     }
            if (node.hasClass ('enabled'))      { node.removeClass ('enabled');     }
        } else {
            if (!node.hasClass ('enabled'))     { node.addClass ('enabled');        }
            if (anchor.hasClass ('disabled'))   { anchor.removeClass ('disabled');  }
            if (node.hasClass ('active'))       { node.removeClass ('active');      }
        }
    }
    
    function togglePayment (model, view) {
        var valid, node, anchor;

        valid           = np.checkout.validUser () && np.checkout.validBilling () && np.checkout.validShipping ();
        node            = view.find ('.checkout-step:nth-child(3)');
        anchor          = node.find ('a');
        
        if (currentStep === 3) {
            if (!node.hasClass ('active'))          { node.addClass ('active');         }
            if (!anchor.hasClass ('disabled'))      { anchor.addClass ('disabled');     }
            if (node.hasClass ('enabled'))          { node.removeClass ('enabled');     }
        } else {
            if (node.hasClass ('active'))           { node.removeClass ('active');      }
            
            if (valid) {
                if (!node.hasClass ('enabled'))     { node.addClass ('enabled');        }
                if (anchor.hasClass ('disabled'))   { anchor.removeClass ('disabled');  }
            } else {
                if (node.hasClass ('enabled'))      { node.removeClass ('enabled');     }
                if (!anchor.hasClass ('disabled'))  { anchor.addClass ('disabled');     }
            }
        }
    }
    
    function toggleVerification (model, view) {
        var valid, node, anchor;
        
        valid           = np.checkout.validUser () && np.checkout.validBilling () && np.checkout.validShipping () && np.checkout.validPayment ();
        
        node            = view.find ('.checkout-step:nth-child(4)');
        anchor          = node.find ('a');
        
        if (currentStep === 4) {
            if (!node.hasClass ('active'))          { node.addClass ('active');         }
            if (!anchor.hasClass ('disabled'))      { anchor.addClass ('disabled');     }
            if (node.hasClass ('enabled'))          { node.removeClass ('enabled');     }
            
        } else {
            if (node.hasClass ('active'))           { node.removeClass ('active');      }
            if (valid) {
                if (!node.hasClass ('enabled'))     { node.addClass ('enabled');        }
                if (anchor.hasClass ('disabled'))   { anchor.removeClass ('disabled');  }
            } else {
                if (node.hasClass ('enabled'))      { node.removeClass ('enabled');     }
                if (!anchor.hasClass ('disabled'))  { anchor.addClass ('disabled');     }
            }
        }
    }
    
    function toggleConfirmation (model, view) {
        var valid, node;
                
        node        = view.find ('.checkout-step:nth-child(5)');
        
        if (currentStep === 5) {
            if (!node.hasClass ('active'))  { node.addClass ('active');     }
        } else {
            if (node.hasClass ('active'))   { node.removeClass ('active');  }
        }
    }
    
    return {
        setProgress: function (model) {
            currentStep     = model.get ('state.step');

            toggleUser (this);
            toggleAddress (this);
            togglePayment (model, this);
            toggleVerification (model, this);
            toggleConfirmation (model, this);
        }
        .observes ('@each').on ('change')
    };
}()));