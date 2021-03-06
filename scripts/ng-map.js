var ngMap = angular.module("ngMap", []);
! function() {
    "use strict";

    function camelCase(e) {
        return e.replace(SPECIAL_CHARS_REGEXP, function(e, t, n, o) {
            return o ? n.toUpperCase() : n
        }).replace(MOZ_HACK_REGEXP, "Moz$1")
    }

    function JSONize(e) {
        try {
            return JSON.parse(e), e
        } catch (t) {
            return e.replace(/([\$\w]+)\s*:/g, function(e, t) {
                return '"' + t + '":'
            }).replace(/'([^']+)'/g, function(e, t) {
                return '"' + t + '"'
            })
        }
    }
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g,
        MOZ_HACK_REGEXP = /^moz([A-Z])/,
        Attr2Options = function($parse, NavigatorGeolocation, GeoCoder) {
            var orgAttributes = function(e) {
                    e.length > 0 && (e = e[0]);
                    for (var t = {}, n = 0; n < e.attributes.length; n++) {
                        var o = e.attributes[n];
                        t[o.name] = o.value
                    }
                    return t
                },
                toOptionValue = function(input, options) {
                    var output, key = options.key,
                        scope = options.scope;
                    try {
                        var num = Number(input);
                        if (isNaN(num)) throw "Not a number";
                        output = num
                    } catch (err) {
                        try {
                            if (input.match(/^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/) && (input = "[" + input + "]"), output = JSON.parse(JSONize(input)), output instanceof Array) {
                                var t1stEl = output[0];
                                if (t1stEl.constructor == Object);
                                else if (t1stEl.constructor == Array) output = output.map(function(e) {
                                    return new google.maps.LatLng(e[0], e[1])
                                });
                                else if (!isNaN(parseFloat(t1stEl)) && isFinite(t1stEl)) return new google.maps.LatLng(output[0], output[1])
                            }
                        } catch (err2) {
                            if (input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/)) try {
                                var exp = "new google.maps." + input;
                                output = eval(exp)
                            } catch (e) {
                                output = input
                            } else if (input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/)) try {
                                var matches = input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);
                                output = google.maps[matches[1]][matches[2]]
                            } catch (e) {
                                output = input
                            } else if (input.match(/^[A-Z]+$/)) try {
                                var capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                                key.match(/temperatureUnit|windSpeedUnit|labelColor/) ? (capitalizedKey = capitalizedKey.replace(/s$/, ""), output = google.maps.weather[capitalizedKey][input]) : output = google.maps[capitalizedKey][input]
                            } catch (e) {
                                output = input
                            } else output = input
                        }
                    }
                    return output
                },
                setDelayedGeoLocation = function(e, t, n, o) {
                    o = o || {};
                    var r = e.centered || o.centered,
                        i = function() {
                            var n = o.fallbackLocation || new google.maps.LatLng(0, 0);
                            e[t](n)
                        };
                    !n || n.match(/^current/i) ? NavigatorGeolocation.getCurrentPosition().then(function(n) {
                        var i = n.coords.latitude,
                            a = n.coords.longitude,
                            s = new google.maps.LatLng(i, a);
                        e[t](s), r && e.map.setCenter(s), o.callback && o.callback.apply(e)
                    }, i) : GeoCoder.geocode({
                        address: n
                    }).then(function(n) {
                        e[t](n[0].geometry.location), r && e.map.setCenter(n[0].geometry.location)
                    }, i)
                },
                getAttrsToObserve = function(e) {
                    var t = [];
                    if (e["ng-repeat"] || e.ngRepeat);
                    else
                        for (var n in e) {
                            var o = e[n];
                            o && o.match(/\{\{.*\}\}/) && t.push(camelCase(n))
                        }
                    return t
                },
                observeAttrSetObj = function(e, t, n) {
                    var o = getAttrsToObserve(e);
                    Object.keys(o).length;
                    for (var r = 0; r < o.length; r++) observeAndSet(t, o[r], n)
                },
                observeAndSet = function(e, t, n) {
                    e.$observe(t, function(e) {
                        if (e) {
                            var o = camelCase("set-" + t),
                                r = toOptionValue(e, {
                                    key: t
                                });
                            n[o] && (t.match(/center|position/) && "string" == typeof r ? setDelayedGeoLocation(n, o, r) : n[o](r))
                        }
                    })
                },
                filter = function(e) {
                    var t = {};
                    for (var n in e) n.match(/^\$/) || n.match(/^ng[A-Z]/) || (t[n] = e[n]);
                    return t
                },
                getOptions = function(e, t) {
                    var n = {};
                    for (var o in e)
                        if (e[o]) {
                            if (o.match(/^on[A-Z]/)) continue;
                            if (o.match(/ControlOptions$/)) continue;
                            n[o] = toOptionValue(e[o], {
                                scope: t,
                                key: o
                            })
                        }
                    return n
                },
                getEvents = function(e, t) {
                    var n = {},
                        o = function(e) {
                            return "_" + e.toLowerCase()
                        },
                        r = function(t) {
                            var n = t.match(/([^\(]+)\(([^\)]*)\)/),
                                o = n[1],
                                r = n[2].replace(/event[ ,]*/, ""),
                                i = e.$eval("[" + r + "]");
                            return function(t) {
                                function n(e, t) {
                                    return e[t]
                                }
                                var r = o.split(".").reduce(n, e);
                                r.apply(this, [t].concat(i)), e.$apply()
                            }
                        };
                    for (var i in t)
                        if (t[i]) {
                            if (!i.match(/^on[A-Z]/)) continue;
                            var a = i.replace(/^on/, "");
                            a = a.charAt(0).toLowerCase() + a.slice(1), a = a.replace(/([A-Z])/g, o);
                            var s = t[i];
                            n[a] = new r(s)
                        }
                    return n
                },
                getControlOptions = function(e) {
                    var t = {};
                    if ("object" != typeof e) return !1;
                    for (var n in e)
                        if (e[n]) {
                            if (!n.match(/(.*)ControlOptions$/)) continue;
                            var o = e[n],
                                r = o.replace(/'/g, '"');
                            r = r.replace(/([^"]+)|("[^"]+")/g, function(e, t, n) {
                                return t ? t.replace(/([a-zA-Z0-9]+?):/g, '"$1":') : n
                            });
                            try {
                                var i = JSON.parse(r);
                                for (var a in i)
                                    if (i[a]) {
                                        var s = i[a];
                                        if ("string" == typeof s ? s = s.toUpperCase() : "mapTypeIds" === a && (s = s.map(function(e) {
                                                return e.match(/^[A-Z]+$/) ? google.maps.MapTypeId[e.toUpperCase()] : e
                                            })), "style" === a) {
                                            var c = n.charAt(0).toUpperCase() + n.slice(1),
                                                p = c.replace(/Options$/, "") + "Style";
                                            i[a] = google.maps[p][s]
                                        } else i[a] = "position" === a ? google.maps.ControlPosition[s] : s
                                    }
                                t[n] = i
                            } catch (l) {}
                        }
                    return t
                };
            return {
                filter: filter,
                getOptions: getOptions,
                getEvents: getEvents,
                getControlOptions: getControlOptions,
                toOptionValue: toOptionValue,
                setDelayedGeoLocation: setDelayedGeoLocation,
                getAttrsToObserve: getAttrsToObserve,
                observeAndSet: observeAndSet,
                observeAttrSetObj: observeAttrSetObj,
                orgAttributes: orgAttributes
            }
        };
    angular.module("ngMap").service("Attr2Options", ["$parse", "NavigatorGeolocation", "GeoCoder", Attr2Options])
}(),
function() {
    "use strict";
    var e = function(e) {
        return {
            geocode: function(t) {
                var n = e.defer(),
                    o = new google.maps.Geocoder;
                return o.geocode(t, function(e, t) {
                    t == google.maps.GeocoderStatus.OK ? n.resolve(e) : n.reject("Geocoder failed due to: " + t)
                }), n.promise
            }
        }
    };
    angular.module("ngMap").service("GeoCoder", ["$q", e])
}(),
function() {
    "use strict";
    var e = function(e) {
        return {
            getCurrentPosition: function() {
                var t = e.defer();
                return navigator.geolocation ? navigator.geolocation.getCurrentPosition(function(e) {
                    t.resolve(e)
                }, function(e) {
                    t.reject(e)
                }) : t.reject("Browser Geolocation service failed."), t.promise
            },
            watchPosition: function() {
                return "TODO"
            },
            clearWatch: function() {
                return "TODO"
            }
        }
    };
    angular.module("ngMap").service("NavigatorGeolocation", ["$q", e])
}(),
function() {
    "use strict";
    var e = function(e) {
        var t = function(t, n) {
                n = n || t.getCenter();
                var o = e.defer(),
                    r = new google.maps.StreetViewService;
                return r.getPanoramaByLocation(n || t.getCenter, 100, function(e, t) {
                    t === google.maps.StreetViewStatus.OK ? o.resolve(e.location.pano) : o.resolve(!1)
                }), o.promise
            },
            n = function(e, t) {
                var n = new google.maps.StreetViewPanorama(e.getDiv(), {
                    enableCloseButton: !0
                });
                n.setPano(t)
            };
        return {
            getPanorama: t,
            setPanorama: n
        }
    };
    angular.module("ngMap").service("StreetView", ["$q", e])
}(), ngMap.directive("bicyclingLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.BicyclingLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("bicyclingLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("biclclingLayers", l)
            })
        }
    }
}]), ngMap.directive("cloudLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.weather.CloudLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("cloudLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("cloudLayers", l)
            })
        }
    }
}]), ngMap.directive("customControl", ["Attr2Options", "$compile", function(e, t) {
    var n = e;
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            o.css("display", "none");
            var a = (n.orgAttributes(o), n.filter(r)),
                s = n.getOptions(a, e),
                c = n.getEvents(e, a),
                p = t(o.html().trim())(e),
                l = p[0];
            for (var u in c) google.maps.event.addDomListener(l, u, c[u]);
            i.addObject("customControls", l), e.$on("mapInitialized", function(e, t) {
                var n = s.position;
                t.controls[google.maps.ControlPosition[n]].push(l)
            })
        }
    }
}]), ngMap.directive("drawingManager", ["Attr2Options", function(e) {
    var t = e;
    return {
        restrict: "E",
        require: "^map",
        link: function(e, n, o, r) {
            var i = (t.orgAttributes(n), t.filter(o)),
                a = t.getOptions(i),
                s = t.getControlOptions(i),
                c = t.getEvents(e, i),
                p = new google.maps.drawing.DrawingManager({
                    drawingMode: a.drawingmode,
                    drawingControl: a.drawingcontrol,
                    drawingControlOptions: s.drawingControlOptions,
                    circleOptions: a.circleoptions,
                    markerOptions: a.markeroptions,
                    polygonOptions: a.polygonoptions,
                    polylineOptions: a.polylineoptions,
                    rectangleOptions: a.rectangleoptions
                }),
                c = t.getEvents(e, i);
            for (var l in c) google.maps.event.addListener(p, l, c[l]);
            r.addObject("mapDrawingManager", p)
        }
    }
}]), ngMap.directive("dynamicMapsEngineLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.visualization.DynamicMapsEngineLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.filter(r),
                s = t.getOptions(a),
                c = t.getEvents(e, a, c),
                p = n(s, c);
            i.addObject("mapsEngineLayers", p)
        }
    }
}]), ngMap.directive("fusionTablesLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.FusionTablesLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.filter(r),
                s = t.getOptions(a),
                c = t.getEvents(e, a, c),
                p = n(s, c);
            i.addObject("fusionTablesLayers", p)
        }
    }
}]), ngMap.directive("heatmapLayer", ["Attr2Options", "$window", function(e, t) {
    var n = e;
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = n.filter(r),
                s = n.getOptions(a);
            if (s.data = t[r.data] || e[r.data], !(s.data instanceof Array)) throw "invalid heatmap data";
            s.data = new google.maps.MVCArray(s.data); {
                var c = new google.maps.visualization.HeatmapLayer(s);
                n.getEvents(e, a)
            }
            i.addObject("heatmapLayers", c)
        }
    }
}]), ngMap.directive("infoWindow", ["Attr2Options", "$compile", "$timeout", function(Attr2Options, $compile, $timeout) {
    var parser = Attr2Options,
        getInfoWindow = function(options, events, element) {
            var infoWindow;
            if (!options.position || options.position instanceof google.maps.LatLng) infoWindow = new google.maps.InfoWindow(options);
            else {
                var address = options.position;
                delete options.position, infoWindow = new google.maps.InfoWindow(options);
                var callback = function() {
                    infoWindow.open(infoWindow.map)
                };
                parser.setDelayedGeoLocation(infoWindow, "setPosition", address, {
                    callback: callback
                })
            }
            Object.keys(events).length > 0;
            for (var eventName in events) eventName && google.maps.event.addListener(infoWindow, eventName, events[eventName]);
            var template = element.html().trim();
            if (1 != angular.element(template).length) throw "info-window working as a template must have a container";
            return infoWindow.__template = template.replace(/\s?ng-non-bindable[='"]+/, ""), infoWindow.__compile = function(e) {
                var t = $compile(infoWindow.__template)(e);
                e.$apply(), infoWindow.setContent(t[0])
            }, infoWindow.__eval = function() {
                var template = infoWindow.__template,
                    _this = this;
                return template = template.replace(/{{(event|this)[^;\}]+}}/g, function(match) {
                    var expression = match.replace(/[{}]/g, "").replace("this.", "_this.");
                    return eval(expression)
                })
            }, infoWindow.__open = function(e, t) {
                var n = this;
                $timeout(function() {
                    var o = infoWindow.__template;
                    infoWindow.__template = infoWindow.__eval.apply(n), infoWindow.__compile(e), t && t.getPosition ? infoWindow.open(infoWindow.map, t) : infoWindow.open(infoWindow.map), infoWindow.__template = o
                })
            }, infoWindow
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, t, n, o) {
            t.css("display", "none");
            var r = parser.orgAttributes(t),
                i = parser.filter(n),
                a = parser.getOptions(i, e),
                s = parser.getEvents(e, i),
                c = getInfoWindow(a, s, t);
            o.addObject("infoWindows", c), parser.observeAttrSetObj(r, n, c), t.bind("$destroy", function() {
                o.deleteObject("infoWindows", c)
            }), e.$on("mapInitialized", function(t, n) {
                if (c.map = n, c.visible && c.__open(e), c.visibleOnMarker) {
                    var o = c.visibleOnMarker;
                    c.__open(e, n.markers[o])
                }
            }), e.showInfoWindow = e.showInfoWindow || function(t, n, r) {
                var i = o.map.infoWindows[n],
                    a = r ? r : this.getPosition ? this : null;
                i.__open.apply(this, [e, a])
            }, e.hideInfoWindow = e.hideInfoWindow || function(e, t) {
                var n = o.map.infoWindows[t];
                n.close()
            }
        }
    }
}]), ngMap.directive("kmlLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.KmlLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("kmlLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("kmlLayers", l)
            })
        }
    }
}]), ngMap.directive("mapData", ["Attr2Options", function(e) {
    var t = e;
    return {
        restrict: "E",
        require: "^map",
        link: function(e, n, o) {
            var r = t.filter(o),
                i = t.getOptions(r),
                a = t.getEvents(e, r, a);
            e.$on("mapInitialized", function(t, n) {
                for (var o in i)
                    if (o) {
                        var r = i[o];
                        "function" == typeof e[r] ? n.data[o](e[r]) : n.data[o](r)
                    }
                for (var s in a) a[s] && n.data.addListener(s, a[s])
            })
        }
    }
}]), ngMap.directive("mapLazyLoad", ["$compile", "$timeout", function(e, t) {
    "use strict";
    var n = {
        compile: function(n, o) {
            !o.mapLazyLoad && void 0;
            var r = n.html(),
                i = o.mapLazyLoad;
            return document.querySelector('script[src="' + i + '?callback=lazyLoadCallback"]') ? !1 : (n.html(""), {
                pre: function(n, o) {
                    if (window.lazyLoadCallback = function() {
                            t(function() {
                                o.html(r), e(o.contents())(n)
                            }, 100)
                        }, void 0 === window.google || void 0 === window.google.maps) {
                        var a = document.createElement("script");
                        a.src = i + (i.indexOf("?") > -1 ? "&" : "?") + "callback=lazyLoadCallback", document.body.appendChild(a)
                    } else o.html(r), e(o.contents())(n)
                }
            })
        }
    };
    return n
}]), ngMap.directive("mapType", ["Attr2Options", "$window", function(e, t) {
    return {
        restrict: "E",
        require: "^map",
        link: function(e, n, o, r) {
            var i, a = o.name;
            if (!a) throw "invalid map-type name";
            if (o.object) {
                var s = e[o.object] ? e : t;
                i = s[o.object], "function" == typeof i && (i = new i)
            }
            if (!i) throw "invalid map-type object";
            e.$on("mapInitialized", function(e, t) {
                t.mapTypes.set(a, i)
            }), r.addObject("mapTypes", i)
        }
    }
}]), ngMap.directive("map", ["Attr2Options", "$timeout", function(e, t) {
    function n(e, t) {
        if (e.currentStyle) var n = e.currentStyle[t];
        else if (window.getComputedStyle) var n = document.defaultView.getComputedStyle(e, null).getPropertyValue(t);
        return n
    }
    var o = e;
    return {
        restrict: "AE",
        controller: ngMap.MapController,
        link: function(r, i, a, s) {
            var c = o.orgAttributes(i);
            r.google = google;
            var p = document.createElement("div");
            p.style.width = "100%", p.style.height = "100%", i.prepend(p), "block" != n(i[0], "display") && i.css("display", "block"), n(i[0], "height").match(/^(0|auto)/) && i.css("height", "300px");
            var l = function(n, i) {
                    var l = new google.maps.Map(p, {});
                    l.markers = {}, l.shapes = {}, t(function() {
                        google.maps.event.trigger(l, "resize")
                    }), n.zoom = n.zoom || 15;
                    var u = n.center;
                    u ? u instanceof google.maps.LatLng || (delete n.center, e.setDelayedGeoLocation(l, "setCenter", u, {
                        fallbackLocation: g.geoFallbackCenter
                    })) : n.center = new google.maps.LatLng(0, 0), l.setOptions(n);
                    for (var d in i) d && google.maps.event.addListener(l, d, i[d]);
                    o.observeAttrSetObj(c, a, l), s.map = l, s.addObjects(s._objects), r.map = l, r.map.scope = r, r.$emit("mapInitialized", l), r.maps = r.maps || {}, r.maps[g.id || Object.keys(r.maps).length] = l, r.$emit("mapsInitialized", r.maps)
                },
                u = o.filter(a),
                g = o.getOptions(u, r),
                d = o.getControlOptions(u),
                f = angular.extend(g, d),
                v = o.getEvents(r, u);
            a.initEvent ? r.$on(a.initEvent, function() {
                !s.map && l(f, v)
            }) : l(f, v)
        }
    }
}]), ngMap.MapController = function() {
    "use strict";
    this.map = null, this._objects = [], this.addObject = function(e, t) {
        if (this.map) {
            this.map[e] = this.map[e] || {};
            var n = Object.keys(this.map[e]).length;
            this.map[e][t.id || n] = t, "infoWindows" != e && t.setMap && t.setMap(this.map), t.centered && t.position && this.map.setCenter(t.position)
        } else t.groupName = e, this._objects.push(t)
    }, this.deleteObject = function(e, t) {
        var n = t.map[e];
        for (var o in n) n[o] === t && delete n[o];
        t.map && t.setMap(null)
    }, this.addObjects = function(e) {
        for (var t = 0; t < e.length; t++) {
            var n = e[t];
            n instanceof google.maps.Marker ? this.addObject("markers", n) : n instanceof google.maps.Circle || n instanceof google.maps.Polygon || n instanceof google.maps.Polyline || n instanceof google.maps.Rectangle || n instanceof google.maps.GroundOverlay ? this.addObject("shapes", n) : this.addObject(n.groupName, n)
        }
    }
}, ngMap.directive("mapsEngineLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.visualization.MapsEngineLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.filter(r),
                s = t.getOptions(a),
                c = t.getEvents(e, a, c),
                p = n(s, c);
            i.addObject("mapsEngineLayers", p)
        }
    }
}]), ngMap.directive("marker", ["Attr2Options", function(e) {
    "use strict";
    var t = e,
        n = function(e, n) {
            var o;
            if (e.icon instanceof Object) {
                ("" + e.icon.path).match(/^[A-Z_]+$/) && (e.icon.path = google.maps.SymbolPath[e.icon.path]);
                for (var r in e.icon) {
                    var i = e.icon[r];
                    "anchor" == r || "origin" == r ? e.icon[r] = new google.maps.Point(i[0], i[1]) : ("size" == r || "scaledSize" == r) && (e.icon[r] = new google.maps.Size(i[0], i[1]))
                }
            }
            if (e.position instanceof google.maps.LatLng) o = new google.maps.Marker(e);
            else {
                var a = e.position;
                e.position = new google.maps.LatLng(0, 0), o = new google.maps.Marker(e), t.setDelayedGeoLocation(o, "setPosition", a)
            }
            Object.keys(n).length > 0;
            for (var s in n) s && google.maps.event.addListener(o, s, n[s]);
            return o
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s, e),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("markers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("markers", l)
            })
        }
    }
}]), ngMap.directive("overlayMapType", ["Attr2Options", "$window", function(e, t) {
    return {
        restrict: "E",
        require: "^map",
        link: function(e, n, o, r) {
            var i, a = o.initMethod || "insertAt";
            if (o.object) {
                var s = e[o.object] ? e : t;
                i = s[o.object], "function" == typeof i && (i = new i)
            }
            if (!i) throw "invalid map-type object";
            e.$on("mapInitialized", function(e, t) {
                if ("insertAt" == a) {
                    var n = parseInt(o.index, 10);
                    t.overlayMapTypes.insertAt(n, i)
                } else "push" == a && t.overlayMapTypes.push(i)
            }), r.addObject("overlayMapTypes", i)
        }
    }
}]), ngMap.directive("shape", ["Attr2Options", function(e) {
    var t = e,
        n = function(e) {
            return new google.maps.LatLngBounds(e[0], e[1])
        },
        o = function(e, o) {
            var r, i = e.name;
            if (delete e.name, e.icons)
                for (var a = 0; a < e.icons.length; a++) {
                    var s = e.icons[a];
                    s.icon.path.match(/^[A-Z_]+$/) && (s.icon.path = google.maps.SymbolPath[s.icon.path])
                }
            switch (i) {
                case "circle":
                    if (e.center instanceof google.maps.LatLng) r = new google.maps.Circle(e);
                    else {
                        var c = e.center;
                        e.center = new google.maps.LatLng(0, 0), r = new google.maps.Circle(e), t.setDelayedGeoLocation(r, "setCenter", c)
                    }
                    break;
                case "polygon":
                    r = new google.maps.Polygon(e);
                    break;
                case "polyline":
                    r = new google.maps.Polyline(e);
                    break;
                case "rectangle":
                    e.bounds && (e.bounds = n(e.bounds)), r = new google.maps.Rectangle(e);
                    break;
                case "groundOverlay":
                case "image":
                    var p = e.url,
                        l = n(e.bounds),
                        u = {
                            opacity: e.opacity,
                            clickable: e.clickable,
                            id: e.id
                        };
                    r = new google.maps.GroundOverlay(p, l, u)
            }
            for (var g in o) o[g] && google.maps.event.addListener(r, g, o[g]);
            return r
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, n, r, i) {
            var a = t.orgAttributes(n),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = o(c, p);
            i.addObject("shapes", l), t.observeAttrSetObj(a, r, l), n.bind("$destroy", function() {
                i.deleteObject("shapes", l)
            })
        }
    }
}]), ngMap.directive("trafficLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.TrafficLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("trafficLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("trafficLayers", l)
            })
        }
    }
}]), ngMap.directive("transitLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.TransitLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("transitLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("transitLayers", l)
            })
        }
    }
}]), ngMap.directive("weatherLayer", ["Attr2Options", function(e) {
    var t = e,
        n = function(e, t) {
            var n = new google.maps.weather.WeatherLayer(e);
            for (var o in t) google.maps.event.addListener(n, o, t[o]);
            return n
        };
    return {
        restrict: "E",
        require: "^map",
        link: function(e, o, r, i) {
            var a = t.orgAttributes(o),
                s = t.filter(r),
                c = t.getOptions(s),
                p = t.getEvents(e, s),
                l = n(c, p);
            i.addObject("weatherLayers", l), t.observeAttrSetObj(a, r, l), o.bind("$destroy", function() {
                i.deleteObject("weatherLayers", l)
            })
        }
    }
}]);