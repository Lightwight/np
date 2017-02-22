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

np.view.extend ('AdminRouteEditView', (function () {
    return {
        didInsert: function () {
            $('#route_frequency').niceSelect ();
            $('#route_priority').niceSelect ();
            
            np.wysiwyg.init (this ());
        },

        initCrawlable: function (model) {
            if (model.get ('crawlable')) {
                this.addClass ('active');
            } else {
                this.removeClass ('active');
            }
        }.observes ('crawlable').on ('change'),
        
        initNotCrawlable: function (model) {
            if (!model.get ('crawlable')) {
                this.addClass ('active');
            } else {
                this.removeClass ('active');
            }
        }.observes ('crawlable').on ('change'),

        showOnCrawlable: function (model) {
            if (model.get ('crawlable')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('crawlable').on ('change'),

        validTitle: function (model) {
            if (!model.get ('title').empty ()) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('title').on ('change'),

        notEditRoute: function (model) {
            if (!model.get ('editRoute')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('editRoute').on ('change'),

        editRoute: function (model) {
            if (model.get ('editRoute')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('editRoute').on ('change'),

        invalidRoute: function (model) {
            if (model.get ('route').empty ()) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('route').on ('change'),

        validRoute: function (model) {
            if (!model.get ('route').empty ()) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('route').on ('change'),

        isContentEnabled: function (model) {
            if (model.get ('content_enabled')) {
                this.removeClass ('no-display');
            } else {
                this.addClass ('no-display');
            }
        }.observes ('content_enabled').on ('change'),

        setContent: function (model) {
            if (this.html () !== model.get ('content')) {
                this.html (model.get ('content'));
            }
        }.observes ('content').on ('change'),

        setEnabled: function (model) {
            if (model.get ('enabled')) {
                this.prop ('checked', 'checked');
            } else {
                this.prop ('checked', '');
            }
        }.observes ('enabled').on ('change'),

        setForce: function (model) {
            if (!model.get ('force')) {
                this.prop ('checked', 'checked');
            } else {
                this.prop ('checked', '');
            }
        },
        
        setContentEnabled: function (model) {
            if (model.get ('content_enabled')) {
                this.prop ('checked', 'checked');
            } else {
                this.prop ('checked', '');
            }
        },

        setSeoFrequency: function (model) {
            var freq;

            freq    = model.get ('seo_frequency') + 1;

            this.find ('option').each (function () {
                $(this).prop ('selected', '');
            });

            this.find ('option:nth-child('+freq+')').prop ('selected', 'selected');
        },

        setSeoPriority: function (model) {
            var freq;

            freq    = model.get ('seo_priority') + 1;

            this.find ('option').each (function () {
                $(this).prop ('selected', '');
            });

            this.find ('option:nth-child('+freq+')').prop ('selected', 'selected');
        },

        validSeoDescription: function (model) {
            if (!model.get ('seo_description').empty ()) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('seo_description').on ('change'),

        validSeoKeywords: function (model) {
            var keywords;

            keywords    = model.get ('seo_keywords');

            if (!keywords.empty () && keywords.split (' ').length < 12) {
                this.addClass ('fadeIn');
            } else {
                this.removeClass ('fadeIn');
            }
        }.observes ('seo_keywords').on ('change'),

        savingPageContent: function (model) {
            if (model.get ('savingPageContent')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('savingPageContent').on ('change'),

        disableSavePageContent: function (model) {
            if (model.get ('savingPageContent')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('savingPageContent').on ('change'),

        errorPageContent: function (model) {
            var error, title, message;
            
            if (model.get ('errorPageContent') === true) {
                title       = 'Speichervorgang fehlgeschlagen';
                error       = model.get ('error');

                message     = 'Der Seinteinhalt konnte nicht gespeichert werden<br><br>';
                message    += 'Bitte wiederholen Sie den Vorgang.';
                message    += 'Sollte der Fehler erneut auftauchen, dann konaktieren Sie Ihren Serviceanbieter.';

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
                });            
            }
        }.observes ('errorPageContent').on ('change'),

        savingPluginsSettings: function (model) {
            if (model.get ('savingPluginsSettings')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('savingPluginsSettings').on ('change'),
        
        disableSavePluginSettings: function (model) {
            if (model.get ('savingPluginsSettings')) {
                this.addClass ('disable');
            } else {
                this.removeClass ('disable');
            }
        }.observes ('savingPluginsSettings').on ('change'),
        
        errorPluginsSettings: function (model) {
            var error, title, message;
            
            if (model.get ('errorPluginsSettings') === true) {
                title       = 'Speichervorgang fehlgeschlagen';
                error       = model.get ('error');

                message     = 'Die Plugineinstellungen konnten nicht gespeichert werden<br><br>';
                message    += 'Bitte wiederholen Sie den Vorgang.';
                message    += 'Sollte der Fehler erneut auftauchen, dann konaktieren Sie Ihren Serviceanbieter.';

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
                });            
            }
        }.observes ('errorPluginsSettings').on ('change'),

        savingRouteSettings: function (model) {
            if (model.get ('savingRouteSettings')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('savingRouteSettings').on ('change'),
        
        disableSaveRouteSettings: function (model) {
            if (model.get ('savingRouteSettings')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('savingRouteSettings').on ('change'),
        
        errorRouteSettings: function (model) {
            var error, title, message;
            
            if (model.get ('errorRouteSettings') === true) {
                title       = 'Speichervorgang fehlgeschlagen';
                error       = model.get ('error');

                message     = 'Die Seiteneinstellungen konnten nicht gespeichert werden<br><br>';
                message    += 'Bitte wiederholen Sie den Vorgang.';
                message    += 'Sollte der Fehler erneut auftauchen, dann konaktieren Sie Ihren Serviceanbieter.';

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
                });            
            }
        }.observes ('errorRouteSettings').on ('change'),

        savingSeoSettings: function (model) {
            if (model.get ('savingSeoSettings')) {
                this.addClass ('show');
            } else {
                this.removeClass ('show');
            }
        }.observes ('savingSeoSettings').on ('change'),
        
        disableSavingPageSeo: function (model) {
            if (model.get ('savingSeoSettings')) {
                this.addClass ('disabled');
            } else {
                this.removeClass ('disabled');
            }
        }.observes ('savingSeoSettings').on ('change'),
        
        errorSeoSettings: function (model) {
            var error, title, message;
            
            if (model.get ('errorSeoSettings') === true) {
                title       = 'Speichervorgang fehlgeschlagen';
                error       = model.get ('error');

                message     = 'Die SEO Angaben konnten nicht gespeichert werden<br><br>';
                message    += 'Bitte wiederholen Sie den Vorgang.';
                message    += 'Sollte der Fehler erneut auftauchen, dann konaktieren Sie Ihren Serviceanbieter.';

                vex.dialog.open ({
                    className:  'vex-theme-top',
                    message:    '<h3>'+title+'</h3><br><span>'+message+'</span>'
                });            
            }
        }.observes ('errorSeoSettings').on ('change')
    };
})());