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

np.view.extend ('CheckoutPaymentView', (function () {
    var msg, iban;
    
    msg = {
        redirect:   'Ihr Zahlungsanbieter konnte kontaktiert werden.<br>'
                    + 'Folgen Sie einfach den Anweisungen Ihres Zahlungsanbieters, '
                    + 'um Ihre gewünschte Zahlungsmethode zu bestätigen. '
                    + 'Sie werden danach wieder zurückgeleitet. '
                    + 'Dort haben Sie die Möglichkeit, Ihre Bestellung zu '
                    + 'überprüfen und ggfs. zu ändern. Die Zahlung wird erst '
                    + 'wirksam, sobald Sie Ihre Bestellung bestätigt '
                    + 'haben.'
    };
    
    iban    = '';
    
    function isGatewayEnabled (gateway, gateways) {
        var i;
        
        for (i in gateways) {
            if (gateways[i].name === gateway) {
                return gateways[i].enabled === 1;
            }
        }
        
        return true;
    }
    
    return {
        /* BEGIN SECTION PayPal */
        isPayPalAvailable: function (model) {
            if (isGatewayEnabled ('paypal_express', model.get ('pGateways'))) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        isPayPalEnabled: function (model) {
            if (model.get ('sending')) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }

            if (model.get ('payment.gateway') === 'paypal_express' && model.get ('payment.verification') === 1) {
                if (!this.hasClass ('active'))  { this.addClass ('active');         }
                if (this.hasClass ('selected')) { this.removeClass ('selected');    }
            } else {
                if (model.get ('selectedGateway') === 'paypal_express') {
                    if (!this.hasClass ('selected'))    { this.addClass ('selected');       }
                } else {
                    if (this.hasClass ('selected'))     { this.removeClass ('selected');    }
                }
                
                if (this.hasClass ('active'))   { this.removeClass ('active');  }
            }
        }
        .observes ('selectedGateway').on ('change')
        .observes ('sendingPayPal').on ('change')
        .observes ('errorPayPal').on ('change')
        .observes ('payment.gateway').on ('change')
        .observes ('delivery.gateway').on ('change')
        .observes ('sending').on ('change'),

        isPayPalSelected: function (model) {
            if (model.get ('selectedGateway') === 'paypal_express' && model.get ('payment.verification') === 0) {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }.observes ('selectedGateway').on ('change'),
        
        preparePayPal: function (model) {
            if (model.get ('sendingPayPal') || (model.get ('payment.gateway') === 'paypal_express' && !model.get ('redirect'))) {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }
        .observes ('sendingPayPal').on ('change')
        .observes ('payment.gateway').on ('change')
        .observes ('redirect').on ('change'),
        
        contactedPayPal: function (model) {
            if (!model.get ('sendingPayPal') && (model.get ('payment.gateway') === 'paypal_express' && model.get ('redirect'))) {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }
        .observes ('sendingPayPal').on ('change')
        .observes ('redirect').on ('change'),

        contactedPayPalLabel: function (model) {
            if (!model.get ('sendingPayPal') && (model.get ('payment.gateway') === 'paypal_express' && model.get ('redirect'))) {
                this.addClass ('hide');
            } else {
                this.removeClass ('hide');
            }
        }
        .observes ('sendingPayPal').on ('change')
        .observes ('redirect').on ('change'),

        failedPayPal: function (model) {
            if (model.get ('errorPayPal') && !model.get ('sending')) {
                if (!this.hasClass ('show'))        { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))         { this.removeClass ('show');    }
            }
        }
        .observes ('errorPayPal').on ('change')
        .observes ('sending').on ('change'),

        redirectPayPalEnabled: function (model) {
            if (!model.get ('sendingPayPal') && !model.get ('redirecting') && (model.get ('payment.gateway') === 'paypal_express' && model.get ('redirect'))) {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            } else {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            }
        }
        .observes ('sendingPayPal').on ('change')
        .observes ('redirecting').on ('change'),

        hasErrorPayPal: function (model) {
            if (model.get ('error')) {
                var title, type, message;

                type        = 'error';
                title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Auswahl fehlgeschlagen</h4>';
                message     = '';

                message   += 'Der Zahlungsanbieter ist nicht erreichbar.<br><br>';
                message   += 'Bitte versuchen Sie es in ein paar Minuten erneut.<br>';
                message   += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';

                np.ui.dialog.show (type, title, message);
            }
        }.observes ('errorPayPal').on ('change'),
        
        isSendingPayPal: function (model) {
            if (model.get ('sendingPayPal')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }
        .observes ('sendingPayPal').on ('change')
        .observes ('errorPayPal').on ('change'),
        /* END SECTION PayPal */
        
        /* BEGIN SECTION Debit */
        isDebitAvailable: function (model) {
            if (isGatewayEnabled ('debit', model.get ('pGateways'))) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        isDebitEnabled: function (model) {
            if (model.get ('sending')) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
            
            if (model.get ('payment.gateway') === 'debit') {
                if (!this.hasClass ('active'))  { this.addClass ('active');         }
            } else {
                if (model.get ('selectedGateway') === 'debit') {
                    if (!this.hasClass ('selected'))    { this.addClass ('selected');       }
                } else {
                    if (this.hasClass ('selected'))     { this.removeClass ('selected');    }
                }
                
                if (this.hasClass ('active'))   { this.removeClass ('active');  }
            }
        }
        .observes ('sendingDebit').on ('change')
        .observes ('sending').on ('change')
        .observes ('errorDebit').on ('change')
        .observes ('selectedGateway').on ('change')
        .observes ('payment.gateway').on ('change')
        .observes ('delivery.gateway').on ('change'),

        isDebitSelected: function (model) {
            if (model.get ('selectedGateway') === 'debit') {
                if (!this.hasClass ('show'))  { this.addClass ('show');     }
            } else {
                if (this.hasClass ('show'))   { this.removeClass ('show');  }
            }
        }.observes ('selectedGateway').on ('change'),
        
        debitDataValid: function (model) {
            var country, iban, bic;
            
            country = model.get ('billing.country');

            iban    = model.get ('payment.iban');
            iban    = iban ? iban.length >= 22 : false;


            bic     = model.get ('payment.bic');
            bic     = bic ? !bic.empty () : country === 'Deutschland';
       
            if (iban && bic && !model.get ('sendingDebit')) {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            } else {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            }
        }
        .observes ('payment.iban').on ('change')
        .observes ('payment.bic').on ('change')
        .observes ('sendingDebit').on ('change'),

        failedDebit: function (model) {
            if (model.get ('errorDebit')) {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }
        .observes ('errorDebit').on ('change'),

        maskIBAN: function (model, src) {
            var $node, $nextNode, range, html, nHtml, maxLen, nLen;
            
            $('.iban-input br').remove ();

            $node    = np.dom.selection.getNode ();
            
            if ($node.attr ('class').search (/iban[0-9]/gim) > -1) {
                range   = np.dom.selection.getRange ();
                maxLen  = $node.data('length');

                $node.html ($node.html ().replace (/(\&.*\;)/gim,'').replace (/[\W_]+/gim, ''));

                html    = $node.html ();
                nHtml   = '';
                
                if (html.length > maxLen) { 
                    $node.html (html.slice (0, maxLen));
                    
                    nHtml   = html.slice (maxLen);
                }
                
                if (range.anchorOffset < maxLen) {
                    np.dom.selection.setRange ($node, range);
                } else {
                    $nextNode   = $node.next ();
                    
                    if ($nextNode.length > 0) {
                        $nextNode.html (nHtml);
                        
                        nLen    = $nextNode.html ().length;
                        
                        np.dom.selection.setRange ($nextNode, {anchorOffset: nLen, focusOffset: nLen});

                        $nextNode.change ();
                    }                    
                }
            }
        }.observes ('payment.iban').on ('change'),
        /* END SECTION Debit */
        
        /* BEGIN SECTION BankTransfer */
        isBankTransferAvailable: function (model) {
            if (isGatewayEnabled ('bank_transfer', model.get ('pGateways'))) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        isBankTransferEnabled: function (model) {
            if (model.get ('sending')) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
            
            if (model.get ('payment.gateway') === 'bank_transfer') {
                if (!this.hasClass ('active'))  { this.addClass ('active');         }
                if (this.hasClass ('selected')) { this.removeClass ('selected');    }
            } else {
                if (model.get ('selectedGateway') === 'bank_transfer') {
                    if (!this.hasClass ('selected'))    { this.addClass ('selected');       }
                } else {
                    if (this.hasClass ('selected'))     { this.removeClass ('selected');    }
                }
                
                if (this.hasClass ('active'))   { this.removeClass ('active');  }
            }
        }
        .observes ('sendingBankTransfer').on ('change')
        .observes ('sending').on ('change')
        .observes ('errorBankTransfer').on ('change')
        .observes ('payment.gateway').on ('change')
        .observes ('delivery.gateway').on ('change'),

        successBankTransfer: function (model) {
            if (!model.get ('errorBankTransfer') && model.get ('selectedGateway') === 'bank_transfer') {
                if (!this.hasClass ('show'))  { this.addClass ('show');     }
            } else {
                if (this.hasClass ('show'))   { this.removeClass ('show');  }
            }
        }
        .observes ('errorBankTransfer').on ('change')
        .observes ('selectedGateway').on ('change'),

        failedBankTransfer: function (model) {
            if (model.get ('errorBankTransfer') && model.get ('selectedGateway') === 'bank_transfer') {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }
        .observes ('errorBankTransfer').on ('change')
        .observes ('selectedGateway').on ('change'),
        /* END SECTION BankTransfer */
        
        /* BEGIN SECTION CoD */
        isCODAvailable: function (model) {
            if (isGatewayEnabled ('cod', model.get ('pGateways'))) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        },
        
        isCODEnabled: function (model) {
            if (model.get ('sending')) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');       }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
            
            if (model.get ('payment.gateway') === 'cod') {
                if (!this.hasClass ('active'))  { this.addClass ('active');         }
                if (this.hasClass ('selected')) { this.removeClass ('selected');    }                
            } else {
                if (model.get ('selectedGateway') === 'cod') {
                    if (!this.hasClass ('selected'))    { this.addClass ('selected');       }
                } else {
                    if (this.hasClass ('selected'))     { this.removeClass ('selected');    }
                }
                
                if (this.hasClass ('active'))   { this.removeClass ('active');  }
            }
        }
        .observes ('sendingCOD').on ('change')
        .observes ('sending').on ('change')
        .observes ('errorCOD').on ('change')
        .observes ('payment.gateway').on ('change')
        .observes ('delivery.gateway').on ('change'),

        
        isSendingCOD: function (model) {
            if (model.get ('sendingCOD')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingCOD').on ('change')
        .observes ('errorCOD').on ('change'),

        successCOD: function (model) {
            if (!model.get ('errorCOD') && model.get ('selectedGateway') === 'cod') {
                if (!this.hasClass ('show'))  { this.addClass ('show');     }
            } else {
                if (this.hasClass ('show'))   { this.removeClass ('show');  }
            }
        }
        .observes ('errorCOD').on ('change')
        .observes ('selectedGateway').on ('change'),

        failedCOD: function (model) {
            if (model.get ('errorCOD') && model.get ('selectedGateway') === 'cod') {
                if (!this.hasClass ('show'))    { this.addClass ('show');       }
            } else {
                if (this.hasClass ('show'))     { this.removeClass ('show');    }
            }
        }
        .observes ('errorCOD').on ('change')
        .observes ('selectedGateway').on ('change'),
        /* END SECTION CoD */
    };
}()));