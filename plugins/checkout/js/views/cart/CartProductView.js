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

np.view.extend ('CartProductView', (function () {
    var rspCodes, qTipClosed;
    
    qTipClosed  = true;
    
    rspCodes    = {
        unknown:    'Ein unbekannter Fehler ist aufgetreten.<br>Bitte wiederholen Sie den Vorgang erneut.',
        1:          'Dieser Artikel ist im Moment leider nicht verfügbar.',
        404:        'Dieser Artikel wurde nicht gefunden.<br>Bitte versuchen Sie es erneut.'
    };

    return {
        isDeleted: function (model) {
            var isDeleted;
            
            isDeleted   = parseInt (model.get ('deleted'), 10) === 1;
            
            if (isDeleted) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        disableApply: function (model) {
            if (model.get ('sending')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('sending').on ('change'),
        
        disableReset: function (model) {
            if (model.get ('sending')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('sending').on ('change'),
        
        setBookmark: function (model) {
            np.Product.getBookmark (model.getAll ());
        },

        setTotal: function (model) {
            var gross;
            
            gross   = np.Product.getTotal (model.getAll (), model.get ('amount'));
            gross   = accounting.formatMoney (gross, '', 2, '.', ',');

            return gross+' &euro;';
        }.observes ('amount').on ('change'),
        
        setGross: function (model) {
            var gross;
            
            gross   = np.Product.getGross (model.getAll ());
            gross   = accounting.formatMoney (gross, '', 2, '.', ',');
            
            return gross+' &euro;/St&uuml;ck';
        }.observes ('info').on ('change'),

        hasChanged: function (model) {
            var article_id, sAmount, cAmount, container;

            container   = this.parents ('[data-handle="CartProductView"]:first');

            article_id  = model.get ('article_id');

            sAmount     = np.Cart.getProductAmount (article_id);
            cAmount     = np.Cart.getCacheProductAmount (article_id);
            
            if (sAmount !== cAmount) {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }.observes ('amount').on ('change'),

        maxAmount: function (model) {
            if (model.get ('maxAmount')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('maxAmount').on ('change'),
        
        refresh: function (model) {
            var parent;
            
            if (model.get ('sending')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('sending').on ('change'),
        
        info: function (model) {
            var title, message, buttons, infoCode, product, btnApply, btnRemove;
            
            infoCode    = model.get ('info');
            btnApply    = this.find ('.cart-changes-container .btn-container button.first');
            btnRemove   = this.find ('.btn-remove');
            
            if (infoCode) {
                title   = 'Artikelstatus';
                
                if (infoCode === 2) {
                    product     = model.getAll ();
                    
                    message     = 'Der Artikelpreis hat sich zwischenzeitlich geändert und beträgt jetzt:<br><br>';
                    message    += '<label>Preis/Stück:</label><b>'+accounting.formatMoney (np.Product.getGross (model.getAll ()), '', 2, '.', ',')+' &euro;</b> ';
                    message    += '<span class="small">(inkl. MwSt.'+np.Product.getTax (model.getAll ())+'%)</span><br><br>';
                    message    += 'Soll der Artikel im Warenkorb bleiben?';
                    
                    buttons = new Array 
                    (
                        $.extend ({}, vex.dialog.buttons.YES, {text: 'Ja'}),
                        $.extend ({}, vex.dialog.buttons.NO, {text: 'Nein'})
                    );
                } else {
                    message     = typeof rspCodes[infoCode] === 'string' ? rspCodes[infoCode] : rspCodes.unknown;
                    
                    buttons = new Array 
                    (
                        $.extend ({}, vex.dialog.buttons.YES, {text: 'OK'})
                    );
                }

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>',
                    buttons:    buttons,
                    callback:   function (data) {
                        if (infoCode === 2) {
                            if (data === true) {
                                btnApply.click ();
                            } else {
                                btnRemove.click ();
                            }
                        }
                    }
                });
            }
        }.observes ('info').on ('change'),
        
        removeMe: function (model) {
            var me;
            
            me  = $('[data-cart-id="'+model.get ('id')+'"]');

            if (!model.get ('isInCart') && me.length > 0) {
                me.animate ({
                    height: 'toggle',
                    easing: 'easeInOutQuint'
                }, 350, function () {   
                    var parent, siblings;
                    
                    parent      = me.parents('.cart-category-container:first');
                    siblings    = me.parents('.cart-category-container:first').find ('[data-handle="CartProductView"]').length - 1;

                    me.remove ();
                    
                    if (siblings < 1) { parent.remove (); }
                });
            }
        }.observes ('isInCart').on ('change'),
        
        setManufactLink: function (model) {
            this.attr ('href', '/shop/search/'+model.get ('producer'));
        }
    };
}()));