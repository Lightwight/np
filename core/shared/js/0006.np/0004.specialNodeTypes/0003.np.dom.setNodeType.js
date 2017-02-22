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

np.module ('dom.setNodeType', (function () {
    var boundAutocomplete;
    
    boundAutocomplete   = false;
    
    function createMap (domElem, zoom) {
        return new google.maps.Map (domElem, {
            zoom:   zoom,
            center: {lat: 0, lng: 0}
        });        
    }
    
    function createGeocoder () { 
        var geocoder    = new google.maps.Geocoder ();
        
        return {
            getAddress: function (address) {
                var promise;
                
                promise = np.Promise ();
                
                geocoder.geocode ({address: address}, function (results, status) {
                    var location, placeID, lat, lng;

                    if (status == google.maps.GeocoderStatus.OK) {
                        location    = results[0].geometry.location;
                        lat         = parseFloat (location.lat ());
                        lng         = parseFloat (location.lng ());

                        placeID     = results[0].place_id;

                        promise.then ({latlng: {lat: lat, lng: lng}, placeID: placeID});
                    } else { 
                        promise.fail (results);
                    }
                });                
                
                return promise;
            },
            
            getPlace: function (latLng) {
                var promise;
                
                promise = np.Promise ();

                geocoder.geocode ({location: latLng}, function (results, status) {
                    var adress, location, placeID, lat, lng;

                    if (status == google.maps.GeocoderStatus.OK) {
                        adress      = results[0].formatted_address;
                        location    = results[0].geometry.location;
                        lat         = parseFloat (location.lat ());
                        lng         = parseFloat (location.lng ());

                        placeID     = results[0].place_id;

                        promise.then ({latlng: {lat: lat, lng: lng}, placeID: placeID, adress: adress, place: results[0]});
                    } else { 
                        promise.fail (results);
                    }
                });                
                
                return promise;                
            }
        };
    }
    
    function createMarker (map, title, latlng) {
        var marker;
        
        marker  = new google.maps.Marker ({
            map:        map,
            title:      title,
            position:   latlng
        });
        
        return marker;
    }
    
    function createInfoWindow (content) {
        var info;
        
        info    = new google.maps.InfoWindow ({
            content:    content
        });
        
        return info;
    }
    
    function geolocationFailed (errorCode) {
        var errorTitle, errorMessages;

        errorTitle      = 'Fehler bei der Lokalisierung';
        errorMessages   = {
            1:  'Sie haben die Geolokalisierung deaktiviert.<br>Aktivieren Sie die Geolokalisierung in Ihrem Browser um die Funktion nutzen zu können',
            2:  'Ihr Standort konnte nicht ermittelt werden.<br>Bitte versuchen Sie es zu einem späteren Zeitpunkt wieder.',
            3:  'Die Standortabfrage dauerte zu lange.<br>Bitte versuchen Sie es zu einem späteren Zeitpunkt wieder.',
            4:  'Ihr Standort konnte aufgrund eines unbekannten Fehlers nicht ermittelt werden.<br>Bitte versuchen Sie es zu einem späteren Zeitpunkt wieder.'
        };

        vex.open ({
            className: 'vex-theme-top',
            content: '<h3>'+errorTitle+'</h3><br><span>'+errorMessages[errorCode]+'</span>.<br><br><b>Firma</b><br><br><b>Slogan</b><br><br></span>'
        });
    }
    
    function createRouteWindow (nodeID, map, gInfo, sourceID, type, geocoder) {
        var directionService, directionDisplay, prependix, appendix;

        directionService    = new google.maps.DirectionsService;
        directionDisplay    = new google.maps.DirectionsRenderer;

        directionDisplay.setMap (map);

        function gmapsBindEvents (nodeID, map, sourceID, type, directionDisplay)
        {
            var $locateMe, $inputDest, inputDest, place, dPanel;
            
            place   = false;
            
            function expandRouteViewport (map, place) {
                if (place.geometry.viewport) {
                    map.fitBounds (place.geometry.viewport);
                } else {
                    map.setCenter (place.geometry.location);
                    map.setZoom (17);
                }
            }
            
            if ($('#np-gmaps-'+nodeID).length > 0) {
                $locateMe   = $('#np-gmaps-'+nodeID+' .find-me-container');
                $inputDest  = $('#np-gmaps-'+nodeID+' .gmaps-autocomplete');
                
                inputDest   = new google.maps.places.Autocomplete ($('#np-gmaps-'+nodeID+' .gmaps-autocomplete')[0]);

                $locateMe.click (function () {
                    $.geolocation.get ({
                        maximumAge:     0,
                        highAccuracy:   true,
                        
                        win: function (position) {
                            var coords;

                            coords  = new google.maps.LatLng (position.coords.latitude, position.coords.longitude);

                            geocoder.getPlace (coords)
                            .then (function (result) {
                                $inputDest.val (result.adress);
                                place   = result.place;
                            })
                            .fail (function () {
                                geolocationFailed (2);
                            });
                        },
                        fail: function (error) {
                            geolocationFailed (error.code);
                        }
                    });
                }); 

                inputDest.bindTo ('bounds', map);
                inputDest.addListener ('place_changed', function () {
                    place   = inputDest.getPlace ();

                    if (!place.geometry) { place = false;}
                });

                if (type === 'panelLeft') {
                    dPanel  = $('#np-gmaps-'+nodeID).parents ('.gmaps-outer-panelLeft:first').find ('.gmaps-route-info')[0];
                    
                    $('#np-gmaps-'+nodeID).parents ('.gmaps-outer-panelLeft:first').find ('.gmaps-toggle-panel:first').click (function () {
                        $(this).parents ('.gmaps-outer-panelLeft:first').toggleClass ('open');
                    });
                } else if (type === 'panelTop') {
                    dPanel  = $('#np-gmaps-'+nodeID).parents ('.gmaps-outer-panelTop:first').find ('.gmaps-route-info')[0];
                    
                    $('#np-gmaps-'+nodeID).parents ('.gmaps-outer-panelTop:first').find ('.gmaps-toggle-panel:first').click (function () {
                        $(this).parents ('.gmaps-outer-panelTop:first').toggleClass ('open');
                    });
                }
                
                $('#np-gmaps-'+nodeID+' .gmaps-calc-route button').click (function () {
                    $('#np-gmaps-'+nodeID+' .gmaps-autocomplete').removeClass ('invalid');

                    if (place && typeof place.geometry !== 'undefined') {
                        expandRouteViewport (map, place);

                        directionService.route ({
                            origin:       {'placeId': place.place_id },
                            destination:  {'placeId': sourceID},
                            travelMode:   (function () {
                                var mappings, activeMode;

                                mappings    = {
                                    drive:      google.maps.TravelMode.DRIVING,
                                    transit:    google.maps.TravelMode.TRANSIT,
                                    walk:       google.maps.TravelMode.WALKING
                                };

                                activeMode  = mappings [$('#np-gmaps-'+nodeID+' .gmaps-travel-mode button.active').data ('travel-mode')];

                                return activeMode;
                            }())
                        }, function (response, status) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                directionDisplay.setDirections (response);
                                directionDisplay.setPanel (dPanel);
                            } else {
                                /* error on request.*/
                            }
                        });                        
                    } else {
                        $('#np-gmaps-'+nodeID+' .gmaps-autocomplete').addClass ('invalid');
                        $('#np-gmaps-'+nodeID+' .gmaps-autocomplete').val ('');
                        $('#np-gmaps-'+nodeID+' .gmaps-autocomplete').prop ('placeholder', 'Bitte geben Sie eine gültige Startadresse ein');
                    }
                });
                
                $('#np-gmaps-'+nodeID + ' .gmaps-travel-mode button').click (function () {
                    var $buttons;

                    $buttons    = $(this).parents ('div:first').find ('button');

                    $buttons.removeClass ('active');
                    $(this).addClass ('active');
                });
            } else {
                window.setTimeout (function () {gmapsBindEvents (nodeID, map, sourceID, type, directionDisplay);}, 10);
            }
        }

        gInfo  +=   '<div id="np-gmaps-'+nodeID+'" class="gmaps-directions">' +
                        '<div class="gmaps-input-destination">' +
                            '<input class="gmaps-autocomplete" type="text" placeholder="Hier können Sie Ihre Startadresse eingeben">' +
                            '<div class="find-me-container">' +
                                '<span class="glyphicon glyphicon-map-marker"></span>' +
                                '<span class="text">Standort ermitteln</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="gmaps-travel-mode">' +
                            '<button type="button" class="active btn btn-creme no-text gmaps-tr-car" data-travel-mode="drive"><span class="fa fa-car"></span></button>' +
                            '<button type="button" class="btn btn-creme no-text gmaps-tr-train" data-travel-mode="transit"><span class="fa fa-train"></span></button>' +
                            '<button type="button" class="btn btn-creme no-text gmaps-tr-walking" data-travel-mode="walk"><span class="fa fa-user"></span></button>' +
                        '</div>' +
                        '<div class="gmaps-calc-route">' +
                            '<button type="button" class="btn btn-primary">Route berechnen</button>' +
                        '</div>' +
                    '</div>';
            
        gmapsBindEvents (nodeID, map, sourceID, type, directionDisplay);            
        
        prependix   = '';
        appendix    = '';
        
        if (type === 'panelLeft' || type === 'panelTop') {
            prependix   = '<div class="gmaps-toggle-panel"></div>';
            appendix    = '<div class="gmaps-route-info"></div>';
        }

        return '<div class="gmaps-outer-'+type+'">'+prependix+gInfo+appendix+'</div>';
    }
    
    function createMapsOverlay (selector, height) {
        var overlay;
        
        overlay     = '<div class="gmaps-overlay" style="height: '+height+'">' +
                        '<div class="fa fa-2x fa-angle-double-up"></div>' +
                        '<div class="fa fa-2x fa-angle-double-down"></div>' +
                      '</div>';
        
        selector.prepend (overlay);
    }
    
    return function (selector, type, nodeID, context, subscriber) {
        switch (type) {
            case 'recaptcha':
                setDivRecaptcha (selector, nodeID, context, subscriber);

                break;
            case 'gmaps':
                setDivGMaps (selector, nodeID, context, subscriber);

                break;
        }

        function setDivRecaptcha (selector, nodeID, context, subscriber) {
            np.gcaptcha.addCaptcha (nodeID, context, subscriber);
        }
                
        function setDivGMaps (selector, nodeID, context, subscriber) {
            var selector, view, viewNodeID, viewName, viewManip, 
                controller, gmaps, map,
                gInit,
                defaults, options,
                geocoder,
                gCenter, gZoom, gMarker, gInfo, gServices, gOverlay, gOverlayHeight,
                gRoute, gInfoType;
            
            defaults        = {
                center:         '',
                marker:     { 
                    address:    '',
                    title:      ''
                },
                info:           false,
                infoType:       'panelTop',
                services:   {
                    route:      false
                },
                zoom:           15,
                overlay:        false,
                overlayHeight:  '100%'
            };

            selector        = $('[data-node="'+nodeID+'"]');
            selector.addClass ('np-gmaps');
            selector.append ('<div class="gmaps-area"></div>');
            
            view            = selector.parents ('[data-type="view"]:first');
            viewNodeID      = parseInt (view.data ('node'), 10);
            viewName        = view.data ('handle');
            viewManip       = np.view.manip (viewNodeID, context);;

            controller      = np.controller.getByView (viewName);
            
            gmaps           = controller && typeof controller.gmaps !== 'undefined' ? controller.gmaps : false;
            gInit           = gmaps && typeof  gmaps.init === 'function' ? gmaps.init : function () { return defaults; };
            
            if (!gmaps) {
                /*TODO: np.info - no gmaps object in controller */
            } else {
                options        = $.extend (defaults, gInit.call (subscriber, viewManip));

                gCenter         = options.center;
                gMarker         = options.marker;
                gInfo           = options.info;
                gInfoType       = options.infoType;
                gZoom           = options.zoom;
                gServices       = options.services;
                gRoute          = gServices.route;
                gOverlay        = options.overlay;
                gOverlayHeight  = options.overlayHeight;
                
                map             = createMap (selector.find ('.gmaps-area')[0], gZoom);
                geocoder        = createGeocoder ();
                
                geocoder.getAddress (gCenter)
                .then (function (response)  { map.setCenter (response.latlng);          })
                .fail (function (results)   { /*TODO: Implement Center not found */     });

                geocoder.getAddress (gMarker.address)
                .then (function (response) {
                    var marker, info, latlng, sourceID;
                    
                    latlng      = response.latlng;
                    sourceID    = response.placeID;
                    
                    marker  = createMarker (map, gMarker.title, latlng);

                    if (gOverlay) {
                        gOverlay    = createMapsOverlay (selector, gOverlayHeight);
                    }
                    
                    if (gInfo) {
                        if (gRoute) {
                            gInfo   = createRouteWindow (nodeID, map, gInfo, sourceID, gInfoType, geocoder);
                        } 
                        
                        if (gInfoType === 'info') {
                            info    = createInfoWindow (gInfo);
                            
                            info.open (map, marker);

                            marker.addListener ('click', function () {
                                info.open (map, marker);
                            });
                        } else if (gInfoType === 'control') {
                            map.controls[google.maps.ControlPosition.LEFT_TOP].push ($(gInfo)[0]);
                        } else if (gInfoType === 'panelLeft' || gInfoType === 'panelTop') {
                            selector.prepend ($(gInfo));
                        }
                    } 
                })
                .fail (function (results) { /* TODO: Info no marker set*/ });
            }
        }
    };
})());