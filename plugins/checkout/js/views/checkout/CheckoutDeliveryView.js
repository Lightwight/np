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

np.view.extend ('CheckoutDeliveryView', (function () {
    return {
        isDHLEnabled: function (model) {
            if (model.get ('payment.verification') === 0) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');   }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
        }.observes ('payment.verification').on ('change'),
        
        isUPSEnabled: function (model) {
            if (model.get ('payment.verification') === 0) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');   }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
        }.observes ('payment.verification').on ('change'),
        
        isHermesEnabled: function (model) {
            if (model.get ('payment.verification') === 0) {
                if (!this.hasClass ('disabled'))    { this.addClass ('disabled');   }
            } else {
                if (this.hasClass ('disabled'))     { this.removeClass ('disabled');    }
            }
        }.observes ('payment.verification').on ('change'),
        
        isPaymentSelected: function (model) {
            if (model.get ('payment.verification') !== 0) {
                if (this.hasClass ('fadeIn'))   { this.removeClass ('fadeIn');  }
            } else {
                if (!this.hasClass ('fadeIn'))  { this.addClass ('fadeIn');     }
            }
        }.observes ('payment.verification').on ('change'),
        
        DHLVerified: function (model) {
            if (model.get ('delivery.gateway') === 'dhl' && model.get ('payment.verification') === 1) {
                if (!this.hasClass ('fadeIn'))      { this.addClass ('fadeIn');         }
                if (this.hasClass ('fadeOut'))      { this.removeClass ('fadeOut');     }
            } else {
                if (!this.hasClass ('fadeOut'))     { this.addClass ('fadeOut');        }
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');      }
            }
        }.observes ('delivery.gateway').on ('change'),
        
        UPSVerified: function (model) {
            if (model.get ('delivery.gateway') === 'ups' && model.get ('payment.verification') === 1) {
                if (!this.hasClass ('fadeIn'))      { this.addClass ('fadeIn');         }
                if (this.hasClass ('fadeOut'))      { this.removeClass ('fadeOut');     }
            } else {
                if (!this.hasClass ('fadeOut'))     { this.addClass ('fadeOut');        }
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');      }
            }
        }.observes ('delivery.gateway').on ('change'),
        
        HermesVerified: function (model) {
            if (model.get ('delivery.gateway') === 'hermes' && model.get ('payment.verification') === 1) {
                if (!this.hasClass ('fadeIn'))      { this.addClass ('fadeIn');         }
                if (this.hasClass ('fadeOut'))      { this.removeClass ('fadeOut');     }
            } else {
                if (!this.hasClass ('fadeOut'))     { this.addClass ('fadeOut');        }
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');      }
            }
        }.observes ('delivery.gateway').on ('change'),

        isSendingDHL: function (model) {
            if (model.get ('sendingDHL')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingDHL').on ('change')
        .observes ('errorDHL').on ('change'),

        isSendingUPS: function (model) {
            if (model.get ('sendingUPS')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingUPS').on ('change')
        .observes ('errorUPS').on ('change'),

        isSendingHermes: function (model) {
            if (model.get ('sendingHermes')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingHermes').on ('change')
        .observes ('errorHermes').on ('change'),

        notSendingDHL: function (model) {
            if (!model.get ('sendingDHL')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingDHL').on ('change')
        .observes ('errorDHL').on ('change'),

        notSendingUPS: function (model) {
            if (!model.get ('sendingUPS')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingUPS').on ('change')
        .observes ('errorUPS').on ('change'),

        notSendingHermes: function (model) {
            if (!model.get ('sendingHermes')) {
                if (this.hasClass ('hidden'))   { this.removeClass ('hidden');  }
            } else {
                if (!this.hasClass ('hidden'))  { this.addClass ('hidden');     }
            }
        }
        .observes ('sendingHermes').on ('change')
        .observes ('errorHermes').on ('change'),

        hasErrorDHL: function (model) {
            if (model.get ('errorDHL')) {
                var title, type, message;

                type       = 'error';
                title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Auswahl fehlgeschlagen</h4>';
                message    = '';

                message   += 'Die Versandart konnte nicht ausge&auml;hlt werden!<br><br>';
                message   += 'Bitte versuchen Sie es in ein paar Minuten erneut.<br>';
                message   += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';

                np.ui.dialog.show (type, title, message);
            }
        }.observes ('errorDHL').on ('change'),
        
        hasErrorUPS: function (model) {
            if (model.get ('errorUPS')) {
                var title, type, message;

                type        = 'error';
                title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Auswahl fehlgeschlagen</h4>';
                message     = '';

                message   += 'Die Versandart konnte nicht ausge&auml;hlt werden!<br><br>';
                message   += 'Bitte versuchen Sie es in ein paar Minuten erneut.<br>';
                message   += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';

                np.ui.dialog.show (type, title, message);
            }
        }.observes ('errorUPS').on ('change'),
        
        hasErrorHermes: function (model) {
            if (model.get ('errorHermes')) {
                var title, type, message;

                type        = 'error';
                title       = '<span class="glyphicon glyphicon-info-sign"></span><h4>Auswahl fehlgeschlagen</h4>';
                message     = '';

                message   += 'Die Versandart konnte nicht ausge&auml;hlt werden!<br><br>';
                message   += 'Bitte versuchen Sie es in ein paar Minuten erneut.<br>';
                message   += 'Sollte der Fehler erneut auftauchen, dann w&uuml;rden wir uns &uuml;ber einen pers&ouml;nlichen Kontakt mit Ihnen freuen und den Fehler so schnell wie möglich beheben.';

                np.ui.dialog.show (type, title, message);
            }
        }.observes ('errorHermes').on ('change'),
        
        setDHLPrice: function (model) {
            var gateways, gateway, payment, html;
            
            gateways    = np.checkout.getOrder ('delivery_gateways');
            gateway     = typeof gateways.DHL !== 'undefined' 
                          && typeof gateways.DHL.packages !== 'undefined' 
                          && $.isArray (gateways.DHL.packages)
                          && gateways.DHL.packages.length > 0
                          && typeof gateways.DHL.total === 'number' ? gateways.DHL : false;
                  
            payment     = model.get ('payment.verification');

            if (payment === 1) {
                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');        }
            
                if (gateway) {
                    if (gateway.packages.length === 1) {
                        html    = 'Es wird <b>'+gateway.packages.length+ '</b> Paket versendet.<br>';
                    } else {
                        html    = 'Es werden <b>'+gateway.packages.length+ '</b> Pakete versendet.<br>';
                    }

                    html   += 'Der Versandpreis liegt bei <b>'+gateway.total+' &euro;</b>.';
                    
                    if (gateway.cod !== 0) {
                        html   += '<br>Zzgl. Nachnahmegebühren von <b>'+gateway.cod+' &euro;</b>.';
                    }
                    
                    this.html (html);
                } else {
                    this.html ('Versankosten k&ouml;nnen nicht ermittelt werden.');
                }
            } else {
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');  }
            }
        }
        .observes ('payment.verification').on ('change')
        .observes ('dGateways').on ('change'),
        
        setUPSPrice: function (model) {
            var gateways, gateway, payment, html;
                    
            gateways    = np.checkout.getOrder ('delivery_gateways');
            gateway     = typeof gateways.UPS !== 'undefined' 
                          && typeof gateways.UPS.packages !== 'undefined' 
                          && $.isArray (gateways.UPS.packages)
                          && gateways.UPS.packages.length > 0
                          && typeof gateways.UPS.total === 'number' ? gateways.UPS : false;
                  
            payment     = model.get ('payment.verification');
            
            if (payment === 1) {
                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');        }
                
                if (gateway) {
                    if (gateway.packages.length === 1) {
                        html    = 'Es wird <b>'+gateway.packages.length+ '</b> Paket versendet.<br>';
                    } else {
                        html    = 'Es werden <b>'+gateway.packages.length+ '</b> Pakete versendet.<br>';
                    }

                    html   += 'Der Versandpreis liegt bei <b>'+gateway.total+' &euro;</b>.';
                    
                    if (gateway.cod !== 0) {
                        html   += '<br>Zzgl. Nachnahmegebühren von <b>'+gateway.cod+' &euro;</b>.';
                    }
                    
                    this.html (html);
                } else {
                    this.html ('Versankosten k&ouml;nnen nicht ermittelt werden.');
                }
            } else {
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');  }                
            }
        }
        .observes ('payment.verification').on ('change')
        .observes ('dGateways').on ('change'),
        
        setHermesPrice: function (model) {
            var gateways, gateway, payment, html;
                    
            gateways    = np.checkout.getOrder ('delivery_gateways');
            gateway     = typeof gateways.Hermes !== 'undefined' 
                          && typeof gateways.Hermes.packages !== 'undefined' 
                          && $.isArray (gateways.Hermes.packages)
                          && gateways.Hermes.packages.length > 0
                          && typeof gateways.Hermes.total === 'number' ? gateways.Hermes : false;
                  
            payment     = model.get ('payment.verification');
            
            if (payment === 1) {
                if (!this.hasClass ('fadeIn'))   { this.addClass ('fadeIn');        }

                if (gateway) {
                    if (gateway.packages.length === 1) {
                        html    = 'Es wird <b>'+gateway.packages.length+ '</b> Paket versendet.<br>';
                    } else {
                        html    = 'Es werden <b>'+gateway.packages.length+ '</b> Pakete versendet.<br>';
                    }

                    html   += 'Der Versandpreis liegt bei <b>'+gateway.total+' &euro;</b>.';
                    
                    if (gateway.cod !== 0) {
                        html   += '<br>Zzgl. Nachnahmegebühren von <b>'+gateway.cod+' &euro;</b>.';
                    }
                    
                    this.html (html);
                } else {
                    this.html ('Versandkosten k&ouml;nnen nicht ermittelt werden.');
                }
            } else {
                if (this.hasClass ('fadeIn'))       { this.removeClass ('fadeIn');  }
            }
        }
        .observes ('payment.verification').on ('change')
        .observes ('dGateways').on ('change')
    };
}()));