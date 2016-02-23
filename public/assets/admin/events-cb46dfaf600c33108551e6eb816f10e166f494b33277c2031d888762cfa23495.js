
;(function(){

    /**
     * Require the module at `name`.
     *
     * @param {String} name
     * @return {Object} exports
     * @api public
     */

    function require(name) {
        var module = require.modules[name];
        if (!module) throw new Error('failed to require "' + name + '"');

        if (!('exports' in module) && typeof module.definition === 'function') {
            module.client = module.component = true;
            module.definition.call(this, module.exports = {}, module);
            delete module.definition;
        }

        return module.exports;
    }

    /**
     * Registered modules.
     */

    require.modules = {};

    /**
     * Register module at `name` with callback `definition`.
     *
     * @param {String} name
     * @param {Function} definition
     * @api private
     */

    require.register = function (name, definition) {
        require.modules[name] = {
            definition: definition
        };
    };

    /**
     * Define a module's exports immediately with `exports`.
     *
     * @param {String} name
     * @param {Generic} exports
     * @api private
     */

    require.define = function (name, exports) {
        require.modules[name] = {
            exports: exports
        };
    };
    require.register("component~emitter@1.1.2", function (exports, module) {

        /**
         * Expose `Emitter`.
         */

        module.exports = Emitter;

        /**
         * Initialize a new `Emitter`.
         *
         * @api public
         */

        function Emitter(obj) {
            if (obj) return mixin(obj);
        };

        /**
         * Mixin the emitter properties.
         *
         * @param {Object} obj
         * @return {Object}
         * @api private
         */

        function mixin(obj) {
            for (var key in Emitter.prototype) {
                obj[key] = Emitter.prototype[key];
            }
            return obj;
        }

        /**
         * Listen on the given `event` with `fn`.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.on =
            Emitter.prototype.addEventListener = function(event, fn){
                this._callbacks = this._callbacks || {};
                (this._callbacks[event] = this._callbacks[event] || [])
                    .push(fn);
                return this;
            };

        /**
         * Adds an `event` listener that will be invoked a single
         * time then automatically removed.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.once = function(event, fn){
            var self = this;
            this._callbacks = this._callbacks || {};

            function on() {
                self.off(event, on);
                fn.apply(this, arguments);
            }

            on.fn = fn;
            this.on(event, on);
            return this;
        };

        /**
         * Remove the given callback for `event` or all
         * registered callbacks.
         *
         * @param {String} event
         * @param {Function} fn
         * @return {Emitter}
         * @api public
         */

        Emitter.prototype.off =
            Emitter.prototype.removeListener =
                Emitter.prototype.removeAllListeners =
                    Emitter.prototype.removeEventListener = function(event, fn){
                        this._callbacks = this._callbacks || {};

                        // all
                        if (0 == arguments.length) {
                            this._callbacks = {};
                            return this;
                        }

                        // specific event
                        var callbacks = this._callbacks[event];
                        if (!callbacks) return this;

                        // remove all handlers
                        if (1 == arguments.length) {
                            delete this._callbacks[event];
                            return this;
                        }

                        // remove specific handler
                        var cb;
                        for (var i = 0; i < callbacks.length; i++) {
                            cb = callbacks[i];
                            if (cb === fn || cb.fn === fn) {
                                callbacks.splice(i, 1);
                                break;
                            }
                        }
                        return this;
                    };

        /**
         * Emit `event` with the given args.
         *
         * @param {String} event
         * @param {Mixed} ...
         * @return {Emitter}
         */

        Emitter.prototype.emit = function(event){
            this._callbacks = this._callbacks || {};
            var args = [].slice.call(arguments, 1)
                , callbacks = this._callbacks[event];

            if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) {
                    callbacks[i].apply(this, args);
                }
            }

            return this;
        };

        /**
         * Return array of callbacks for `event`.
         *
         * @param {String} event
         * @return {Array}
         * @api public
         */

        Emitter.prototype.listeners = function(event){
            this._callbacks = this._callbacks || {};
            return this._callbacks[event] || [];
        };

        /**
         * Check if this emitter has `event` handlers.
         *
         * @param {String} event
         * @return {Boolean}
         * @api public
         */

        Emitter.prototype.hasListeners = function(event){
            return !! this.listeners(event).length;
        };

    });

    require.register("dropzone", function (exports, module) {


        /**
         * Exposing dropzone
         */
        module.exports = require("dropzone/lib/dropzone.js");

    });

    require.register("dropzone/lib/dropzone.js", function (exports, module) {

        /*
         *
         * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
         *
         * Copyright (c) 2012, Matias Meno
         *
         * Permission is hereby granted, free of charge, to any person obtaining a copy
         * of this software and associated documentation files (the "Software"), to deal
         * in the Software without restriction, including without limitation the rights
         * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
         * copies of the Software, and to permit persons to whom the Software is
         * furnished to do so, subject to the following conditions:
         *
         * The above copyright notice and this permission notice shall be included in
         * all copies or substantial portions of the Software.
         *
         * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
         * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
         * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
         * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
         * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
         * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
         * THE SOFTWARE.
         *
         */

        (function() {
            var Dropzone, Em, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
                __hasProp = {}.hasOwnProperty,
                __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
                __slice = [].slice;

            Em = typeof Emitter !== "undefined" && Emitter !== null ? Emitter : require("component~emitter@1.1.2");

            noop = function() {};

            Dropzone = (function(_super) {
                var extend;

                __extends(Dropzone, _super);


                /*
                 This is a list of all available events you can register on a dropzone object.

                 You can register an event handler like this:

                 dropzone.on("dragEnter", function() { });
                 */

                Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached"];

                Dropzone.prototype.defaultOptions = {
                    url: null,
                    method: "post",
                    withCredentials: false,
                    parallelUploads: 2,
                    uploadMultiple: false,
                    maxFilesize: 256,
                    paramName: "file",
                    createImageThumbnails: true,
                    maxThumbnailFilesize: 10,
                    thumbnailWidth: 100,
                    thumbnailHeight: 100,
                    maxFiles: null,
                    params: {},
                    clickable: true,
                    ignoreHiddenFiles: true,
                    acceptedFiles: null,
                    acceptedMimeTypes: null,
                    autoProcessQueue: true,
                    autoQueue: true,
                    addRemoveLinks: false,
                    previewsContainer: null,
                    dictDefaultMessage: "Drop files here to upload",
                    dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
                    dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
                    dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
                    dictInvalidFileType: "You can't upload files of this type.",
                    dictResponseError: "Server responded with {{statusCode}} code.",
                    dictCancelUpload: "Cancel upload",
                    dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
                    dictRemoveFile: "Remove file",
                    dictRemoveFileConfirmation: null,
                    dictMaxFilesExceeded: "You can not upload any more files.",
                    accept: function(file, done) {
                        return done();
                    },
                    init: function() {
                        return noop;
                    },
                    forceFallback: false,
                    fallback: function() {
                        var child, messageElement, span, _i, _len, _ref;
                        this.element.className = "" + this.element.className + " dz-browser-not-supported";
                        _ref = this.element.getElementsByTagName("div");
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            if (/(^| )dz-message($| )/.test(child.className)) {
                                messageElement = child;
                                child.className = "dz-message";
                                continue;
                            }
                        }
                        if (!messageElement) {
                            messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
                            this.element.appendChild(messageElement);
                        }
                        span = messageElement.getElementsByTagName("span")[0];
                        if (span) {
                            span.textContent = this.options.dictFallbackMessage;
                        }
                        return this.element.appendChild(this.getFallbackForm());
                    },
                    resize: function(file) {
                        var info, srcRatio, trgRatio;
                        info = {
                            srcX: 0,
                            srcY: 0,
                            srcWidth: file.width,
                            srcHeight: file.height
                        };
                        srcRatio = file.width / file.height;
                        trgRatio = this.options.thumbnailWidth / this.options.thumbnailHeight;
                        if (file.height < this.options.thumbnailHeight || file.width < this.options.thumbnailWidth) {
                            info.trgHeight = info.srcHeight;
                            info.trgWidth = info.srcWidth;
                        } else {
                            if (srcRatio > trgRatio) {
                                info.srcHeight = file.height;
                                info.srcWidth = info.srcHeight * trgRatio;
                            } else {
                                info.srcWidth = file.width;
                                info.srcHeight = info.srcWidth / trgRatio;
                            }
                        }
                        info.srcX = (file.width - info.srcWidth) / 2;
                        info.srcY = (file.height - info.srcHeight) / 2;
                        return info;
                    },

                    /*
                     Those functions register themselves to the events on init and handle all
                     the user interface specific stuff. Overwriting them won't break the upload
                     but can break the way it's displayed.
                     You can overwrite them if you don't like the default behavior. If you just
                     want to add an additional event handler, register it on the dropzone object
                     and don't overwrite those options.
                     */
                    drop: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragstart: noop,
                    dragend: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    dragenter: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragover: function(e) {
                        return this.element.classList.add("dz-drag-hover");
                    },
                    dragleave: function(e) {
                        return this.element.classList.remove("dz-drag-hover");
                    },
                    paste: noop,
                    reset: function() {
                        return this.element.classList.remove("dz-started");
                    },
                    addedfile: function(file) {
                        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
                        if (this.element === this.previewsContainer) {
                            this.element.classList.add("dz-started");
                        }
                        file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
                        file.previewTemplate = file.previewElement;
                        this.previewsContainer.appendChild(file.previewElement);
                        _ref = file.previewElement.querySelectorAll("[data-dz-name]");
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            node.textContent = file.name;
                        }
                        _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
                        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                            node = _ref1[_j];
                            node.innerHTML = this.filesize(file.size);
                        }
                        if (this.options.addRemoveLinks) {
                            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
                            file.previewElement.appendChild(file._removeLink);
                        }
                        removeFileEvent = (function(_this) {
                            return function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (file.status === Dropzone.UPLOADING) {
                                    return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                                        return _this.removeFile(file);
                                    });
                                } else {
                                    if (_this.options.dictRemoveFileConfirmation) {
                                        return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                                            return _this.removeFile(file);
                                        });
                                    } else {
                                        return _this.removeFile(file);
                                    }
                                }
                            };
                        })(this);
                        _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
                        _results = [];
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            removeLink = _ref2[_k];
                            _results.push(removeLink.addEventListener("click", removeFileEvent));
                        }
                        return _results;
                    },
                    removedfile: function(file) {
                        var _ref;
                        if ((_ref = file.previewElement) != null) {
                            _ref.parentNode.removeChild(file.previewElement);
                        }
                        return this._updateMaxFilesReachedClass();
                    },
                    thumbnail: function(file, dataUrl) {
                        var thumbnailElement, _i, _len, _ref, _results;
                        file.previewElement.classList.remove("dz-file-preview");
                        file.previewElement.classList.add("dz-image-preview");
                        _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            thumbnailElement = _ref[_i];
                            thumbnailElement.alt = file.name;
                            _results.push(thumbnailElement.src = dataUrl);
                        }
                        return _results;
                    },
                    error: function(file, message) {
                        var node, _i, _len, _ref, _results;
                        file.previewElement.classList.add("dz-error");
                        if (typeof message !== "String" && message.error) {
                            message = message.error;
                        }
                        _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            _results.push(node.textContent = message);
                        }
                        return _results;
                    },
                    errormultiple: noop,
                    processing: function(file) {
                        file.previewElement.classList.add("dz-processing");
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictCancelUpload;
                        }
                    },
                    processingmultiple: noop,
                    uploadprogress: function(file, progress, bytesSent) {
                        var node, _i, _len, _ref, _results;
                        _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            node = _ref[_i];
                            _results.push(node.style.width = "" + progress + "%");
                        }
                        return _results;
                    },
                    totaluploadprogress: noop,
                    sending: noop,
                    sendingmultiple: noop,
                    success: function(file) {
                        return file.previewElement.classList.add("dz-success");
                    },
                    successmultiple: noop,
                    canceled: function(file) {
                        return this.emit("error", file, "Upload canceled.");
                    },
                    canceledmultiple: noop,
                    complete: function(file) {
                        if (file._removeLink) {
                            return file._removeLink.textContent = this.options.dictRemoveFile;
                        }
                    },
                    completemultiple: noop,
                    maxfilesexceeded: noop,
                    maxfilesreached: noop,
                    previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-details\">\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n    <div class=\"dz-size\" data-dz-size></div>\n    <img data-dz-thumbnail />\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-success-mark\"><span>✔</span></div>\n  <div class=\"dz-error-mark\"><span>✘</span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n</div>"
                };

                extend = function() {
                    var key, object, objects, target, val, _i, _len;
                    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                    for (_i = 0, _len = objects.length; _i < _len; _i++) {
                        object = objects[_i];
                        for (key in object) {
                            val = object[key];
                            target[key] = val;
                        }
                    }
                    return target;
                };

                function Dropzone(element, options) {
                    var elementOptions, fallback, _ref;
                    this.element = element;
                    this.version = Dropzone.version;
                    this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
                    this.clickableElements = [];
                    this.listeners = [];
                    this.files = [];
                    if (typeof this.element === "string") {
                        this.element = document.querySelector(this.element);
                    }
                    if (!(this.element && (this.element.nodeType != null))) {
                        throw new Error("Invalid dropzone element.");
                    }
                    if (this.element.dropzone) {
                        throw new Error("Dropzone already attached.");
                    }
                    Dropzone.instances.push(this);
                    this.element.dropzone = this;
                    elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
                    this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
                    if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
                        return this.options.fallback.call(this);
                    }
                    if (this.options.url == null) {
                        this.options.url = this.element.getAttribute("action");
                    }
                    if (!this.options.url) {
                        throw new Error("No URL provided.");
                    }
                    if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
                        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
                    }
                    if (this.options.acceptedMimeTypes) {
                        this.options.acceptedFiles = this.options.acceptedMimeTypes;
                        delete this.options.acceptedMimeTypes;
                    }
                    this.options.method = this.options.method.toUpperCase();
                    if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
                        fallback.parentNode.removeChild(fallback);
                    }
                    if (this.options.previewsContainer) {
                        this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
                    } else {
                        this.previewsContainer = this.element;
                    }
                    if (this.options.clickable) {
                        if (this.options.clickable === true) {
                            this.clickableElements = [this.element];
                        } else {
                            this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
                        }
                    }
                    this.init();
                }

                Dropzone.prototype.getAcceptedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getRejectedFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (!file.accepted) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getFilesWithStatus = function(status) {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === status) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.getQueuedFiles = function() {
                    return this.getFilesWithStatus(Dropzone.QUEUED);
                };

                Dropzone.prototype.getUploadingFiles = function() {
                    return this.getFilesWithStatus(Dropzone.UPLOADING);
                };

                Dropzone.prototype.getActiveFiles = function() {
                    var file, _i, _len, _ref, _results;
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
                            _results.push(file);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype.init = function() {
                    var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
                    if (this.element.tagName === "form") {
                        this.element.setAttribute("enctype", "multipart/form-data");
                    }
                    if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
                        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
                    }
                    if (this.clickableElements.length) {
                        setupHiddenFileInput = (function(_this) {
                            return function() {
                                if (_this.hiddenFileInput) {
                                    document.body.removeChild(_this.hiddenFileInput);
                                }
                                _this.hiddenFileInput = document.createElement("input");
                                _this.hiddenFileInput.setAttribute("type", "file");
                                if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
                                    _this.hiddenFileInput.setAttribute("multiple", "multiple");
                                }
                                _this.hiddenFileInput.className = "dz-hidden-input";
                                if (_this.options.acceptedFiles != null) {
                                    _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
                                }
                                _this.hiddenFileInput.style.visibility = "hidden";
                                _this.hiddenFileInput.style.position = "absolute";
                                _this.hiddenFileInput.style.top = "0";
                                _this.hiddenFileInput.style.left = "0";
                                _this.hiddenFileInput.style.height = "0";
                                _this.hiddenFileInput.style.width = "0";
                                document.body.appendChild(_this.hiddenFileInput);
                                return _this.hiddenFileInput.addEventListener("change", function() {
                                    var file, files, _i, _len;
                                    files = _this.hiddenFileInput.files;
                                    if (files.length) {
                                        for (_i = 0, _len = files.length; _i < _len; _i++) {
                                            file = files[_i];
                                            _this.addFile(file);
                                        }
                                    }
                                    return setupHiddenFileInput();
                                });
                            };
                        })(this);
                        setupHiddenFileInput();
                    }
                    this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
                    _ref1 = this.events;
                    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                        eventName = _ref1[_i];
                        this.on(eventName, this.options[eventName]);
                    }
                    this.on("uploadprogress", (function(_this) {
                        return function() {
                            return _this.updateTotalUploadProgress();
                        };
                    })(this));
                    this.on("removedfile", (function(_this) {
                        return function() {
                            return _this.updateTotalUploadProgress();
                        };
                    })(this));
                    this.on("canceled", (function(_this) {
                        return function(file) {
                            return _this.emit("complete", file);
                        };
                    })(this));
                    this.on("complete", (function(_this) {
                        return function(file) {
                            if (_this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
                                return setTimeout((function() {
                                    return _this.emit("queuecomplete");
                                }), 0);
                            }
                        };
                    })(this));
                    noPropagation = function(e) {
                        e.stopPropagation();
                        if (e.preventDefault) {
                            return e.preventDefault();
                        } else {
                            return e.returnValue = false;
                        }
                    };
                    this.listeners = [
                        {
                            element: this.element,
                            events: {
                                "dragstart": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragstart", e);
                                    };
                                })(this),
                                "dragenter": (function(_this) {
                                    return function(e) {
                                        noPropagation(e);
                                        return _this.emit("dragenter", e);
                                    };
                                })(this),
                                "dragover": (function(_this) {
                                    return function(e) {
                                        var efct;
                                        try {
                                            efct = e.dataTransfer.effectAllowed;
                                        } catch (_error) {}
                                        e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                                        noPropagation(e);
                                        return _this.emit("dragover", e);
                                    };
                                })(this),
                                "dragleave": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragleave", e);
                                    };
                                })(this),
                                "drop": (function(_this) {
                                    return function(e) {
                                        noPropagation(e);
                                        return _this.drop(e);
                                    };
                                })(this),
                                "dragend": (function(_this) {
                                    return function(e) {
                                        return _this.emit("dragend", e);
                                    };
                                })(this)
                            }
                        }
                    ];
                    this.clickableElements.forEach((function(_this) {
                        return function(clickableElement) {
                            return _this.listeners.push({
                                element: clickableElement,
                                events: {
                                    "click": function(evt) {
                                        if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                                            return _this.hiddenFileInput.click();
                                        }
                                    }
                                }
                            });
                        };
                    })(this));
                    this.enable();
                    return this.options.init.call(this);
                };

                Dropzone.prototype.destroy = function() {
                    var _ref;
                    this.disable();
                    this.removeAllFiles(true);
                    if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
                        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
                        this.hiddenFileInput = null;
                    }
                    delete this.element.dropzone;
                    return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
                };

                Dropzone.prototype.updateTotalUploadProgress = function() {
                    var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
                    totalBytesSent = 0;
                    totalBytes = 0;
                    activeFiles = this.getActiveFiles();
                    if (activeFiles.length) {
                        _ref = this.getActiveFiles();
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            totalBytesSent += file.upload.bytesSent;
                            totalBytes += file.upload.total;
                        }
                        totalUploadProgress = 100 * totalBytesSent / totalBytes;
                    } else {
                        totalUploadProgress = 100;
                    }
                    return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
                };

                Dropzone.prototype.getFallbackForm = function() {
                    var existingFallback, fields, fieldsString, form;
                    if (existingFallback = this.getExistingFallback()) {
                        return existingFallback;
                    }
                    fieldsString = "<div class=\"dz-fallback\">";
                    if (this.options.dictFallbackText) {
                        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
                    }
                    fieldsString += "<input type=\"file\" name=\"" + this.options.paramName + (this.options.uploadMultiple ? "[]" : "") + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
                    fields = Dropzone.createElement(fieldsString);
                    if (this.element.tagName !== "FORM") {
                        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
                        form.appendChild(fields);
                    } else {
                        this.element.setAttribute("enctype", "multipart/form-data");
                        this.element.setAttribute("method", this.options.method);
                    }
                    return form != null ? form : fields;
                };

                Dropzone.prototype.getExistingFallback = function() {
                    var fallback, getFallback, tagName, _i, _len, _ref;
                    getFallback = function(elements) {
                        var el, _i, _len;
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )fallback($| )/.test(el.className)) {
                                return el;
                            }
                        }
                    };
                    _ref = ["div", "form"];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        tagName = _ref[_i];
                        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
                            return fallback;
                        }
                    }
                };

                Dropzone.prototype.setupEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.addEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.removeEventListeners = function() {
                    var elementListeners, event, listener, _i, _len, _ref, _results;
                    _ref = this.listeners;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        elementListeners = _ref[_i];
                        _results.push((function() {
                            var _ref1, _results1;
                            _ref1 = elementListeners.events;
                            _results1 = [];
                            for (event in _ref1) {
                                listener = _ref1[event];
                                _results1.push(elementListeners.element.removeEventListener(event, listener, false));
                            }
                            return _results1;
                        })());
                    }
                    return _results;
                };

                Dropzone.prototype.disable = function() {
                    var file, _i, _len, _ref, _results;
                    this.clickableElements.forEach(function(element) {
                        return element.classList.remove("dz-clickable");
                    });
                    this.removeEventListeners();
                    _ref = this.files;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        _results.push(this.cancelUpload(file));
                    }
                    return _results;
                };

                Dropzone.prototype.enable = function() {
                    this.clickableElements.forEach(function(element) {
                        return element.classList.add("dz-clickable");
                    });
                    return this.setupEventListeners();
                };

                Dropzone.prototype.filesize = function(size) {
                    var string;
                    if (size >= 1024 * 1024 * 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 * 1024 * 1024 / 10);
                        string = "TiB";
                    } else if (size >= 1024 * 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 * 1024 / 10);
                        string = "GiB";
                    } else if (size >= 1024 * 1024 / 10) {
                        size = size / (1024 * 1024 / 10);
                        string = "MiB";
                    } else if (size >= 1024 / 10) {
                        size = size / (1024 / 10);
                        string = "KiB";
                    } else {
                        size = size * 10;
                        string = "b";
                    }
                    return "<strong>" + (Math.round(size) / 10) + "</strong> " + string;
                };

                Dropzone.prototype._updateMaxFilesReachedClass = function() {
                    if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        if (this.getAcceptedFiles().length === this.options.maxFiles) {
                            this.emit('maxfilesreached', this.files);
                        }
                        return this.element.classList.add("dz-max-files-reached");
                    } else {
                        return this.element.classList.remove("dz-max-files-reached");
                    }
                };

                Dropzone.prototype.drop = function(e) {
                    var files, items;
                    if (!e.dataTransfer) {
                        return;
                    }
                    this.emit("drop", e);
                    files = e.dataTransfer.files;
                    if (files.length) {
                        items = e.dataTransfer.items;
                        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
                            this._addFilesFromItems(items);
                        } else {
                            this.handleFiles(files);
                        }
                    }
                };

                Dropzone.prototype.paste = function(e) {
                    var items, _ref;
                    if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
                        return;
                    }
                    this.emit("paste", e);
                    items = e.clipboardData.items;
                    if (items.length) {
                        return this._addFilesFromItems(items);
                    }
                };

                Dropzone.prototype.handleFiles = function(files) {
                    var file, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        _results.push(this.addFile(file));
                    }
                    return _results;
                };

                Dropzone.prototype._addFilesFromItems = function(items) {
                    var entry, item, _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = items.length; _i < _len; _i++) {
                        item = items[_i];
                        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
                            if (entry.isFile) {
                                _results.push(this.addFile(item.getAsFile()));
                            } else if (entry.isDirectory) {
                                _results.push(this._addFilesFromDirectory(entry, entry.name));
                            } else {
                                _results.push(void 0);
                            }
                        } else if (item.getAsFile != null) {
                            if ((item.kind == null) || item.kind === "file") {
                                _results.push(this.addFile(item.getAsFile()));
                            } else {
                                _results.push(void 0);
                            }
                        } else {
                            _results.push(void 0);
                        }
                    }
                    return _results;
                };

                Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
                    var dirReader, entriesReader;
                    dirReader = directory.createReader();
                    entriesReader = (function(_this) {
                        return function(entries) {
                            var entry, _i, _len;
                            for (_i = 0, _len = entries.length; _i < _len; _i++) {
                                entry = entries[_i];
                                if (entry.isFile) {
                                    entry.file(function(file) {
                                        if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                                            return;
                                        }
                                        file.fullPath = "" + path + "/" + file.name;
                                        return _this.addFile(file);
                                    });
                                } else if (entry.isDirectory) {
                                    _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
                                }
                            }
                        };
                    })(this);
                    return dirReader.readEntries(entriesReader, function(error) {
                        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
                    });
                };

                Dropzone.prototype.accept = function(file, done) {
                    if (file.size > this.options.maxFilesize * 1024 * 1024) {
                        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
                    } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
                        return done(this.options.dictInvalidFileType);
                    } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
                        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
                        return this.emit("maxfilesexceeded", file);
                    } else {
                        return this.options.accept.call(this, file, done);
                    }
                };

                Dropzone.prototype.addFile = function(file) {
                    file.upload = {
                        progress: 0,
                        total: file.size,
                        bytesSent: 0
                    };
                    this.files.push(file);
                    file.status = Dropzone.ADDED;
                    this.emit("addedfile", file);
                    this._enqueueThumbnail(file);
                    return this.accept(file, (function(_this) {
                        return function(error) {
                            if (error) {
                                file.accepted = false;
                                _this._errorProcessing([file], error);
                            } else {
                                file.accepted = true;
                                if (_this.options.autoQueue) {
                                    _this.enqueueFile(file);
                                }
                            }
                            return _this._updateMaxFilesReachedClass();
                        };
                    })(this));
                };

                Dropzone.prototype.enqueueFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        this.enqueueFile(file);
                    }
                    return null;
                };

                Dropzone.prototype.enqueueFile = function(file) {
                    if (file.status === Dropzone.ADDED && file.accepted === true) {
                        file.status = Dropzone.QUEUED;
                        if (this.options.autoProcessQueue) {
                            return setTimeout(((function(_this) {
                                return function() {
                                    return _this.processQueue();
                                };
                            })(this)), 0);
                        }
                    } else {
                        throw new Error("This file can't be queued because it has already been processed or was rejected.");
                    }
                };

                Dropzone.prototype._thumbnailQueue = [];

                Dropzone.prototype._processingThumbnail = false;

                Dropzone.prototype._enqueueThumbnail = function(file) {
                    if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
                        this._thumbnailQueue.push(file);
                        return setTimeout(((function(_this) {
                            return function() {
                                return _this._processThumbnailQueue();
                            };
                        })(this)), 0);
                    }
                };

                Dropzone.prototype._processThumbnailQueue = function() {
                    if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
                        return;
                    }
                    this._processingThumbnail = true;
                    return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
                        return function() {
                            _this._processingThumbnail = false;
                            return _this._processThumbnailQueue();
                        };
                    })(this));
                };

                Dropzone.prototype.removeFile = function(file) {
                    if (file.status === Dropzone.UPLOADING) {
                        this.cancelUpload(file);
                    }
                    this.files = without(this.files, file);
                    this.emit("removedfile", file);
                    if (this.files.length === 0) {
                        return this.emit("reset");
                    }
                };

                Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
                    var file, _i, _len, _ref;
                    if (cancelIfNecessary == null) {
                        cancelIfNecessary = false;
                    }
                    _ref = this.files.slice();
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        file = _ref[_i];
                        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
                            this.removeFile(file);
                        }
                    }
                    return null;
                };

                Dropzone.prototype.createThumbnail = function(file, callback) {
                    var fileReader;
                    fileReader = new FileReader;
                    fileReader.onload = (function(_this) {
                        return function() {
                            var img;
                            img = document.createElement("img");
                            img.onload = function() {
                                var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
                                file.width = img.width;
                                file.height = img.height;
                                resizeInfo = _this.options.resize.call(_this, file);
                                if (resizeInfo.trgWidth == null) {
                                    resizeInfo.trgWidth = _this.options.thumbnailWidth;
                                }
                                if (resizeInfo.trgHeight == null) {
                                    resizeInfo.trgHeight = _this.options.thumbnailHeight;
                                }
                                canvas = document.createElement("canvas");
                                ctx = canvas.getContext("2d");
                                canvas.width = resizeInfo.trgWidth;
                                canvas.height = resizeInfo.trgHeight;
                                drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
                                thumbnail = canvas.toDataURL("image/png");
                                _this.emit("thumbnail", file, thumbnail);
                                if (callback != null) {
                                    return callback();
                                }
                            };
                            return img.src = fileReader.result;
                        };
                    })(this);
                    return fileReader.readAsDataURL(file);
                };

                Dropzone.prototype.processQueue = function() {
                    var i, parallelUploads, processingLength, queuedFiles;
                    parallelUploads = this.options.parallelUploads;
                    processingLength = this.getUploadingFiles().length;
                    i = processingLength;
                    if (processingLength >= parallelUploads) {
                        return;
                    }
                    queuedFiles = this.getQueuedFiles();
                    if (!(queuedFiles.length > 0)) {
                        return;
                    }
                    if (this.options.uploadMultiple) {
                        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
                    } else {
                        while (i < parallelUploads) {
                            if (!queuedFiles.length) {
                                return;
                            }
                            this.processFile(queuedFiles.shift());
                            i++;
                        }
                    }
                };

                Dropzone.prototype.processFile = function(file) {
                    return this.processFiles([file]);
                };

                Dropzone.prototype.processFiles = function(files) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.processing = true;
                        file.status = Dropzone.UPLOADING;
                        this.emit("processing", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("processingmultiple", files);
                    }
                    return this.uploadFiles(files);
                };

                Dropzone.prototype._getFilesWithXhr = function(xhr) {
                    var file, files;
                    return files = (function() {
                        var _i, _len, _ref, _results;
                        _ref = this.files;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            file = _ref[_i];
                            if (file.xhr === xhr) {
                                _results.push(file);
                            }
                        }
                        return _results;
                    }).call(this);
                };

                Dropzone.prototype.cancelUpload = function(file) {
                    var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
                    if (file.status === Dropzone.UPLOADING) {
                        groupedFiles = this._getFilesWithXhr(file.xhr);
                        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
                            groupedFile = groupedFiles[_i];
                            groupedFile.status = Dropzone.CANCELED;
                        }
                        file.xhr.abort();
                        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
                            groupedFile = groupedFiles[_j];
                            this.emit("canceled", groupedFile);
                        }
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", groupedFiles);
                        }
                    } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
                        file.status = Dropzone.CANCELED;
                        this.emit("canceled", file);
                        if (this.options.uploadMultiple) {
                            this.emit("canceledmultiple", [file]);
                        }
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype.uploadFile = function(file) {
                    return this.uploadFiles([file]);
                };

                Dropzone.prototype.uploadFiles = function(files) {
                    var file, formData, handleError, headerName, headerValue, headers, input, inputName, inputType, key, option, progressObj, response, updateProgress, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4;
                    xhr = new XMLHttpRequest();
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.xhr = xhr;
                    }
                    xhr.open(this.options.method, this.options.url, true);
                    xhr.withCredentials = !!this.options.withCredentials;
                    response = null;
                    handleError = (function(_this) {
                        return function() {
                            var _j, _len1, _results;
                            _results = [];
                            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                                file = files[_j];
                                _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
                            }
                            return _results;
                        };
                    })(this);
                    updateProgress = (function(_this) {
                        return function(e) {
                            var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
                            if (e != null) {
                                progress = 100 * e.loaded / e.total;
                                for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                                    file = files[_j];
                                    file.upload = {
                                        progress: progress,
                                        total: e.total,
                                        bytesSent: e.loaded
                                    };
                                }
                            } else {
                                allFilesFinished = true;
                                progress = 100;
                                for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
                                    file = files[_k];
                                    if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                                        allFilesFinished = false;
                                    }
                                    file.upload.progress = progress;
                                    file.upload.bytesSent = file.upload.total;
                                }
                                if (allFilesFinished) {
                                    return;
                                }
                            }
                            _results = [];
                            for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
                                file = files[_l];
                                _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
                            }
                            return _results;
                        };
                    })(this);
                    xhr.onload = (function(_this) {
                        return function(e) {
                            var _ref;
                            if (files[0].status === Dropzone.CANCELED) {
                                return;
                            }
                            if (xhr.readyState !== 4) {
                                return;
                            }
                            response = xhr.responseText;
                            if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
                                try {
                                    response = JSON.parse(response);
                                } catch (_error) {
                                    e = _error;
                                    response = "Invalid JSON response from server.";
                                }
                            }
                            updateProgress();
                            if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
                                return handleError();
                            } else {
                                return _this._finished(files, response, e);
                            }
                        };
                    })(this);
                    xhr.onerror = (function(_this) {
                        return function() {
                            if (files[0].status === Dropzone.CANCELED) {
                                return;
                            }
                            return handleError();
                        };
                    })(this);
                    progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
                    progressObj.onprogress = updateProgress;
                    headers = {
                        "Accept": "application/json",
                        "Cache-Control": "no-cache",
                        "X-Requested-With": "XMLHttpRequest"
                    };
                    if (this.options.headers) {
                        extend(headers, this.options.headers);
                    }
                    for (headerName in headers) {
                        headerValue = headers[headerName];
                        xhr.setRequestHeader(headerName, headerValue);
                    }
                    formData = new FormData();
                    if (this.options.params) {
                        _ref1 = this.options.params;
                        for (key in _ref1) {
                            value = _ref1[key];
                            formData.append(key, value);
                        }
                    }
                    for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
                        file = files[_j];
                        this.emit("sending", file, xhr, formData);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("sendingmultiple", files, xhr, formData);
                    }
                    if (this.element.tagName === "FORM") {
                        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
                        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                            input = _ref2[_k];
                            inputName = input.getAttribute("name");
                            inputType = input.getAttribute("type");
                            if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
                                _ref3 = input.options;
                                for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
                                    option = _ref3[_l];
                                    if (option.selected) {
                                        formData.append(inputName, option.value);
                                    }
                                }
                            } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
                                formData.append(inputName, input.value);
                            }
                        }
                    }
                    for (_m = 0, _len4 = files.length; _m < _len4; _m++) {
                        file = files[_m];
                        formData.append("" + this.options.paramName + (this.options.uploadMultiple ? "[]" : ""), file, file.name);
                    }
                    return xhr.send(formData);
                };

                Dropzone.prototype._finished = function(files, responseText, e) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.SUCCESS;
                        this.emit("success", file, responseText, e);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("successmultiple", files, responseText, e);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                Dropzone.prototype._errorProcessing = function(files, message, xhr) {
                    var file, _i, _len;
                    for (_i = 0, _len = files.length; _i < _len; _i++) {
                        file = files[_i];
                        file.status = Dropzone.ERROR;
                        this.emit("error", file, message, xhr);
                        this.emit("complete", file);
                    }
                    if (this.options.uploadMultiple) {
                        this.emit("errormultiple", files, message, xhr);
                        this.emit("completemultiple", files);
                    }
                    if (this.options.autoProcessQueue) {
                        return this.processQueue();
                    }
                };

                return Dropzone;

            })(Em);

            Dropzone.version = "3.8.7";

            Dropzone.options = {};

            Dropzone.optionsForElement = function(element) {
                if (element.getAttribute("id")) {
                    return Dropzone.options[camelize(element.getAttribute("id"))];
                } else {
                    return void 0;
                }
            };

            Dropzone.instances = [];

            Dropzone.forElement = function(element) {
                if (typeof element === "string") {
                    element = document.querySelector(element);
                }
                if ((element != null ? element.dropzone : void 0) == null) {
                    throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
                }
                return element.dropzone;
            };

            Dropzone.autoDiscover = true;

            Dropzone.discover = function() {
                var checkElements, dropzone, dropzones, _i, _len, _results;
                if (document.querySelectorAll) {
                    dropzones = document.querySelectorAll(".dropzone");
                } else {
                    dropzones = [];
                    checkElements = function(elements) {
                        var el, _i, _len, _results;
                        _results = [];
                        for (_i = 0, _len = elements.length; _i < _len; _i++) {
                            el = elements[_i];
                            if (/(^| )dropzone($| )/.test(el.className)) {
                                _results.push(dropzones.push(el));
                            } else {
                                _results.push(void 0);
                            }
                        }
                        return _results;
                    };
                    checkElements(document.getElementsByTagName("div"));
                    checkElements(document.getElementsByTagName("form"));
                }
                _results = [];
                for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
                    dropzone = dropzones[_i];
                    if (Dropzone.optionsForElement(dropzone) !== false) {
                        _results.push(new Dropzone(dropzone));
                    } else {
                        _results.push(void 0);
                    }
                }
                return _results;
            };

            Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

            Dropzone.isBrowserSupported = function() {
                var capableBrowser, regex, _i, _len, _ref;
                capableBrowser = true;
                if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
                    if (!("classList" in document.createElement("a"))) {
                        capableBrowser = false;
                    } else {
                        _ref = Dropzone.blacklistedBrowsers;
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            regex = _ref[_i];
                            if (regex.test(navigator.userAgent)) {
                                capableBrowser = false;
                                continue;
                            }
                        }
                    }
                } else {
                    capableBrowser = false;
                }
                return capableBrowser;
            };

            without = function(list, rejectedItem) {
                var item, _i, _len, _results;
                _results = [];
                for (_i = 0, _len = list.length; _i < _len; _i++) {
                    item = list[_i];
                    if (item !== rejectedItem) {
                        _results.push(item);
                    }
                }
                return _results;
            };

            camelize = function(str) {
                return str.replace(/[\-_](\w)/g, function(match) {
                    return match.charAt(1).toUpperCase();
                });
            };

            Dropzone.createElement = function(string) {
                var div;
                div = document.createElement("div");
                div.innerHTML = string;
                return div.childNodes[0];
            };

            Dropzone.elementInside = function(element, container) {
                if (element === container) {
                    return true;
                }
                while (element = element.parentNode) {
                    if (element === container) {
                        return true;
                    }
                }
                return false;
            };

            Dropzone.getElement = function(el, name) {
                var element;
                if (typeof el === "string") {
                    element = document.querySelector(el);
                } else if (el.nodeType != null) {
                    element = el;
                }
                if (element == null) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
                }
                return element;
            };

            Dropzone.getElements = function(els, name) {
                var e, el, elements, _i, _j, _len, _len1, _ref;
                if (els instanceof Array) {
                    elements = [];
                    try {
                        for (_i = 0, _len = els.length; _i < _len; _i++) {
                            el = els[_i];
                            elements.push(this.getElement(el, name));
                        }
                    } catch (_error) {
                        e = _error;
                        elements = null;
                    }
                } else if (typeof els === "string") {
                    elements = [];
                    _ref = document.querySelectorAll(els);
                    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                        el = _ref[_j];
                        elements.push(el);
                    }
                } else if (els.nodeType != null) {
                    elements = [els];
                }
                if (!((elements != null) && elements.length)) {
                    throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
                }
                return elements;
            };

            Dropzone.confirm = function(question, accepted, rejected) {
                if (window.confirm(question)) {
                    return accepted();
                } else if (rejected != null) {
                    return rejected();
                }
            };

            Dropzone.isValidFile = function(file, acceptedFiles) {
                var baseMimeType, mimeType, validType, _i, _len;
                if (!acceptedFiles) {
                    return true;
                }
                acceptedFiles = acceptedFiles.split(",");
                mimeType = file.type;
                baseMimeType = mimeType.replace(/\/.*$/, "");
                for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
                    validType = acceptedFiles[_i];
                    validType = validType.trim();
                    if (validType.charAt(0) === ".") {
                        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
                            return true;
                        }
                    } else if (/\/\*$/.test(validType)) {
                        if (baseMimeType === validType.replace(/\/.*$/, "")) {
                            return true;
                        }
                    } else {
                        if (mimeType === validType) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if (typeof jQuery !== "undefined" && jQuery !== null) {
                jQuery.fn.dropzone = function(options) {
                    return this.each(function() {
                        return new Dropzone(this, options);
                    });
                };
            }

            if (typeof module !== "undefined" && module !== null) {
                module.exports = Dropzone;
            } else {
                window.Dropzone = Dropzone;
            }

            Dropzone.ADDED = "added";

            Dropzone.QUEUED = "queued";

            Dropzone.ACCEPTED = Dropzone.QUEUED;

            Dropzone.UPLOADING = "uploading";

            Dropzone.PROCESSING = Dropzone.UPLOADING;

            Dropzone.CANCELED = "canceled";

            Dropzone.ERROR = "error";

            Dropzone.SUCCESS = "success";


            /*

             Bugfix for iOS 6 and 7
             Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
             based on the work of https://github.com/stomita/ios-imagefile-megapixel
             */

            detectVerticalSquash = function(img) {
                var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
                iw = img.naturalWidth;
                ih = img.naturalHeight;
                canvas = document.createElement("canvas");
                canvas.width = 1;
                canvas.height = ih;
                ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                data = ctx.getImageData(0, 0, 1, ih).data;
                sy = 0;
                ey = ih;
                py = ih;
                while (py > sy) {
                    alpha = data[(py - 1) * 4 + 3];
                    if (alpha === 0) {
                        ey = py;
                    } else {
                        sy = py;
                    }
                    py = (ey + sy) >> 1;
                }
                ratio = py / ih;
                if (ratio === 0) {
                    return 1;
                } else {
                    return ratio;
                }
            };

            drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
                var vertSquashRatio;
                vertSquashRatio = detectVerticalSquash(img);
                return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            };


            /*
             * contentloaded.js
             *
             * Author: Diego Perini (diego.perini at gmail.com)
             * Summary: cross-browser wrapper for DOMContentLoaded
             * Updated: 20101020
             * License: MIT
             * Version: 1.2
             *
             * URL:
             * http://javascript.nwbox.com/ContentLoaded/
             * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
             */

            contentLoaded = function(win, fn) {
                var add, doc, done, init, poll, pre, rem, root, top;
                done = false;
                top = true;
                doc = win.document;
                root = doc.documentElement;
                add = (doc.addEventListener ? "addEventListener" : "attachEvent");
                rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
                pre = (doc.addEventListener ? "" : "on");
                init = function(e) {
                    if (e.type === "readystatechange" && doc.readyState !== "complete") {
                        return;
                    }
                    (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
                    if (!done && (done = true)) {
                        return fn.call(win, e.type || e);
                    }
                };
                poll = function() {
                    var e;
                    try {
                        root.doScroll("left");
                    } catch (_error) {
                        e = _error;
                        setTimeout(poll, 50);
                        return;
                    }
                    return init("poll");
                };
                if (doc.readyState !== "complete") {
                    if (doc.createEventObject && root.doScroll) {
                        try {
                            top = !win.frameElement;
                        } catch (_error) {}
                        if (top) {
                            poll();
                        }
                    }
                    doc[add](pre + "DOMContentLoaded", init, false);
                    doc[add](pre + "readystatechange", init, false);
                    return win[add](pre + "load", init, false);
                }
            };

            Dropzone._autoDiscoverFunction = function() {
                if (Dropzone.autoDiscover) {
                    return Dropzone.discover();
                }
            };

            contentLoaded(window, Dropzone._autoDiscoverFunction);

        }).call(this);

    });

    if (typeof exports == "object") {
        module.exports = require("dropzone");
    } else if (typeof define == "function" && define.amd) {
        define([], function(){ return require("dropzone"); });
    } else {
        this["Dropzone"] = require("dropzone");
    }
})()
;
/*!
 * Cropper v0.7.6-beta
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright 2014 Fengyuan Chen
 * Released under the MIT license
 */


!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){"use strict";var b=a(window),c=a(document),d=window.location,e=!0,f=!1,g=null,h=0/0,i=1/0,j="undefined",k="directive",l=".cropper",m=/^(e|n|w|s|ne|nw|sw|se|all|crop|move|zoom)$/,n=/^(x|y|width|height)$/,o=/^(naturalWidth|naturalHeight|width|height|aspectRatio|ratio|rotate)$/,p="cropper-modal",q="cropper-hidden",r="cropper-invisible",s="cropper-move",t="cropper-crop",u="cropper-disabled",v="mousedown touchstart",w="mousemove touchmove",x="mouseup mouseleave touchend touchleave touchcancel",y="wheel mousewheel DOMMouseScroll",z="resize"+l,A="dblclick",B="build"+l,C="built"+l,D="dragstart"+l,E="dragmove"+l,F="dragend"+l,G=function(a){return"number"==typeof a},H=function(b,c){this.element=b,this.$element=a(b),this.defaults=a.extend({},H.DEFAULTS,a.isPlainObject(c)?c:{}),this.$original=g,this.ready=f,this.built=f,this.cropped=f,this.rotated=f,this.disabled=f,this.replaced=f,this.init()},I=Math.round,J=Math.sqrt,K=Math.min,L=Math.max,M=Math.abs,N=Math.sin,O=Math.cos,P=parseFloat;H.prototype={constructor:H,support:{canvas:a.isFunction(a("<canvas>")[0].getContext)},init:function(){var b=this.defaults;a.each(b,function(a,c){switch(a){case"aspectRatio":b[a]=M(P(c))||h;break;case"autoCropArea":b[a]=M(P(c))||.8;break;case"minWidth":case"minHeight":b[a]=M(P(c))||0;break;case"maxWidth":case"maxHeight":b[a]=M(P(c))||i}}),this.image={rotate:0},this.load()},load:function(){var b,c,d=this,f=this.$element,g=this.element,h=this.image,i="";f.is("img")?c=f.prop("src"):f.is("canvas")&&this.support.canvas&&(c=g.toDataURL()),c&&(this.replaced&&(h.rotate=0),this.defaults.checkImageOrigin&&(f.prop("crossOrigin")||this.isCrossOriginURL(c))&&(i=" crossOrigin"),this.$clone=b=a("<img"+i+' src="'+c+'">'),b.one("load",function(){h.naturalWidth=this.naturalWidth||b.width(),h.naturalHeight=this.naturalHeight||b.height(),h.aspectRatio=h.naturalWidth/h.naturalHeight,d.url=c,d.ready=e,d.build()}),b.addClass(r).prependTo("body"))},isCrossOriginURL:function(a){var b=a.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);return!b||b[1]===d.protocol&&b[2]===d.hostname&&b[3]===d.port?f:e},build:function(){var b,d,f=this.$element,g=this.defaults;this.ready&&(this.built&&this.unbuild(),f.one(B,g.build),b=a.Event(B),f.trigger(b),b.isDefaultPrevented()||(this.$cropper=d=a(H.TEMPLATE),f.addClass(q),this.$clone.removeClass(r).prependTo(d),this.rotated||(this.$original=this.$clone.clone(),this.$original.addClass(q).prependTo(this.$cropper),this.originalImage=a.extend({},this.image)),this.$container=f.parent(),this.$container.append(d),this.$canvas=d.find(".cropper-canvas"),this.$dragger=d.find(".cropper-dragger"),this.$viewer=d.find(".cropper-viewer"),g.autoCrop?this.cropped=e:this.$dragger.addClass(q),g.dragCrop&&this.setDragMode("crop"),g.modal&&this.$canvas.addClass(p),!g.dashed&&this.$dragger.find(".cropper-dashed").addClass(q),!g.movable&&this.$dragger.find(".cropper-face").data(k,"move"),!g.resizable&&this.$dragger.find(".cropper-line, .cropper-point").addClass(q),this.$scope=g.multiple?this.$cropper:c,this.addListeners(),this.initPreview(),this.built=e,this.update(),f.one(C,g.built),f.trigger(C)))},unbuild:function(){this.built&&(this.built=f,this.removeListeners(),this.$preview.empty(),this.$preview=g,this.$dragger=g,this.$canvas=g,this.$container=g,this.$cropper.remove(),this.$cropper=g)},update:function(a){this.initContainer(),this.initCropper(),this.initImage(),this.initDragger(),a?(this.setData(a,e),this.setDragMode("crop")):this.setData(this.defaults.data)},resize:function(){clearTimeout(this.resizing),this.resizing=setTimeout(a.proxy(this.update,this,this.getData()),200)},preview:function(){var b=this.image,c=this.dragger,d=b.width,e=b.height,f=c.left-b.left,g=c.top-b.top;this.$viewer.find("img").css({width:I(d),height:I(e),marginLeft:-I(f),marginTop:-I(g)}),this.$preview.each(function(){var b=a(this),h=b.width()/c.width;b.find("img").css({width:I(d*h),height:I(e*h),marginLeft:-I(f*h),marginTop:-I(g*h)})})},addListeners:function(){var c=this.defaults;this.$element.on(D,c.dragstart).on(E,c.dragmove).on(F,c.dragend),this.$cropper.on(v,this._dragstart=a.proxy(this.dragstart,this)).on(A,this._dblclick=a.proxy(this.dblclick,this)),c.zoomable&&this.$cropper.on(y,this._wheel=a.proxy(this.wheel,this)),this.$scope.on(w,this._dragmove=a.proxy(this.dragmove,this)).on(x,this._dragend=a.proxy(this.dragend,this)),b.on(z,this._resize=a.proxy(this.resize,this))},removeListeners:function(){var a=this.defaults;this.$element.off(D,a.dragstart).off(E,a.dragmove).off(F,a.dragend),this.$cropper.off(v,this._dragstart).off(A,this._dblclick),a.zoomable&&this.$cropper.off(y,this._wheel),this.$scope.off(w,this._dragmove).off(x,this._dragend),b.off(z,this._resize)},initPreview:function(){var b='<img src="'+this.url+'">';this.$preview=a(this.defaults.preview),this.$viewer.html(b),this.$preview.html(b).find("img").css("cssText","min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;")},initContainer:function(){var a=this.$container;this.container={width:L(a.width(),300),height:L(a.height(),150)}},initCropper:function(){var a,b=this.container,c=this.image;c.naturalWidth*b.height/c.naturalHeight-b.width>=0?(a={width:b.width,height:b.width/c.aspectRatio,left:0},a.top=(b.height-a.height)/2):(a={width:b.height*c.aspectRatio,height:b.height,top:0},a.left=(b.width-a.width)/2),this.$cropper.css({width:I(a.width),height:I(a.height),left:I(a.left),top:I(a.top)}),this.cropper=a},initImage:function(){var b=this.image,c=this.cropper,d={_width:c.width,_height:c.height,width:c.width,height:c.height,left:0,top:0,ratio:c.width/b.naturalWidth};this.defaultImage=a.extend({},b,d),b._width!==c.width||b._height!==c.height?a.extend(b,d):(b=a.extend({},d,b),this.replaced&&(this.replaced=f,b.ratio=d.ratio)),this.image=b,this.renderImage()},renderImage:function(a){var b=this.image;"zoom"===a&&(b.left-=(b.width-b.oldWidth)/2,b.top-=(b.height-b.oldHeight)/2),b.left=K(L(b.left,b._width-b.width),0),b.top=K(L(b.top,b._height-b.height),0),this.$clone.css({width:I(b.width),height:I(b.height),marginLeft:I(b.left),marginTop:I(b.top)}),a&&(this.defaults.done(this.getData()),this.preview())},initDragger:function(){var b,c=this.defaults,d=this.cropper,e=c.aspectRatio||this.image.aspectRatio,f=this.image.ratio;b=d.height*e-d.width>=0?{height:d.width/e,width:d.width,left:0,top:(d.height-d.width/e)/2,maxWidth:d.width,maxHeight:d.width/e}:{height:d.height,width:d.height*e,left:(d.width-d.height*e)/2,top:0,maxWidth:d.height*e,maxHeight:d.height},b.minWidth=0,b.minHeight=0,c.aspectRatio?(isFinite(c.maxWidth)?(b.maxWidth=K(b.maxWidth,c.maxWidth*f),b.maxHeight=b.maxWidth/e):isFinite(c.maxHeight)&&(b.maxHeight=K(b.maxHeight,c.maxHeight*f),b.maxWidth=b.maxHeight*e),c.minWidth>0?(b.minWidth=L(0,c.minWidth*f),b.minHeight=b.minWidth/e):c.minHeight>0&&(b.minHeight=L(0,c.minHeight*f),b.minWidth=b.minHeight*e)):(b.maxWidth=K(b.maxWidth,c.maxWidth*f),b.maxHeight=K(b.maxHeight,c.maxHeight*f),b.minWidth=L(0,c.minWidth*f),b.minHeight=L(0,c.minHeight*f)),b.minWidth=K(b.maxWidth,b.minWidth),b.minHeight=K(b.maxHeight,b.minHeight),b.height*=c.autoCropArea,b.width*=c.autoCropArea,b.left=(d.width-b.width)/2,b.top=(d.height-b.height)/2,b.oldLeft=b.left,b.oldTop=b.top,this.defaultDragger=b,this.dragger=a.extend({},b)},renderDragger:function(){var a=this.dragger,b=this.cropper;a.width>a.maxWidth?(a.width=a.maxWidth,a.left=a.oldLeft):a.width<a.minWidth&&(a.width=a.minWidth,a.left=a.oldLeft),a.height>a.maxHeight?(a.height=a.maxHeight,a.top=a.oldTop):a.height<a.minHeight&&(a.height=a.minHeight,a.top=a.oldTop),a.left=K(L(a.left,0),b.width-a.width),a.top=K(L(a.top,0),b.height-a.height),a.oldLeft=a.left,a.oldTop=a.top,this.dragger=a,this.disabled||this.defaults.done(this.getData()),this.$dragger.css({width:I(a.width),height:I(a.height),left:I(a.left),top:I(a.top)}),this.preview()},reset:function(b){this.cropped&&(b&&(this.defaults.data={}),this.image=a.extend({},this.defaultImage),this.renderImage(),this.dragger=a.extend({},this.defaultDragger),this.setData(this.defaults.data))},clear:function(){this.cropped&&(this.cropped=f,this.setData({x:0,y:0,width:0,height:0}),this.$canvas.removeClass(p),this.$dragger.addClass(q))},destroy:function(){var a=this.$element;this.ready&&(this.unbuild(),a.removeClass(q).removeData("cropper"),this.rotated&&a.attr("src",this.$original.attr("src")))},replace:function(b,c){var d,g=this,h=this.$element,i=this.element;b&&b!==this.url&&b!==h.attr("src")&&(c||(this.rotated=f,this.replaced=e),h.is("img")?(h.attr("src",b),this.load()):h.is("canvas")&&this.support.canvas&&(d=i.getContext("2d"),a('<img src="'+b+'">').one("load",function(){i.width=this.width,i.height=this.height,d.clearRect(0,0,i.width,i.height),d.drawImage(this,0,0),g.load()})))},setData:function(b,c){var d=this.cropper,e=this.dragger,f=this.image,h=this.defaults.aspectRatio;this.built&&typeof b!==j&&((b===g||a.isEmptyObject(b))&&(e=a.extend({},this.defaultDragger)),a.isPlainObject(b)&&!a.isEmptyObject(b)&&(c||(this.defaults.data=b),b=this.transformData(b),G(b.x)&&b.x<=d.width-f.left&&(e.left=b.x+f.left),G(b.y)&&b.y<=d.height-f.top&&(e.top=b.y+f.top),h?G(b.width)&&b.width<=e.maxWidth&&b.width>=e.minWidth?(e.width=b.width,e.height=e.width/h):G(b.height)&&b.height<=e.maxHeight&&b.height>=e.minHeight&&(e.height=b.height,e.width=e.height*h):(G(b.width)&&b.width<=e.maxWidth&&b.width>=e.minWidth&&(e.width=b.width),G(b.height)&&b.height<=e.maxHeight&&b.height>=e.minHeight&&(e.height=b.height))),this.dragger=e,this.renderDragger())},getData:function(a){var b=this.dragger,c=this.image,d={};return this.built&&(d={x:b.left-c.left,y:b.top-c.top,width:b.width,height:b.height},d=this.transformData(d,e,a)),d},transformData:function(b,c,d){var e=this.image.ratio,f={};return a.each(b,function(a,b){b=P(b),n.test(a)&&!isNaN(b)&&(f[a]=c?d?I(b/e):b/e:b*e)}),f},setAspectRatio:function(a){var b="auto"===a;a=P(a),(b||!isNaN(a)&&a>0)&&(this.defaults.aspectRatio=b?h:a,this.built&&(this.initDragger(),this.renderDragger()))},getImageData:function(){var b={};return this.ready&&a.each(this.image,function(a,c){o.test(a)&&(b[a]=c)}),b},getDataURL:function(b,c,d){var e,f=a("<canvas>")[0],g=this.getData(),h="";return a.isPlainObject(b)||(d=c,c=b,b={}),b=a.extend({width:g.width,height:g.height},b),this.cropped&&this.support.canvas&&(f.width=b.width,f.height=b.height,e=f.getContext("2d"),"image/jpeg"===c&&(e.fillStyle="#fff",e.fillRect(0,0,b.width,b.height)),e.drawImage(this.$clone[0],g.x,g.y,g.width,g.height,0,0,b.width,b.height),h=f.toDataURL(c,d)),h},setDragMode:function(a){var b=this.$canvas,c=this.defaults,d=f,g=f;if(this.built&&!this.disabled){switch(a){case"crop":c.dragCrop&&(d=e,b.data(k,a));break;case"move":g=e,b.data(k,a);break;default:b.removeData(k)}b.toggleClass(t,d).toggleClass(s,g)}},enable:function(){this.built&&(this.disabled=f,this.$cropper.removeClass(u))},disable:function(){this.built&&(this.disabled=e,this.$cropper.addClass(u))},rotate:function(a){var b=this.image;a=P(a)||0,this.built&&0!==a&&!this.disabled&&this.defaults.rotatable&&this.support.canvas&&(this.rotated=e,a=b.rotate=(b.rotate+a)%360,this.replace(this.getRotatedDataURL(a),!0))},getRotatedDataURL:function(b){var c=a("<canvas>")[0],d=c.getContext("2d"),e=b*Math.PI/180,f=M(b)%180,g=f>90?180-f:f,h=g*Math.PI/180,i=this.originalImage,j=i.naturalWidth,k=i.naturalHeight,l=M(j*O(h)+k*N(h)),m=M(j*N(h)+k*O(h));return c.width=l,c.height=m,d.save(),d.translate(l/2,m/2),d.rotate(e),d.drawImage(this.$original[0],-j/2,-k/2,j,k),d.restore(),c.toDataURL()},zoom:function(a){var b,c,d,e=this.image;a=P(a),this.built&&a&&!this.disabled&&this.defaults.zoomable&&(b=e.width*(1+a),c=e.height*(1+a),d=b/e._width,d>10||(1>d&&(b=e._width,c=e._height),this.setDragMode(1>=d?"crop":"move"),e.oldWidth=e.width,e.oldHeight=e.height,e.width=b,e.height=c,e.ratio=e.width/e.naturalWidth,this.renderImage("zoom")))},dblclick:function(){this.disabled||this.setDragMode(this.$canvas.hasClass(t)?"move":"crop")},wheel:function(a){var b,c=a.originalEvent,d=117.25,e=5,f=166.66665649414062,g=.1;this.disabled||(a.preventDefault(),c.deltaY?(b=c.deltaY,b=b%e===0?b/e:b%d===0?b/d:b/f):b=c.wheelDelta?-c.wheelDelta/120:c.detail?c.detail/3:0,this.zoom(b*g))},dragstart:function(b){var c,d,g,h=b.originalEvent.touches,i=b;if(!this.disabled){if(h){if(g=h.length,g>1){if(!this.defaults.zoomable||2!==g)return;i=h[1],this.startX2=i.pageX,this.startY2=i.pageY,c="zoom"}i=h[0]}if(c=c||a(i.target).data(k),m.test(c)){if(b.preventDefault(),d=a.Event(D),this.$element.trigger(d),d.isDefaultPrevented())return;this.directive=c,this.cropping=f,this.startX=i.pageX,this.startY=i.pageY,"crop"===c&&(this.cropping=e,this.$canvas.addClass(p))}}},dragmove:function(b){var c,d,e=b.originalEvent.touches,f=b;if(!this.disabled){if(e){if(d=e.length,d>1){if(!this.defaults.zoomable||2!==d)return;f=e[1],this.endX2=f.pageX,this.endY2=f.pageY}f=e[0]}if(this.directive){if(b.preventDefault(),c=a.Event(E),this.$element.trigger(c),c.isDefaultPrevented())return;this.endX=f.pageX,this.endY=f.pageY,this.dragging()}}},dragend:function(b){var c;if(!this.disabled&&this.directive){if(b.preventDefault(),c=a.Event(F),this.$element.trigger(c),c.isDefaultPrevented())return;this.cropping&&(this.cropping=f,this.$canvas.toggleClass(p,this.cropped&&this.defaults.modal)),this.directive=""}},dragging:function(){var a,b=this.directive,c=this.image,d=this.cropper,g=d.width,h=d.height,i=this.dragger,j=i.width,k=i.height,l=i.left,m=i.top,n=l+j,o=m+k,p=e,r=this.defaults,s=r.aspectRatio,t={x:this.endX-this.startX,y:this.endY-this.startY};switch(s&&(t.X=t.y*s,t.Y=t.x/s),b){case"all":l+=t.x,m+=t.y;break;case"e":if(t.x>=0&&(n>=g||s&&(0>=m||o>=h))){p=f;break}j+=t.x,s&&(k=j/s,m-=t.Y/2),0>j&&(b="w",j=0);break;case"n":if(t.y<=0&&(0>=m||s&&(0>=l||n>=g))){p=f;break}k-=t.y,m+=t.y,s&&(j=k*s,l+=t.X/2),0>k&&(b="s",k=0);break;case"w":if(t.x<=0&&(0>=l||s&&(0>=m||o>=h))){p=f;break}j-=t.x,l+=t.x,s&&(k=j/s,m+=t.Y/2),0>j&&(b="e",j=0);break;case"s":if(t.y>=0&&(o>=h||s&&(0>=l||n>=g))){p=f;break}k+=t.y,s&&(j=k*s,l-=t.X/2),0>k&&(b="n",k=0);break;case"ne":if(s){if(t.y<=0&&(0>=m||n>=g)){p=f;break}k-=t.y,m+=t.y,j=k*s}else t.x>=0?g>n?j+=t.x:t.y<=0&&0>=m&&(p=f):j+=t.x,t.y<=0?m>0&&(k-=t.y,m+=t.y):(k-=t.y,m+=t.y);0>k&&(b="sw",k=0,j=0);break;case"nw":if(s){if(t.y<=0&&(0>=m||0>=l)){p=f;break}k-=t.y,m+=t.y,j=k*s,l+=t.X}else t.x<=0?l>0?(j-=t.x,l+=t.x):t.y<=0&&0>=m&&(p=f):(j-=t.x,l+=t.x),t.y<=0?m>0&&(k-=t.y,m+=t.y):(k-=t.y,m+=t.y);0>k&&(b="se",k=0,j=0);break;case"sw":if(s){if(t.x<=0&&(0>=l||o>=h)){p=f;break}j-=t.x,l+=t.x,k=j/s}else t.x<=0?l>0?(j-=t.x,l+=t.x):t.y>=0&&o>=h&&(p=f):(j-=t.x,l+=t.x),t.y>=0?h>o&&(k+=t.y):k+=t.y;0>j&&(b="ne",k=0,j=0);break;case"se":if(s){if(t.x>=0&&(n>=g||o>=h)){p=f;break}j+=t.x,k=j/s}else t.x>=0?g>n?j+=t.x:t.y>=0&&o>=h&&(p=f):j+=t.x,t.y>=0?h>o&&(k+=t.y):k+=t.y;0>j&&(b="nw",k=0,j=0);break;case"move":c.left+=t.x,c.top+=t.y,this.renderImage("move"),p=f;break;case"zoom":r.zoomable&&(this.zoom(function(a,b,c,d,e,f){return(J(e*e+f*f)-J(c*c+d*d))/J(a*a+b*b)}(c.width,c.height,M(this.startX-this.startX2),M(this.startY-this.startY2),M(this.endX-this.endX2),M(this.endY-this.endY2))),this.endX2=this.startX2,this.endY2=this.startY2);break;case"crop":t.x&&t.y&&(a=this.$cropper.offset(),l=this.startX-a.left,m=this.startY-a.top,j=i.minWidth,k=i.minHeight,t.x>0?t.y>0?b="se":(b="ne",m-=k):t.y>0?(b="sw",l-=j):(b="nw",l-=j,m-=k),this.cropped||(this.cropped=e,this.$dragger.removeClass(q)))}p&&(i.width=j,i.height=k,i.left=l,i.top=m,this.directive=b,this.renderDragger()),this.startX=this.endX,this.startY=this.endY}},H.TEMPLATE=function(a,b){return b=b.split(","),a.replace(/\d+/g,function(a){return b[a]})}('<0 6="5-container"><0 6="5-canvas"></0><0 6="5-dragger"><1 6="5-viewer"></1><1 6="5-8 8-h"></1><1 6="5-8 8-v"></1><1 6="5-face" 3-2="all"></1><1 6="5-7 7-e" 3-2="e"></1><1 6="5-7 7-n" 3-2="n"></1><1 6="5-7 7-w" 3-2="w"></1><1 6="5-7 7-s" 3-2="s"></1><1 6="5-4 4-e" 3-2="e"></1><1 6="5-4 4-n" 3-2="n"></1><1 6="5-4 4-w" 3-2="w"></1><1 6="5-4 4-s" 3-2="s"></1><1 6="5-4 4-ne" 3-2="ne"></1><1 6="5-4 4-nw" 3-2="nw"></1><1 6="5-4 4-sw" 3-2="sw"></1><1 6="5-4 4-se" 3-2="se"></1></0></0>',"div,span,directive,data,point,cropper,class,line,dashed"),H.DEFAULTS={aspectRatio:"auto",autoCropArea:.8,data:{},done:a.noop,preview:"",multiple:f,autoCrop:e,dragCrop:e,dashed:e,modal:e,movable:e,resizable:e,zoomable:e,rotatable:e,checkImageOrigin:e,minWidth:0,minHeight:0,maxWidth:i,maxHeight:i,build:g,built:g,dragstart:g,dragmove:g,dragend:g},H.setDefaults=function(b){a.extend(H.DEFAULTS,b)},H.other=a.fn.cropper,a.fn.cropper=function(b){var c,d=[].slice.call(arguments,1);return this.each(function(){var e,f=a(this),g=f.data("cropper");g||f.data("cropper",g=new H(this,b)),"string"==typeof b&&a.isFunction(e=g[b])&&(c=e.apply(g,d))}),typeof c!==j?c:this},a.fn.cropper.Constructor=H,a.fn.cropper.setDefaults=H.setDefaults,a.fn.cropper.noConflict=function(){return a.fn.cropper=H.other,this}});
/* =========================================================
 * bootstrap-datepicker.js
 * Repo: https://github.com/eternicode/bootstrap-datepicker/
 * Demo: http://eternicode.github.io/bootstrap-datepicker/
 * Docs: http://bootstrap-datepicker.readthedocs.org/
 * Forked from http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Started by Stefan Petre; improvements by Andrew Rowls + contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


(function($, undefined){

	var $window = $(window);

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function alias(method){
		return function(){
			return this[method].apply(this, arguments);
		};
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
					if (this[i].valueOf() === val)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.splice(0);
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		this.dates = new DateArray();
		this.viewDate = UTCToday();
		this.focusDate = null;

		this._process_options(options);

		this.element = $(element);
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on, .input-group-addon, .btn') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if (this.component && this.component.length === 0)
			this.component = false;

		this.picker = $(DPGlobal.template);
		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		this.viewMode = this.o.startView;

		if (this.o.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this._allow_update = false;

		this.setStartDate(this._o.startDate);
		this.setEndDate(this._o.endDate);
		this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);

		this.fillDow();
		this.fillMonths();

		this._allow_update = true;

		this.update();
		this.showMode();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			switch (o.startView){
				case 2:
				case 'decade':
					o.startView = 2;
					break;
				case 1:
				case 'year':
					o.startView = 1;
					break;
				default:
					o.startView = 0;
			}

			switch (o.minViewMode){
				case 1:
				case 'months':
					o.minViewMode = 1;
					break;
				case 2:
				case 'years':
					o.minViewMode = 2;
					break;
				default:
					o.minViewMode = 0;
			}

			o.startView = Math.max(o.startView, o.minViewMode);

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
				else
					o.multidate = 1;
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = ((o.weekStart + 6) % 7);

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = o.daysOfWeekDisabled||[];
			if (!$.isArray(o.daysOfWeekDisabled))
				o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/);
			o.daysOfWeekDisabled = $.map(o.daysOfWeekDisabled, function(d){
				return parseInt(d, 10);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return (/^auto|left|right|top|bottom$/).test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return (/^left|right$/).test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return (/^top|bottom$/).test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
		},
		_events: [],
		_secondaryEvents: [],
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				}
				else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
			if (this.isInput){ // single input
				this._events = [
					[this.element, {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(function(e){
							if ($.inArray(e.keyCode, [27,37,39,38,40,32,13,9]) === -1)
								this.update();
						}, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.element.is('div')){  // inline datepicker
				this.isInline = true;
			}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					}
					else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (!this.isInline)
				this.picker.appendTo('body');
			this.picker.show();
			this.place();
			this._attachSecondaryEvents();
			this._trigger('show');
		},

		hide: function(){
			if (this.isInline)
				return;
			if (!this.picker.is(':visible'))
				return;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.viewMode = this.o.startView;
			this.showMode();

			if (
				this.o.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this._trigger('hide');
		},

		remove: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
		},

		_utc_to_local: function(utc){
			return utc && new Date(utc.getTime() + (utc.getTimezoneOffset()*60000));
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			return new Date(this.dates.get(-1));
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, $.map(args, this._utc_to_local));
			this._trigger('changeDate');
			this.setValue();
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			if (!this.isInput){
				if (this.component){
					this.element.find('input').val(formatted).change();
				}
			}
			else {
				this.element.val(formatted).change();
			}
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
			if (this.isInline)
				return;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				windowWidth = $window.width(),
				windowHeight = $window.height(),
				scrollTop = $window.scrollTop();

			var zIndex = parseInt(this.element.parents().filter(function(){
					return $(this).css('z-index') !== 'auto';
				}).first().css('z-index'))+10;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left,
				top = offset.top;

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				// Default to left
				this.picker.addClass('datepicker-orient-left');
				if (offset.left < 0)
					left -= offset.left - visualPadding;
				else if (offset.left + calendarWidth > windowWidth)
					left = windowWidth - calendarWidth - visualPadding;
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow, bottom_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + offset.top - calendarHeight;
				bottom_overflow = scrollTop + windowHeight - (offset.top + height + calendarHeight);
				if (Math.max(top_overflow, bottom_overflow) === bottom_overflow)
					yorient = 'top';
				else
					yorient = 'bottom';
			}
			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top += height;
			else
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));

			this.picker.css({
				top: top,
				left: left,
				zIndex: zIndex
			});
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			}
			else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.element.find('input').val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					date < this.o.startDate ||
					date > this.o.endDate ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.dates.length)
				this.viewDate = new Date(this.dates.get(-1));
			else if (this.viewDate < this.o.startDate)
				this.viewDate = new Date(this.o.startDate);
			else if (this.viewDate > this.o.endDate)
				this.viewDate = new Date(this.o.endDate);

			if (fromArgs){
				// setting date by clicking
				this.setValue();
			}
			else if (dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates))
					this._trigger('changeDate');
			}
			if (!this.dates.length && oldDates.length)
				this._trigger('clearDate');

			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12){
				html += '<span class="month">'+dates[this.o.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = new Date();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			}
			else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with local today, not UTC today
			if (this.o.todayHighlight &&
				date.getUTCFullYear() === today.getFullYear() &&
				date.getUTCMonth() === today.getMonth() &&
				date.getUTCDate() === today.getDate()){
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (date.valueOf() < this.o.startDate || date.valueOf() > this.o.endDate ||
				$.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1){
				cls.push('disabled');
			}
			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
			}
			return cls;
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
				tooltip;
			this.picker.find('.datepicker-days thead th.datepicker-switch')
						.text(dates[this.o.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(todaytxt)
						.toggle(this.o.todayBtn !== false);
			this.picker.find('tfoot th.clear')
						.text(cleartxt)
						.toggle(this.o.clearBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while (prevMonth.valueOf() < nextMonth){
				if (prevMonth.getUTCDay() === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				if (this.o.beforeShowDay !== $.noop){
					var before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof(before) === 'boolean')
						before = {enabled: before};
					else if (typeof(before) === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
				}

				clsName = $.unique(clsName);
				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + '>'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			var years = $.map(this.dates, function(d){
					return d.getUTCFullYear();
				}),
				classes;
			for (var i = -1; i < 11; i++){
				classes = ['year'];
				if (i === -1)
					classes.push('old');
				else if (i === 10)
					classes.push('new');
				if ($.inArray(year, years) !== -1)
					classes.push('active');
				if (year < startYear || year > endYear)
					classes.push('disabled');
				html += '<span class="' + classes.join(' ') + '">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode){
				case 0:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear() && month <= this.o.startDate.getUTCMonth()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear() && month >= this.o.endDate.getUTCMonth()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.o.startDate !== -Infinity && year <= this.o.startDate.getUTCFullYear()){
						this.picker.find('.prev').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.o.endDate !== Infinity && year >= this.o.endDate.getUTCFullYear()){
						this.picker.find('.next').css({visibility: 'hidden'});
					}
					else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e){
			e.preventDefault();
			var target = $(e.target).closest('span, td, th'),
				year, month, day;
			if (target.length === 1){
				switch (target[0].nodeName.toLowerCase()){
					case 'th':
						switch (target[0].className){
							case 'datepicker-switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
								switch (this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										this._trigger('changeMonth', this.viewDate);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										if (this.viewMode === 1)
											this._trigger('changeYear', this.viewDate);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.o.todayBtn === 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
							case 'clear':
								var element;
								if (this.isInput)
									element = this.element;
								else if (this.component)
									element = this.element.find('input');
								if (element)
									element.val("").change();
								this.update();
								this._trigger('changeDate');
								if (this.o.autoclose)
									this.hide();
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')){
							this.viewDate.setUTCDate(1);
							if (target.is('.month')){
								day = 1;
								month = target.parent().find('span').index(target);
								year = this.viewDate.getUTCFullYear();
								this.viewDate.setUTCMonth(month);
								this._trigger('changeMonth', this.viewDate);
								if (this.o.minViewMode === 1){
									this._setDate(UTCDate(year, month, day));
								}
							}
							else {
								day = 1;
								month = 0;
								year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this._trigger('changeYear', this.viewDate);
								if (this.o.minViewMode === 2){
									this._setDate(UTCDate(year, month, day));
								}
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							day = parseInt(target.text(), 10)||1;
							year = this.viewDate.getUTCFullYear();
							month = this.viewDate.getUTCMonth();
							if (target.is('.old')){
								if (month === 0){
									month = 11;
									year -= 1;
								}
								else {
									month -= 1;
								}
							}
							else if (target.is('.new')){
								if (month === 11){
									month = 0;
									year += 1;
								}
								else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day));
						}
						break;
				}
			}
			if (this.picker.is(':visible') && this._focused_from){
				$(this._focused_from).focus();
			}
			delete this._focused_from;
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}
			else if (ix !== -1){
				this.dates.remove(ix);
			}
			else {
				this.dates.push(date);
			}
			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if (!which || which  === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			this._trigger('changeDate');
			var element;
			if (this.isInput){
				element = this.element;
			}
			else if (this.component){
				element = this.element.find('input');
			}
			if (element){
				element.change();
			}
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveMonth: function(date, dir){
			if (!date)
				return undefined;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode === 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, newDate, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.o.keyboardNavigation)
						break;
					dir = e.keyCode === 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveYear(focusDate, dir);
						this._trigger('changeYear', this.viewDate);
					}
					else if (e.shiftKey){
						newDate = this.moveMonth(this.dates.get(-1) || UTCToday(), dir);
						newViewDate = this.moveMonth(focusDate, dir);
						this._trigger('changeMonth', this.viewDate);
					}
					else {
						newDate = new Date(this.dates.get(-1) || UTCToday());
						newDate.setUTCDate(newDate.getUTCDate() + dir * 7);
						newViewDate = new Date(focusDate);
						newViewDate.setUTCDate(focusDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 32: // spacebar
					// Spacebar is used in manually typing dates in some formats.
					// As such, its behavior should not be hijacked.
					break;
				case 13: // enter
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					this._toggle_multidate(focusDate);
					dateChanged = true;
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				var element;
				if (this.isInput){
					element = this.element;
				}
				else if (this.component){
					element = this.element.find('input');
				}
				if (element){
					element.change();
				}
			}
		},

		showMode: function(dir){
			if (dir){
				this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + dir));
			}
			this.picker
				.find('>div')
				.hide()
				.filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName)
					.css('display', 'block');
			this.updateNavArrows();
		}
	};

	var DateRangePicker = function(element, options){
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		$(this.inputs)
			.datepicker(options)
			.bind('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $(i).data('datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $(e.target).data('datepicker'),
				new_date = dp.getUTCDate(),
				i = $.inArray(e.target, this.inputs),
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate())
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[i]){
				// Date being moved earlier/left
				while (i >= 0 && new_date < this.dates[i]){
					this.pickers[i--].setUTCDate(new_date);
				}
			}
			else if (new_date > this.dates[i]){
				// Date being moved later/right
				while (i < l && new_date > this.dates[i]){
					this.pickers[i++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		remove: function(){
			$.map(this.pickers, function(p){ p.remove(); });
			delete this.element.data().datepicker;
		}
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	$.fn.datepicker = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.is('.input-daterange') || opts.inputs){
					var ropts = {
						inputs: opts.inputs || $this.find('input').toArray()
					};
					$this.data('datepicker', (data = new DateRangePicker(this, $.extend(opts, ropts))));
				}
				else {
					$this.data('datepicker', (data = new Datepicker(this, opts)));
				}
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
				if (internal_return !== undefined)
					return false;
			}
		});
		if (internal_return !== undefined)
			return internal_return;
		else
			return this;
	};

	var defaults = $.fn.datepicker.defaults = {
		autoclose: false,
		beforeShowDay: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		daysOfWeekDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		weekStart: 0
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function(year){
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function(year, month){
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var part_re = /([\-+]\d+)([dmwy])/,
				parts = date.match(/([\-+]\d+)([dmwy])/g),
				part, dir, i;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)){
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch (part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			parts = date && date.match(this.nonpunctuation) || [];
			date = new Date();
			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(v);
					},
					yy: function(d,v){
						return d.setUTCFullYear(2000+v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m === p;
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev">&laquo;</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">&raquo;</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			$this.datepicker('show');
		}
	);
	$(function(){
		$('[data-provide="datepicker-inline"]').datepicker();
	});

}(window.jQuery));
/*!
 Chosen, a Select Box Enhancer for jQuery and Prototype
 by Patrick Filler for Harvest, http://getharvest.com

 Version 1.1.0
 Full source at https://github.com/harvesthq/chosen
 Copyright (c) 2011 Harvest http://getharvest.com

 MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
 This file is generated by `grunt build`, do not edit it by hand.
 */


(function() {
    var $, AbstractChosen, Chosen, SelectParser, _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    SelectParser = (function() {
        function SelectParser() {
            this.options_index = 0;
            this.parsed = [];
        }

        SelectParser.prototype.add_node = function(child) {
            if (child.nodeName.toUpperCase() === "OPTGROUP") {
                return this.add_group(child);
            } else {
                return this.add_option(child);
            }
        };

        SelectParser.prototype.add_group = function(group) {
            var group_position, option, _i, _len, _ref, _results;
            group_position = this.parsed.length;
            this.parsed.push({
                array_index: group_position,
                group: true,
                label: this.escapeExpression(group.label),
                children: 0,
                disabled: group.disabled
            });
            _ref = group.childNodes;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                _results.push(this.add_option(option, group_position, group.disabled));
            }
            return _results;
        };

        SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
            if (option.nodeName.toUpperCase() === "OPTION") {
                if (option.text !== "") {
                    if (group_position != null) {
                        this.parsed[group_position].children += 1;
                    }
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        value: option.value,
                        text: option.text,
                        html: option.innerHTML,
                        selected: option.selected,
                        disabled: group_disabled === true ? group_disabled : option.disabled,
                        group_array_index: group_position,
                        classes: option.className,
                        style: option.style.cssText
                    });
                } else {
                    this.parsed.push({
                        array_index: this.parsed.length,
                        options_index: this.options_index,
                        empty: true
                    });
                }
                return this.options_index += 1;
            }
        };

        SelectParser.prototype.escapeExpression = function(text) {
            var map, unsafe_chars;
            if ((text == null) || text === false) {
                return "";
            }
            if (!/[\&\<\>\"\'\`]/.test(text)) {
                return text;
            }
            map = {
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;"
            };
            unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
            return text.replace(unsafe_chars, function(chr) {
                return map[chr] || "&amp;";
            });
        };

        return SelectParser;

    })();

    SelectParser.select_to_array = function(select) {
        var child, parser, _i, _len, _ref;
        parser = new SelectParser();
        _ref = select.childNodes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            parser.add_node(child);
        }
        return parser.parsed;
    };

    AbstractChosen = (function() {
        function AbstractChosen(form_field, options) {
            this.form_field = form_field;
            this.options = options != null ? options : {};
            if (!AbstractChosen.browser_is_supported()) {
                return;
            }
            this.is_multiple = this.form_field.multiple;
            this.set_default_text();
            this.set_default_values();
            this.setup();
            this.set_up_html();
            this.register_observers();
        }

        AbstractChosen.prototype.set_default_values = function() {
            var _this = this;
            this.click_test_action = function(evt) {
                return _this.test_active_click(evt);
            };
            this.activate_action = function(evt) {
                return _this.activate_field(evt);
            };
            this.active_field = false;
            this.mouse_on_container = false;
            this.results_showing = false;
            this.result_highlighted = null;
            this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
            this.disable_search_threshold = this.options.disable_search_threshold || 0;
            this.disable_search = this.options.disable_search || false;
            this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
            this.group_search = this.options.group_search != null ? this.options.group_search : true;
            this.search_contains = this.options.search_contains || false;
            this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
            this.max_selected_options = this.options.max_selected_options || Infinity;
            this.inherit_select_classes = this.options.inherit_select_classes || false;
            this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
            return this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
        };

        AbstractChosen.prototype.set_default_text = function() {
            if (this.form_field.getAttribute("data-placeholder")) {
                this.default_text = this.form_field.getAttribute("data-placeholder");
            } else if (this.is_multiple) {
                this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
            } else {
                this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
            }
            return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
        };

        AbstractChosen.prototype.mouse_enter = function() {
            return this.mouse_on_container = true;
        };

        AbstractChosen.prototype.mouse_leave = function() {
            return this.mouse_on_container = false;
        };

        AbstractChosen.prototype.input_focus = function(evt) {
            var _this = this;
            if (this.is_multiple) {
                if (!this.active_field) {
                    return setTimeout((function() {
                        return _this.container_mousedown();
                    }), 50);
                }
            } else {
                if (!this.active_field) {
                    return this.activate_field();
                }
            }
        };

        AbstractChosen.prototype.input_blur = function(evt) {
            var _this = this;
            if (!this.mouse_on_container) {
                this.active_field = false;
                return setTimeout((function() {
                    return _this.blur_test();
                }), 100);
            }
        };

        AbstractChosen.prototype.results_option_build = function(options) {
            var content, data, _i, _len, _ref;
            content = '';
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                data = _ref[_i];
                if (data.group) {
                    content += this.result_add_group(data);
                } else {
                    content += this.result_add_option(data);
                }
                if (options != null ? options.first : void 0) {
                    if (data.selected && this.is_multiple) {
                        this.choice_build(data);
                    } else if (data.selected && !this.is_multiple) {
                        this.single_set_selected_text(data.text);
                    }
                }
            }
            return content;
        };

        AbstractChosen.prototype.result_add_option = function(option) {
            var classes, option_el;
            if (!option.search_match) {
                return '';
            }
            if (!this.include_option_in_results(option)) {
                return '';
            }
            classes = [];
            if (!option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("active-result");
            }
            if (option.disabled && !(option.selected && this.is_multiple)) {
                classes.push("disabled-result");
            }
            if (option.selected) {
                classes.push("result-selected");
            }
            if (option.group_array_index != null) {
                classes.push("group-option");
            }
            if (option.classes !== "") {
                classes.push(option.classes);
            }
            option_el = document.createElement("li");
            option_el.className = classes.join(" ");
            option_el.style.cssText = option.style;
            option_el.setAttribute("data-option-array-index", option.array_index);
            option_el.innerHTML = option.search_text;
            return this.outerHTML(option_el);
        };

        AbstractChosen.prototype.result_add_group = function(group) {
            var group_el;
            if (!(group.search_match || group.group_match)) {
                return '';
            }
            if (!(group.active_options > 0)) {
                return '';
            }
            group_el = document.createElement("li");
            group_el.className = "group-result";
            group_el.innerHTML = group.search_text;
            return this.outerHTML(group_el);
        };

        AbstractChosen.prototype.results_update_field = function() {
            this.set_default_text();
            if (!this.is_multiple) {
                this.results_reset_cleanup();
            }
            this.result_clear_highlight();
            this.results_build();
            if (this.results_showing) {
                return this.winnow_results();
            }
        };

        AbstractChosen.prototype.reset_single_select_options = function() {
            var result, _i, _len, _ref, _results;
            _ref = this.results_data;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                result = _ref[_i];
                if (result.selected) {
                    _results.push(result.selected = false);
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        };

        AbstractChosen.prototype.results_toggle = function() {
            if (this.results_showing) {
                return this.results_hide();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.results_search = function(evt) {
            if (this.results_showing) {
                return this.winnow_results();
            } else {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.winnow_results = function() {
            var escapedSearchText, option, regex, regexAnchor, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
            this.no_results_clear();
            results = 0;
            searchText = this.get_search_text();
            escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            regexAnchor = this.search_contains ? "" : "^";
            regex = new RegExp(regexAnchor + escapedSearchText, 'i');
            zregex = new RegExp(escapedSearchText, 'i');
            _ref = this.results_data;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                option.search_match = false;
                results_group = null;
                if (this.include_option_in_results(option)) {
                    if (option.group) {
                        option.group_match = false;
                        option.active_options = 0;
                    }
                    if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
                        results_group = this.results_data[option.group_array_index];
                        if (results_group.active_options === 0 && results_group.search_match) {
                            results += 1;
                        }
                        results_group.active_options += 1;
                    }
                    if (!(option.group && !this.group_search)) {
                        option.search_text = option.group ? option.label : option.html;
                        option.search_match = this.search_string_match(option.search_text, regex);
                        if (option.search_match && !option.group) {
                            results += 1;
                        }
                        if (option.search_match) {
                            if (searchText.length) {
                                startpos = option.search_text.search(zregex);
                                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
                            }
                            if (results_group != null) {
                                results_group.group_match = true;
                            }
                        } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
                            option.search_match = true;
                        }
                    }
                }
            }
            this.result_clear_highlight();
            if (results < 1 && searchText.length) {
                this.update_results_content("");
                return this.no_results(searchText);
            } else {
                this.update_results_content(this.results_option_build());
                return this.winnow_results_set_highlight();
            }
        };

        AbstractChosen.prototype.search_string_match = function(search_string, regex) {
            var part, parts, _i, _len;
            if (regex.test(search_string)) {
                return true;
            } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
                parts = search_string.replace(/\[|\]/g, "").split(" ");
                if (parts.length) {
                    for (_i = 0, _len = parts.length; _i < _len; _i++) {
                        part = parts[_i];
                        if (regex.test(part)) {
                            return true;
                        }
                    }
                }
            }
        };

        AbstractChosen.prototype.choices_count = function() {
            var option, _i, _len, _ref;
            if (this.selected_option_count != null) {
                return this.selected_option_count;
            }
            this.selected_option_count = 0;
            _ref = this.form_field.options;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                option = _ref[_i];
                if (option.selected) {
                    this.selected_option_count += 1;
                }
            }
            return this.selected_option_count;
        };

        AbstractChosen.prototype.choices_click = function(evt) {
            evt.preventDefault();
            if (!(this.results_showing || this.is_disabled)) {
                return this.results_show();
            }
        };

        AbstractChosen.prototype.keyup_checker = function(evt) {
            var stroke, _ref;
            stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
            this.search_field_scale();
            switch (stroke) {
                case 8:
                    if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
                        return this.keydown_backstroke();
                    } else if (!this.pending_backstroke) {
                        this.result_clear_highlight();
                        return this.results_search();
                    }
                    break;
                case 13:
                    evt.preventDefault();
                    if (this.results_showing) {
                        return this.result_select(evt);
                    }
                    break;
                case 27:
                    if (this.results_showing) {
                        this.results_hide();
                    }
                    return true;
                case 9:
                case 38:
                case 40:
                case 16:
                case 91:
                case 17:
                    break;
                default:
                    return this.results_search();
            }
        };

        AbstractChosen.prototype.clipboard_event_checker = function(evt) {
            var _this = this;
            return setTimeout((function() {
                return _this.results_search();
            }), 50);
        };

        AbstractChosen.prototype.container_width = function() {
            if (this.options.width != null) {
                return this.options.width;
            } else {
                return "" + this.form_field.offsetWidth + "px";
            }
        };

        AbstractChosen.prototype.include_option_in_results = function(option) {
            if (this.is_multiple && (!this.display_selected_options && option.selected)) {
                return false;
            }
            if (!this.display_disabled_options && option.disabled) {
                return false;
            }
            if (option.empty) {
                return false;
            }
            return true;
        };

        AbstractChosen.prototype.search_results_touchstart = function(evt) {
            this.touch_started = true;
            return this.search_results_mouseover(evt);
        };

        AbstractChosen.prototype.search_results_touchmove = function(evt) {
            this.touch_started = false;
            return this.search_results_mouseout(evt);
        };

        AbstractChosen.prototype.search_results_touchend = function(evt) {
            if (this.touch_started) {
                return this.search_results_mouseup(evt);
            }
        };

        AbstractChosen.prototype.outerHTML = function(element) {
            var tmp;
            if (element.outerHTML) {
                return element.outerHTML;
            }
            tmp = document.createElement("div");
            tmp.appendChild(element);
            return tmp.innerHTML;
        };

        AbstractChosen.browser_is_supported = function() {
            if (window.navigator.appName === "Microsoft Internet Explorer") {
                return document.documentMode >= 8;
            }
            if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
                return false;
            }
            if (/Android/i.test(window.navigator.userAgent)) {
                if (/Mobile/i.test(window.navigator.userAgent)) {
                    return false;
                }
            }
            return true;
        };

        AbstractChosen.default_multiple_text = "Select Some Options";

        AbstractChosen.default_single_text = "Select an Option";

        AbstractChosen.default_no_result_text = "No results match";

        return AbstractChosen;

    })();

    $ = jQuery;

    $.fn.extend({
        chosen: function(options) {
            if (!AbstractChosen.browser_is_supported()) {
                return this;
            }
            return this.each(function(input_field) {
                var $this, chosen;
                $this = $(this);
                chosen = $this.data('chosen');
                if (options === 'destroy' && chosen) {
                    chosen.destroy();
                } else if (!chosen) {
                    $this.data('chosen', new Chosen(this, options));
                }
            });
        }
    });

    Chosen = (function(_super) {
        __extends(Chosen, _super);

        function Chosen() {
            _ref = Chosen.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        Chosen.prototype.setup = function() {
            this.form_field_jq = $(this.form_field);
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
        };

        Chosen.prototype.set_up_html = function() {
            var container_classes, container_props;
            container_classes = ["chosen-container"];
            container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
            if (this.inherit_select_classes && this.form_field.className) {
                container_classes.push(this.form_field.className);
            }
            if (this.is_rtl) {
                container_classes.push("chosen-rtl");
            }
            container_props = {
                'class': container_classes.join(' '),
                'style': "width: " + (this.container_width()) + ";",
                'title': this.form_field.title
            };
            if (this.form_field.id.length) {
                container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
            }
            this.container = $("<div />", container_props);
            if (this.is_multiple) {
                this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
            } else {
                this.container.html('<a class="chosen-single chosen-default" tabindex="-1"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
            }
            this.form_field_jq.hide().after(this.container);
            this.dropdown = this.container.find('div.chosen-drop').first();
            this.search_field = this.container.find('input').first();
            this.search_results = this.container.find('ul.chosen-results').first();
            this.search_field_scale();
            this.search_no_results = this.container.find('li.no-results').first();
            if (this.is_multiple) {
                this.search_choices = this.container.find('ul.chosen-choices').first();
                this.search_container = this.container.find('li.search-field').first();
            } else {
                this.search_container = this.container.find('div.chosen-search').first();
                this.selected_item = this.container.find('.chosen-single').first();
            }
            this.results_build();
            this.set_tab_index();
            this.set_label_behavior();
            return this.form_field_jq.trigger("chosen:ready", {
                chosen: this
            });
        };

        Chosen.prototype.register_observers = function() {
            var _this = this;
            this.container.bind('mousedown.chosen', function(evt) {
                _this.container_mousedown(evt);
            });
            this.container.bind('mouseup.chosen', function(evt) {
                _this.container_mouseup(evt);
            });
            this.container.bind('mouseenter.chosen', function(evt) {
                _this.mouse_enter(evt);
            });
            this.container.bind('mouseleave.chosen', function(evt) {
                _this.mouse_leave(evt);
            });
            this.search_results.bind('mouseup.chosen', function(evt) {
                _this.search_results_mouseup(evt);
            });
            this.search_results.bind('mouseover.chosen', function(evt) {
                _this.search_results_mouseover(evt);
            });
            this.search_results.bind('mouseout.chosen', function(evt) {
                _this.search_results_mouseout(evt);
            });
            this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
                _this.search_results_mousewheel(evt);
            });
            this.search_results.bind('touchstart.chosen', function(evt) {
                _this.search_results_touchstart(evt);
            });
            this.search_results.bind('touchmove.chosen', function(evt) {
                _this.search_results_touchmove(evt);
            });
            this.search_results.bind('touchend.chosen', function(evt) {
                _this.search_results_touchend(evt);
            });
            this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
                _this.results_update_field(evt);
            });
            this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
                _this.activate_field(evt);
            });
            this.form_field_jq.bind("chosen:open.chosen", function(evt) {
                _this.container_mousedown(evt);
            });
            this.form_field_jq.bind("chosen:close.chosen", function(evt) {
                _this.input_blur(evt);
            });
            this.search_field.bind('blur.chosen', function(evt) {
                _this.input_blur(evt);
            });
            this.search_field.bind('keyup.chosen', function(evt) {
                _this.keyup_checker(evt);
            });
            this.search_field.bind('keydown.chosen', function(evt) {
                _this.keydown_checker(evt);
            });
            this.search_field.bind('focus.chosen', function(evt) {
                _this.input_focus(evt);
            });
            this.search_field.bind('cut.chosen', function(evt) {
                _this.clipboard_event_checker(evt);
            });
            this.search_field.bind('paste.chosen', function(evt) {
                _this.clipboard_event_checker(evt);
            });
            if (this.is_multiple) {
                return this.search_choices.bind('click.chosen', function(evt) {
                    _this.choices_click(evt);
                });
            } else {
                return this.container.bind('click.chosen', function(evt) {
                    evt.preventDefault();
                });
            }
        };

        Chosen.prototype.destroy = function() {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            if (this.search_field[0].tabIndex) {
                this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
            }
            this.container.remove();
            this.form_field_jq.removeData('chosen');
            return this.form_field_jq.show();
        };

        Chosen.prototype.search_field_disabled = function() {
            this.is_disabled = this.form_field_jq[0].disabled;
            if (this.is_disabled) {
                this.container.addClass('chosen-disabled');
                this.search_field[0].disabled = true;
                if (!this.is_multiple) {
                    this.selected_item.unbind("focus.chosen", this.activate_action);
                }
                return this.close_field();
            } else {
                this.container.removeClass('chosen-disabled');
                this.search_field[0].disabled = false;
                if (!this.is_multiple) {
                    return this.selected_item.bind("focus.chosen", this.activate_action);
                }
            }
        };

        Chosen.prototype.container_mousedown = function(evt) {
            if (!this.is_disabled) {
                if (evt && evt.type === "mousedown" && !this.results_showing) {
                    evt.preventDefault();
                }
                if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
                    if (!this.active_field) {
                        if (this.is_multiple) {
                            this.search_field.val("");
                        }
                        $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
                        this.results_show();
                    } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
                        evt.preventDefault();
                        this.results_toggle();
                    }
                    return this.activate_field();
                }
            }
        };

        Chosen.prototype.container_mouseup = function(evt) {
            if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
                return this.results_reset(evt);
            }
        };

        Chosen.prototype.search_results_mousewheel = function(evt) {
            var delta;
            if (evt.originalEvent) {
                delta = -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
            }
            if (delta != null) {
                evt.preventDefault();
                if (evt.type === 'DOMMouseScroll') {
                    delta = delta * 40;
                }
                return this.search_results.scrollTop(delta + this.search_results.scrollTop());
            }
        };

        Chosen.prototype.blur_test = function(evt) {
            if (!this.active_field && this.container.hasClass("chosen-container-active")) {
                return this.close_field();
            }
        };

        Chosen.prototype.close_field = function() {
            $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
            this.active_field = false;
            this.results_hide();
            this.container.removeClass("chosen-container-active");
            this.clear_backstroke();
            this.show_search_field_default();
            return this.search_field_scale();
        };

        Chosen.prototype.activate_field = function() {
            this.container.addClass("chosen-container-active");
            this.active_field = true;
            this.search_field.val(this.search_field.val());
            return this.search_field.focus();
        };

        Chosen.prototype.test_active_click = function(evt) {
            var active_container;
            active_container = $(evt.target).closest('.chosen-container');
            if (active_container.length && this.container[0] === active_container[0]) {
                return this.active_field = true;
            } else {
                return this.close_field();
            }
        };

        Chosen.prototype.results_build = function() {
            this.parsing = true;
            this.selected_option_count = null;
            this.results_data = SelectParser.select_to_array(this.form_field);
            if (this.is_multiple) {
                this.search_choices.find("li.search-choice").remove();
            } else if (!this.is_multiple) {
                this.single_set_selected_text();
                if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
                    this.search_field[0].readOnly = true;
                    this.container.addClass("chosen-container-single-nosearch");
                } else {
                    this.search_field[0].readOnly = false;
                    this.container.removeClass("chosen-container-single-nosearch");
                }
            }
            this.update_results_content(this.results_option_build({
                first: true
            }));
            this.search_field_disabled();
            this.show_search_field_default();
            this.search_field_scale();
            return this.parsing = false;
        };

        Chosen.prototype.result_do_highlight = function(el) {
            var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
            if (el.length) {
                this.result_clear_highlight();
                this.result_highlight = el;
                this.result_highlight.addClass("highlighted");
                maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
                visible_top = this.search_results.scrollTop();
                visible_bottom = maxHeight + visible_top;
                high_top = this.result_highlight.position().top + this.search_results.scrollTop();
                high_bottom = high_top + this.result_highlight.outerHeight();
                if (high_bottom >= visible_bottom) {
                    return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
                } else if (high_top < visible_top) {
                    return this.search_results.scrollTop(high_top);
                }
            }
        };

        Chosen.prototype.result_clear_highlight = function() {
            if (this.result_highlight) {
                this.result_highlight.removeClass("highlighted");
            }
            return this.result_highlight = null;
        };

        Chosen.prototype.results_show = function() {
            if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                this.form_field_jq.trigger("chosen:maxselected", {
                    chosen: this
                });
                return false;
            }
            this.container.addClass("chosen-with-drop");
            this.results_showing = true;
            this.search_field.focus();
            this.search_field.val(this.search_field.val());
            this.winnow_results();
            return this.form_field_jq.trigger("chosen:showing_dropdown", {
                chosen: this
            });
        };

        Chosen.prototype.update_results_content = function(content) {
            return this.search_results.html(content);
        };

        Chosen.prototype.results_hide = function() {
            if (this.results_showing) {
                this.result_clear_highlight();
                this.container.removeClass("chosen-with-drop");
                this.form_field_jq.trigger("chosen:hiding_dropdown", {
                    chosen: this
                });
            }
            return this.results_showing = false;
        };

        Chosen.prototype.set_tab_index = function(el) {
            var ti;
            if (this.form_field.tabIndex) {
                ti = this.form_field.tabIndex;
                this.form_field.tabIndex = -1;
                return this.search_field[0].tabIndex = ti;
            }
        };

        Chosen.prototype.set_label_behavior = function() {
            var _this = this;
            this.form_field_label = this.form_field_jq.parents("label");
            if (!this.form_field_label.length && this.form_field.id.length) {
                this.form_field_label = $("label[for='" + this.form_field.id + "']");
            }
            if (this.form_field_label.length > 0) {
                return this.form_field_label.bind('click.chosen', function(evt) {
                    if (_this.is_multiple) {
                        return _this.container_mousedown(evt);
                    } else {
                        return _this.activate_field();
                    }
                });
            }
        };

        Chosen.prototype.show_search_field_default = function() {
            if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
                this.search_field.val(this.default_text);
                return this.search_field.addClass("default");
            } else {
                this.search_field.val("");
                return this.search_field.removeClass("default");
            }
        };

        Chosen.prototype.search_results_mouseup = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target.length) {
                this.result_highlight = target;
                this.result_select(evt);
                return this.search_field.focus();
            }
        };

        Chosen.prototype.search_results_mouseover = function(evt) {
            var target;
            target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
            if (target) {
                return this.result_do_highlight(target);
            }
        };

        Chosen.prototype.search_results_mouseout = function(evt) {
            if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
                return this.result_clear_highlight();
            }
        };

        Chosen.prototype.choice_build = function(item) {
            var choice, close_link,
                _this = this;
            choice = $('<li />', {
                "class": "search-choice"
            }).html("<span>" + item.html + "</span>");
            if (item.disabled) {
                choice.addClass('search-choice-disabled');
            } else {
                close_link = $('<a />', {
                    "class": 'search-choice-close',
                    'data-option-array-index': item.array_index
                });
                close_link.bind('click.chosen', function(evt) {
                    return _this.choice_destroy_link_click(evt);
                });
                choice.append(close_link);
            }
            return this.search_container.before(choice);
        };

        Chosen.prototype.choice_destroy_link_click = function(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (!this.is_disabled) {
                return this.choice_destroy($(evt.target));
            }
        };

        Chosen.prototype.choice_destroy = function(link) {
            if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
                this.show_search_field_default();
                if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
                    this.results_hide();
                }
                link.parents('li').first().remove();
                return this.search_field_scale();
            }
        };

        Chosen.prototype.results_reset = function() {
            this.reset_single_select_options();
            this.form_field.options[0].selected = true;
            this.single_set_selected_text();
            this.show_search_field_default();
            this.results_reset_cleanup();
            this.form_field_jq.trigger("change");
            if (this.active_field) {
                return this.results_hide();
            }
        };

        Chosen.prototype.results_reset_cleanup = function() {
            this.current_selectedIndex = this.form_field.selectedIndex;
            return this.selected_item.find("abbr").remove();
        };

        Chosen.prototype.result_select = function(evt) {
            var high, item;
            if (this.result_highlight) {
                high = this.result_highlight;
                this.result_clear_highlight();
                if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
                    this.form_field_jq.trigger("chosen:maxselected", {
                        chosen: this
                    });
                    return false;
                }
                if (this.is_multiple) {
                    high.removeClass("active-result");
                } else {
                    this.reset_single_select_options();
                }
                item = this.results_data[high[0].getAttribute("data-option-array-index")];
                item.selected = true;
                this.form_field.options[item.options_index].selected = true;
                this.selected_option_count = null;
                if (this.is_multiple) {
                    this.choice_build(item);
                } else {
                    this.single_set_selected_text(item.text);
                }
                if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
                    this.results_hide();
                }
                this.search_field.val("");
                if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
                    this.form_field_jq.trigger("change", {
                        'selected': this.form_field.options[item.options_index].value
                    });
                }
                this.current_selectedIndex = this.form_field.selectedIndex;
                return this.search_field_scale();
            }
        };

        Chosen.prototype.single_set_selected_text = function(text) {
            if (text == null) {
                text = this.default_text;
            }
            if (text === this.default_text) {
                this.selected_item.addClass("chosen-default");
            } else {
                this.single_deselect_control_build();
                this.selected_item.removeClass("chosen-default");
            }
            return this.selected_item.find("span").text(text);
        };

        Chosen.prototype.result_deselect = function(pos) {
            var result_data;
            result_data = this.results_data[pos];
            if (!this.form_field.options[result_data.options_index].disabled) {
                result_data.selected = false;
                this.form_field.options[result_data.options_index].selected = false;
                this.selected_option_count = null;
                this.result_clear_highlight();
                if (this.results_showing) {
                    this.winnow_results();
                }
                this.form_field_jq.trigger("change", {
                    deselected: this.form_field.options[result_data.options_index].value
                });
                this.search_field_scale();
                return true;
            } else {
                return false;
            }
        };

        Chosen.prototype.single_deselect_control_build = function() {
            if (!this.allow_single_deselect) {
                return;
            }
            if (!this.selected_item.find("abbr").length) {
                this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
            }
            return this.selected_item.addClass("chosen-single-with-deselect");
        };

        Chosen.prototype.get_search_text = function() {
            if (this.search_field.val() === this.default_text) {
                return "";
            } else {
                return $('<div/>').text($.trim(this.search_field.val())).html();
            }
        };

        Chosen.prototype.winnow_results_set_highlight = function() {
            var do_high, selected_results;
            selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
            do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
            if (do_high != null) {
                return this.result_do_highlight(do_high);
            }
        };

        Chosen.prototype.no_results = function(terms) {
            var no_results_html;
            no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
            no_results_html.find("span").first().html(terms);
            this.search_results.append(no_results_html);
            return this.form_field_jq.trigger("chosen:no_results", {
                chosen: this
            });
        };

        Chosen.prototype.no_results_clear = function() {
            return this.search_results.find(".no-results").remove();
        };

        Chosen.prototype.keydown_arrow = function() {
            var next_sib;
            if (this.results_showing && this.result_highlight) {
                next_sib = this.result_highlight.nextAll("li.active-result").first();
                if (next_sib) {
                    return this.result_do_highlight(next_sib);
                }
            } else {
                return this.results_show();
            }
        };

        Chosen.prototype.keyup_arrow = function() {
            var prev_sibs;
            if (!this.results_showing && !this.is_multiple) {
                return this.results_show();
            } else if (this.result_highlight) {
                prev_sibs = this.result_highlight.prevAll("li.active-result");
                if (prev_sibs.length) {
                    return this.result_do_highlight(prev_sibs.first());
                } else {
                    if (this.choices_count() > 0) {
                        this.results_hide();
                    }
                    return this.result_clear_highlight();
                }
            }
        };

        Chosen.prototype.keydown_backstroke = function() {
            var next_available_destroy;
            if (this.pending_backstroke) {
                this.choice_destroy(this.pending_backstroke.find("a").first());
                return this.clear_backstroke();
            } else {
                next_available_destroy = this.search_container.siblings("li.search-choice").last();
                if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
                    this.pending_backstroke = next_available_destroy;
                    if (this.single_backstroke_delete) {
                        return this.keydown_backstroke();
                    } else {
                        return this.pending_backstroke.addClass("search-choice-focus");
                    }
                }
            }
        };

        Chosen.prototype.clear_backstroke = function() {
            if (this.pending_backstroke) {
                this.pending_backstroke.removeClass("search-choice-focus");
            }
            return this.pending_backstroke = null;
        };

        Chosen.prototype.keydown_checker = function(evt) {
            var stroke, _ref1;
            stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
            this.search_field_scale();
            if (stroke !== 8 && this.pending_backstroke) {
                this.clear_backstroke();
            }
            switch (stroke) {
                case 8:
                    this.backstroke_length = this.search_field.val().length;
                    break;
                case 9:
                    if (this.results_showing && !this.is_multiple) {
                        this.result_select(evt);
                    }
                    this.mouse_on_container = false;
                    break;
                case 13:
                    evt.preventDefault();
                    break;
                case 38:
                    evt.preventDefault();
                    this.keyup_arrow();
                    break;
                case 40:
                    evt.preventDefault();
                    this.keydown_arrow();
                    break;
            }
        };

        Chosen.prototype.search_field_scale = function() {
            var div, f_width, h, style, style_block, styles, w, _i, _len;
            if (this.is_multiple) {
                h = 0;
                w = 0;
                style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
                styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
                for (_i = 0, _len = styles.length; _i < _len; _i++) {
                    style = styles[_i];
                    style_block += style + ":" + this.search_field.css(style) + ";";
                }
                div = $('<div />', {
                    'style': style_block
                });
                div.text(this.search_field.val());
                $('body').append(div);
                w = div.width() + 25;
                div.remove();
                f_width = this.container.outerWidth();
                if (w > f_width - 10) {
                    w = f_width - 10;
                }
                return this.search_field.css({
                    'width': w + 'px'
                });
            }
        };

        return Chosen;

    })(AbstractChosen);

}).call(this);
/*!
 * ClockPicker v{package.version} (http://weareoutman.github.io/clockpicker/)
 * Copyright 2014 Wang Shenwei.
 * Licensed under MIT (https://github.com/weareoutman/clockpicker/blob/gh-pages/LICENSE)
 */


;(function(){
	var $ = window.jQuery,
		$win = $(window),
		$doc = $(document),
		$body;

	// Can I use inline svg ?
	var svgNS = 'http://www.w3.org/2000/svg',
		svgSupported = 'SVGAngle' in window && (function(){
			var supported,
				el = document.createElement('div');
			el.innerHTML = '<svg/>';
			supported = (el.firstChild && el.firstChild.namespaceURI) == svgNS;
			el.innerHTML = '';
			return supported;
		})();

	// Can I use transition ?
	var transitionSupported = (function(){
		var style = document.createElement('div').style;
		return 'transition' in style ||
			'WebkitTransition' in style ||
			'MozTransition' in style ||
			'msTransition' in style ||
			'OTransition' in style;
	})();

	// Listen touch events in touch screen device, instead of mouse events in desktop.
	var touchSupported = 'ontouchstart' in window,
		mousedownEvent = 'mousedown' + ( touchSupported ? ' touchstart' : ''),
		mousemoveEvent = 'mousemove.clockpicker' + ( touchSupported ? ' touchmove.clockpicker' : ''),
		mouseupEvent = 'mouseup.clockpicker' + ( touchSupported ? ' touchend.clockpicker' : '');

	// Vibrate the device if supported
	var vibrate = navigator.vibrate ? 'vibrate' : navigator.webkitVibrate ? 'webkitVibrate' : null;

	function createSvgElement(name) {
		return document.createElementNS(svgNS, name);
	}

	function leadingZero(num) {
		return (num < 10 ? '0' : '') + num;
	}

	// Get a unique id
	var idCounter = 0;
	function uniqueId(prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	}

	// Clock size
	var dialRadius = 100,
		outerRadius = 80,
		// innerRadius = 80 on 12 hour clock
		innerRadius = 54,
		tickRadius = 13,
		diameter = dialRadius * 2,
		duration = transitionSupported ? 350 : 1;

	// Popover template
	var tpl = [
		'<div class="popover clockpicker-popover">',
			'<div class="arrow"></div>',
			'<div class="popover-title">',
				'<span class="clockpicker-span-hours text-primary"></span>',
				' : ',
				'<span class="clockpicker-span-minutes"></span>',
				'<span class="clockpicker-span-am-pm"></span>',
			'</div>',
			'<div class="popover-content">',
				'<div class="clockpicker-plate">',
					'<div class="clockpicker-canvas"></div>',
					'<div class="clockpicker-dial clockpicker-hours"></div>',
					'<div class="clockpicker-dial clockpicker-minutes clockpicker-dial-out"></div>',
				'</div>',
				'<span class="clockpicker-am-pm-block">',
				'</span>',
			'</div>',
		'</div>'
	].join('');

	// ClockPicker
	function ClockPicker(element, options) {
		var popover = $(tpl),
			plate = popover.find('.clockpicker-plate'),
			hoursView = popover.find('.clockpicker-hours'),
			minutesView = popover.find('.clockpicker-minutes'),
			amPmBlock = popover.find('.clockpicker-am-pm-block'),
			isInput = element.prop('tagName') === 'INPUT',
			input = isInput ? element : element.find('input'),
			addon = element.find('.input-group-addon'),
			self = this,
			timer;

		this.id = uniqueId('cp');
		this.element = element;
		this.options = options;
		this.isAppended = false;
		this.isShown = false;
		this.currentView = 'hours';
		this.isInput = isInput;
		this.input = input;
		this.addon = addon;
		this.popover = popover;
		this.plate = plate;
		this.hoursView = hoursView;
		this.minutesView = minutesView;
		this.amPmBlock = amPmBlock;
		this.spanHours = popover.find('.clockpicker-span-hours');
		this.spanMinutes = popover.find('.clockpicker-span-minutes');
		this.spanAmPm = popover.find('.clockpicker-span-am-pm');
		this.amOrPm = "PM";
		
		// Setup for for 12 hour clock if option is selected
		if (options.twelvehour) {
			
			var  amPmButtonsTemplate = ['<div class="clockpicker-am-pm-block">',
				'<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-am-button">',
				'AM</button>',
				'<button type="button" class="btn btn-sm btn-default clockpicker-button clockpicker-pm-button">',
				'PM</button>',
				'</div>'].join('');
			
			var amPmButtons = $(amPmButtonsTemplate);
			//amPmButtons.appendTo(plate);
			
			////Not working b/c they are not shown when this runs
			//$('clockpicker-am-button')
			//    .on("click", function() {
			//        self.amOrPm = "AM";
			//        $('.clockpicker-span-am-pm').empty().append('AM');
			//    });
			//    
			//$('clockpicker-pm-button')
			//    .on("click", function() {
			//         self.amOrPm = "PM";
			//        $('.clockpicker-span-am-pm').empty().append('PM');
			//    });
	
			$('<button type="button" class="btn btn-sm btn-default clockpicker-button am-button">' + "AM" + '</button>')
				.on("click", function() {
					self.amOrPm = "AM";
					$('.clockpicker-span-am-pm').empty().append('AM');
				}).appendTo(this.amPmBlock);
				
				
			$('<button type="button" class="btn btn-sm btn-default clockpicker-button pm-button">' + "PM" + '</button>')
				.on("click", function() {
					self.amOrPm = 'PM';
					$('.clockpicker-span-am-pm').empty().append('PM');
				}).appendTo(this.amPmBlock);
				
		}
		
		if (! options.autoclose) {
			// If autoclose is not setted, append a button
			$('<button type="button" class="btn btn-sm btn-default btn-block clockpicker-button">' + options.donetext + '</button>')
				.click($.proxy(this.done, this))
				.appendTo(popover);
		}

		// Placement and arrow align - make sure they make sense.
		if ((options.placement === 'top' || options.placement === 'bottom') && (options.align === 'top' || options.align === 'bottom')) options.align = 'left';
		if ((options.placement === 'left' || options.placement === 'right') && (options.align === 'left' || options.align === 'right')) options.align = 'top';

		popover.addClass(options.placement);
		popover.addClass('clockpicker-align-' + options.align);

		this.spanHours.click($.proxy(this.toggleView, this, 'hours'));
		this.spanMinutes.click($.proxy(this.toggleView, this, 'minutes'));

		// Show or toggle
		input.on('focus.clockpicker click.clockpicker', $.proxy(this.show, this));
		addon.on('click.clockpicker', $.proxy(this.toggle, this));

		// Build ticks
		var tickTpl = $('<div class="clockpicker-tick"></div>'),
			i, tick, radian, radius;

		// Hours view
		if (options.twelvehour) {
			for (i = 1; i < 13; i += 1) {
				tick = tickTpl.clone();
				radian = i / 6 * Math.PI;
				radius = outerRadius;
				tick.css('font-size', '120%');
				tick.css({
					left: dialRadius + Math.sin(radian) * radius - tickRadius,
					top: dialRadius - Math.cos(radian) * radius - tickRadius
				});
				tick.html(i === 0 ? '00' : i);
				hoursView.append(tick);
				tick.on(mousedownEvent, mousedown);
			}
		} else {
			for (i = 0; i < 24; i += 1) {
				tick = tickTpl.clone();
				radian = i / 6 * Math.PI;
				var inner = i > 0 && i < 13;
				radius = inner ? innerRadius : outerRadius;
				tick.css({
					left: dialRadius + Math.sin(radian) * radius - tickRadius,
					top: dialRadius - Math.cos(radian) * radius - tickRadius
				});
				if (inner) {
					tick.css('font-size', '120%');
				}
				tick.html(i === 0 ? '00' : i);
				hoursView.append(tick);
				tick.on(mousedownEvent, mousedown);
			}
		}

		// Minutes view
		for (i = 0; i < 60; i += 5) {
			tick = tickTpl.clone();
			radian = i / 30 * Math.PI;
			tick.css({
				left: dialRadius + Math.sin(radian) * outerRadius - tickRadius,
				top: dialRadius - Math.cos(radian) * outerRadius - tickRadius
			});
			tick.css('font-size', '120%');
			tick.html(leadingZero(i));
			minutesView.append(tick);
			tick.on(mousedownEvent, mousedown);
		}

		// Clicking on minutes view space
		plate.on(mousedownEvent, function(e){
			if ($(e.target).closest('.clockpicker-tick').length === 0) {
				mousedown(e, true);
			}
		});

		// Mousedown or touchstart
		function mousedown(e, space) {
			var offset = plate.offset(),
				isTouch = /^touch/.test(e.type),
				x0 = offset.left + dialRadius,
				y0 = offset.top + dialRadius,
				dx = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
				dy = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0,
				z = Math.sqrt(dx * dx + dy * dy),
				moved = false;

			// When clicking on minutes view space, check the mouse position
			if (space && (z < outerRadius - tickRadius || z > outerRadius + tickRadius)) {
				return;
			}
			e.preventDefault();

			// Set cursor style of body after 200ms
			var movingTimer = setTimeout(function(){
				$body.addClass('clockpicker-moving');
			}, 200);

			// Place the canvas to top
			if (svgSupported) {
				plate.append(self.canvas);
			}

			// Clock
			self.setHand(dx, dy, ! space, true);

			// Mousemove on document
			$doc.off(mousemoveEvent).on(mousemoveEvent, function(e){
				e.preventDefault();
				var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0;
				if (! moved && x === dx && y === dy) {
					// Clicking in chrome on windows will trigger a mousemove event
					return;
				}
				moved = true;
				self.setHand(x, y, false, true);
			});

			// Mouseup on document
			$doc.off(mouseupEvent).on(mouseupEvent, function(e){
				$doc.off(mouseupEvent);
				e.preventDefault();
				var isTouch = /^touch/.test(e.type),
					x = (isTouch ? e.originalEvent.changedTouches[0] : e).pageX - x0,
					y = (isTouch ? e.originalEvent.changedTouches[0] : e).pageY - y0;
				if ((space || moved) && x === dx && y === dy) {
					self.setHand(x, y);
				}
				if (self.currentView === 'hours') {
					self.toggleView('minutes', duration / 2);
				} else {
					if (options.autoclose) {
						self.minutesView.addClass('clockpicker-dial-out');
						setTimeout(function(){
							self.done();
						}, duration / 2);
					}
				}
				plate.prepend(canvas);

				// Reset cursor style of body
				clearTimeout(movingTimer);
				$body.removeClass('clockpicker-moving');

				// Unbind mousemove event
				$doc.off(mousemoveEvent);
			});
		}

		if (svgSupported) {
			// Draw clock hands and others
			var canvas = popover.find('.clockpicker-canvas'),
				svg = createSvgElement('svg');
			svg.setAttribute('class', 'clockpicker-svg');
			svg.setAttribute('width', diameter);
			svg.setAttribute('height', diameter);
			var g = createSvgElement('g');
			g.setAttribute('transform', 'translate(' + dialRadius + ',' + dialRadius + ')');
			var bearing = createSvgElement('circle');
			bearing.setAttribute('class', 'clockpicker-canvas-bearing');
			bearing.setAttribute('cx', 0);
			bearing.setAttribute('cy', 0);
			bearing.setAttribute('r', 2);
			var hand = createSvgElement('line');
			hand.setAttribute('x1', 0);
			hand.setAttribute('y1', 0);
			var bg = createSvgElement('circle');
			bg.setAttribute('class', 'clockpicker-canvas-bg');
			bg.setAttribute('r', tickRadius);
			var fg = createSvgElement('circle');
			fg.setAttribute('class', 'clockpicker-canvas-fg');
			fg.setAttribute('r', 3.5);
			g.appendChild(hand);
			g.appendChild(bg);
			g.appendChild(fg);
			g.appendChild(bearing);
			svg.appendChild(g);
			canvas.append(svg);

			this.hand = hand;
			this.bg = bg;
			this.fg = fg;
			this.bearing = bearing;
			this.g = g;
			this.canvas = canvas;
		}

		raiseCallback(this.options.init);
	}

	function raiseCallback(callbackFunction) {
		if (callbackFunction && typeof callbackFunction === "function") {
			callbackFunction();
		}
	}

	// Default options
	ClockPicker.DEFAULTS = {
		'default': '',       // default time, 'now' or '13:14' e.g.
		fromnow: 0,          // set default time to * milliseconds from now (using with default = 'now')
		placement: 'bottom', // clock popover placement
		align: 'left',       // popover arrow align
		donetext: '完成',    // done button text
		autoclose: false,    // auto close when minute is selected
		twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
		vibrate: true        // vibrate the device when dragging clock hand
	};

	// Show or hide popover
	ClockPicker.prototype.toggle = function(){
		this[this.isShown ? 'hide' : 'show']();
	};

	// Set popover position
	ClockPicker.prototype.locate = function(){
		var element = this.element,
			popover = this.popover,
			offset = element.offset(),
			width = element.outerWidth(),
			height = element.outerHeight(),
			placement = this.options.placement,
			align = this.options.align,
			styles = {},
			self = this;

		popover.show();

		// Place the popover
		switch (placement) {
			case 'bottom':
				styles.top = offset.top + height;
				break;
			case 'right':
				styles.left = offset.left + width;
				break;
			case 'top':
				styles.top = offset.top - popover.outerHeight();
				break;
			case 'left':
				styles.left = offset.left - popover.outerWidth();
				break;
		}

		// Align the popover arrow
		switch (align) {
			case 'left':
				styles.left = offset.left;
				break;
			case 'right':
				styles.left = offset.left + width - popover.outerWidth();
				break;
			case 'top':
				styles.top = offset.top;
				break;
			case 'bottom':
				styles.top = offset.top + height - popover.outerHeight();
				break;
		}

		popover.css(styles);
	};

	// Show popover
	ClockPicker.prototype.show = function(e){
		// Not show again
		if (this.isShown) {
			return;
		}

		raiseCallback(this.options.beforeShow);

		var self = this;

		// Initialize
		if (! this.isAppended) {
			// Append popover to body
			$body = $(document.body).append(this.popover);

			// Reset position when resize
			$win.on('resize.clockpicker' + this.id, function(){
				if (self.isShown) {
					self.locate();
				}
			});

			this.isAppended = true;
		}

		// Get the time
		var value = ((this.input.prop('value') || this.options['default'] || '') + '').split(':');
		if (value[0] === 'now') {
			var now = new Date(+ new Date() + this.options.fromnow);
			value = [
				now.getHours(),
				now.getMinutes()
			];
		}
		this.hours = + value[0] || 0;
		this.minutes = + value[1] || 0;
		this.spanHours.html(leadingZero(this.hours));
		this.spanMinutes.html(leadingZero(this.minutes));

		// Toggle to hours view
		this.toggleView('hours');

		// Set position
		this.locate();

		this.isShown = true;

		// Hide when clicking or tabbing on any element except the clock, input and addon
		$doc.on('click.clockpicker.' + this.id + ' focusin.clockpicker.' + this.id, function(e){
			var target = $(e.target);
			if (target.closest(self.popover).length === 0 &&
					target.closest(self.addon).length === 0 &&
					target.closest(self.input).length === 0) {
				self.hide();
			}
		});

		// Hide when ESC is pressed
		$doc.on('keyup.clockpicker.' + this.id, function(e){
			if (e.keyCode === 27) {
				self.hide();
			}
		});

		raiseCallback(this.options.afterShow);
	};

	// Hide popover
	ClockPicker.prototype.hide = function(){
		raiseCallback(this.options.beforeHide);

		this.isShown = false;

		// Unbinding events on document
		$doc.off('click.clockpicker.' + this.id + ' focusin.clockpicker.' + this.id);
		$doc.off('keyup.clockpicker.' + this.id);

		this.popover.hide();

		raiseCallback(this.options.afterHide);
	};

	// Toggle to hours or minutes view
	ClockPicker.prototype.toggleView = function(view, delay){
		var raiseAfterHourSelect = false;
		if (view === 'minutes' && $(this.hoursView).css("visibility") === "visible") {
			raiseCallback(this.options.beforeHourSelect);
			raiseAfterHourSelect = true;
		}
		var isHours = view === 'hours',
			nextView = isHours ? this.hoursView : this.minutesView,
			hideView = isHours ? this.minutesView : this.hoursView;

		this.currentView = view;

		this.spanHours.toggleClass('text-primary', isHours);
		this.spanMinutes.toggleClass('text-primary', ! isHours);

		// Let's make transitions
		hideView.addClass('clockpicker-dial-out');
		nextView.css('visibility', 'visible').removeClass('clockpicker-dial-out');

		// Reset clock hand
		this.resetClock(delay);

		// After transitions ended
		clearTimeout(this.toggleViewTimer);
		this.toggleViewTimer = setTimeout(function(){
			hideView.css('visibility', 'hidden');
		}, duration);

		if (raiseAfterHourSelect) {
			raiseCallback(this.options.afterHourSelect);
		}
	};

	// Reset clock hand
	ClockPicker.prototype.resetClock = function(delay){
		var view = this.currentView,
			value = this[view],
			isHours = view === 'hours',
			unit = Math.PI / (isHours ? 6 : 30),
			radian = value * unit,
			radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
			x = Math.sin(radian) * radius,
			y = - Math.cos(radian) * radius,
			self = this;
		if (svgSupported && delay) {
			self.canvas.addClass('clockpicker-canvas-out');
			setTimeout(function(){
				self.canvas.removeClass('clockpicker-canvas-out');
				self.setHand(x, y);
			}, delay);
		} else {
			this.setHand(x, y);
		}
	};

	// Set clock hand to (x, y)
	ClockPicker.prototype.setHand = function(x, y, roundBy5, dragging){
		var radian = Math.atan2(x, - y),
			isHours = this.currentView === 'hours',
			unit = Math.PI / (isHours || roundBy5 ? 6 : 30),
			z = Math.sqrt(x * x + y * y),
			options = this.options,
			inner = isHours && z < (outerRadius + innerRadius) / 2,
			radius = inner ? innerRadius : outerRadius,
			value;
			
			if (options.twelvehour) {
				radius = outerRadius;
			}

		// Radian should in range [0, 2PI]
		if (radian < 0) {
			radian = Math.PI * 2 + radian;
		}

		// Get the round value
		value = Math.round(radian / unit);

		// Get the round radian
		radian = value * unit;

		// Correct the hours or minutes
		if (options.twelvehour) {
			if (isHours) {
				if (value === 0) {
					value = 12;
				}
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
		} else {
			if (isHours) {
				if (value === 12) {
					value = 0;
				}
				value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
		}
		
		// Once hours or minutes changed, vibrate the device
		if (this[this.currentView] !== value) {
			if (vibrate && this.options.vibrate) {
				// Do not vibrate too frequently
				if (! this.vibrateTimer) {
					navigator[vibrate](10);
					this.vibrateTimer = setTimeout($.proxy(function(){
						this.vibrateTimer = null;
					}, this), 100);
				}
			}
		}

		this[this.currentView] = value;
		this[isHours ? 'spanHours' : 'spanMinutes'].html(leadingZero(value));

		// If svg is not supported, just add an active class to the tick
		if (! svgSupported) {
			this[isHours ? 'hoursView' : 'minutesView'].find('.clockpicker-tick').each(function(){
				var tick = $(this);
				tick.toggleClass('active', value === + tick.html());
			});
			return;
		}

		// Place clock hand at the top when dragging
		if (dragging || (! isHours && value % 5)) {
			this.g.insertBefore(this.hand, this.bearing);
			this.g.insertBefore(this.bg, this.fg);
			this.bg.setAttribute('class', 'clockpicker-canvas-bg clockpicker-canvas-bg-trans');
		} else {
			// Or place it at the bottom
			this.g.insertBefore(this.hand, this.bg);
			this.g.insertBefore(this.fg, this.bg);
			this.bg.setAttribute('class', 'clockpicker-canvas-bg');
		}

		// Set clock hand and others' position
		var cx = Math.sin(radian) * radius,
			cy = - Math.cos(radian) * radius;
		this.hand.setAttribute('x2', cx);
		this.hand.setAttribute('y2', cy);
		this.bg.setAttribute('cx', cx);
		this.bg.setAttribute('cy', cy);
		this.fg.setAttribute('cx', cx);
		this.fg.setAttribute('cy', cy);
	};

	// Hours and minutes are selected
	ClockPicker.prototype.done = function() {
		raiseCallback(this.options.beforeDone);
		this.hide();
		var last = this.input.prop('value'),
			value = leadingZero(this.hours) + ':' + leadingZero(this.minutes);
		if  (this.options.twelvehour) {
			value = value + this.amOrPm;
		}
		
		this.input.prop('value', value);
		if (value !== last) {
			this.input.triggerHandler('change');
			if (! this.isInput) {
				this.element.trigger('change');
			}
		}

		if (this.options.autoclose) {
			this.input.trigger('blur');
		}

		raiseCallback(this.options.afterDone);
	};

	// Remove clockpicker from input
	ClockPicker.prototype.remove = function() {
		this.element.removeData('clockpicker');
		this.input.off('focus.clockpicker click.clockpicker');
		this.addon.off('click.clockpicker');
		if (this.isShown) {
			this.hide();
		}
		if (this.isAppended) {
			$win.off('resize.clockpicker' + this.id);
			this.popover.remove();
		}
	};

	// Extends $.fn.clockpicker
	$.fn.clockpicker = function(option){
		var args = Array.prototype.slice.call(arguments, 1);
		return this.each(function(){
			var $this = $(this),
				data = $this.data('clockpicker');
			if (! data) {
				var options = $.extend({}, ClockPicker.DEFAULTS, $this.data(), typeof option == 'object' && option);
				$this.data('clockpicker', new ClockPicker($this, options));
			} else {
				// Manual operatsions. show, hide, remove, e.g.
				if (typeof data[option] === 'function') {
					data[option].apply(data, args);
				}
			}
		});
	};
}());
/**
* @version: 1.3.21
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2015 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: https://www.improvely.com/
*/


(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['moment', 'jquery', 'exports'], function(momentjs, $, exports) {
      root.daterangepicker = factory(root, exports, momentjs, $);
    });

  } else if (typeof exports !== 'undefined') {
    var momentjs = require('moment');
    var jQuery;
    try {
      jQuery = require('jquery');
    } catch (err) {
      jQuery = window.jQuery;
      if (!jQuery) throw new Error('jQuery dependency not found');
    }

    factory(root, exports, momentjs, jQuery);

  // Finally, as a browser global.
  } else {
    root.daterangepicker = factory(root, {}, root.moment, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, daterangepicker, moment, $) {

    var DateRangePicker = function (element, options, cb) {

        // by default, the daterangepicker element is placed at the bottom of HTML body
        this.parentEl = 'body';

        //element that triggered the date range picker
        this.element = $(element);

        //tracks visible state
        this.isShowing = false;

        //create the picker HTML object
        var DRPTemplate = '<div class="daterangepicker dropdown-menu">' +
                '<div class="calendar first left"></div>' +
                '<div class="calendar second right"></div>' +
                '<div class="ranges">' +
                  '<div class="range_inputs">' +
                    '<div class="daterangepicker_start_input">' +
                      '<label for="daterangepicker_start"></label>' +
                      '<input class="input-mini" type="text" name="daterangepicker_start" value="" />' +
                    '</div>' +
                    '<div class="daterangepicker_end_input">' +
                      '<label for="daterangepicker_end"></label>' +
                      '<input class="input-mini" type="text" name="daterangepicker_end" value="" />' +
                    '</div>' +
                    '<button class="applyBtn" disabled="disabled"></button>&nbsp;' +
                    '<button class="cancelBtn"></button>' +
                  '</div>' +
                '</div>' +
              '</div>';

        //custom options
        if (typeof options !== 'object' || options === null)
            options = {};

        this.parentEl = (typeof options === 'object' && options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(DRPTemplate).appendTo(this.parentEl);

        this.setOptions(options, cb);

        //event listeners
        this.container.find('.calendar')
            .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
            .on('click.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
            .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this))
            .on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
            .on('change.daterangepicker', 'select.yearselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.monthselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.updateTime, this));

        this.container.find('.ranges')
            .on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
            .on('click.daterangepicker', '.daterangepicker_start_input,.daterangepicker_end_input', $.proxy(this.showCalendars, this))
            .on('change.daterangepicker', '.daterangepicker_start_input,.daterangepicker_end_input', $.proxy(this.inputsChanged, this))
            .on('keydown.daterangepicker', '.daterangepicker_start_input,.daterangepicker_end_input', $.proxy(this.inputsKeydown, this))
            .on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
            .on('mouseenter.daterangepicker', 'li', $.proxy(this.enterRange, this))
            .on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

        if (this.element.is('input')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.updateFromControl, this),
                'keydown.daterangepicker': $.proxy(this.keydown, this)
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
        }

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        setOptions: function(options, callback) {

            this.startDate = moment().startOf('day');
            this.endDate = moment().endOf('day');
            this.timeZone = moment().utcOffset();
            this.minDate = false;
            this.maxDate = false;
            this.dateLimit = false;

            this.showDropdowns = false;
            this.showWeekNumbers = false;
            this.timePicker = false;
            this.timePickerSeconds = false;
            this.timePickerIncrement = 30;
            this.timePicker12Hour = true;
            this.singleDatePicker = false;
            this.ranges = {};

            this.opens = 'right';
            if (this.element.hasClass('pull-right'))
                this.opens = 'left';

            this.drops = 'down';
            if (this.element.hasClass('dropup'))
                this.drops = 'up';

            this.buttonClasses = ['btn', 'btn-small btn-sm'];
            this.applyClass = 'btn-success';
            this.cancelClass = 'btn-default';

            this.format = 'MM/DD/YYYY';
            this.separator = ' - ';

            this.locale = {
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: moment.weekdaysMin(),
                monthNames: moment.monthsShort(),
                firstDay: moment.localeData()._week.dow
            };

            this.cb = function () { };

            if (typeof options.format === 'string')
                this.format = options.format;

            if (typeof options.separator === 'string')
                this.separator = options.separator;

            if (typeof options.startDate === 'string')
                this.startDate = moment(options.startDate, this.format);

            if (typeof options.endDate === 'string')
                this.endDate = moment(options.endDate, this.format);

            if (typeof options.minDate === 'string')
                this.minDate = moment(options.minDate, this.format);

            if (typeof options.maxDate === 'string')
                this.maxDate = moment(options.maxDate, this.format);

            if (typeof options.startDate === 'object')
                this.startDate = moment(options.startDate);

            if (typeof options.endDate === 'object')
                this.endDate = moment(options.endDate);

            if (typeof options.minDate === 'object')
                this.minDate = moment(options.minDate);

            if (typeof options.maxDate === 'object')
                this.maxDate = moment(options.maxDate);

            if (typeof options.applyClass === 'string')
                this.applyClass = options.applyClass;

            if (typeof options.cancelClass === 'string')
                this.cancelClass = options.cancelClass;

            if (typeof options.dateLimit === 'object')
                this.dateLimit = options.dateLimit;

            if (typeof options.locale === 'object') {

                if (typeof options.locale.daysOfWeek === 'object') {
                    // Create a copy of daysOfWeek to avoid modification of original
                    // options object for reusability in multiple daterangepicker instances
                    this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
                }

                if (typeof options.locale.monthNames === 'object') {
                  this.locale.monthNames = options.locale.monthNames.slice();
                }

                if (typeof options.locale.firstDay === 'number') {
                  this.locale.firstDay = options.locale.firstDay;
                }

                if (typeof options.locale.applyLabel === 'string') {
                  this.locale.applyLabel = options.locale.applyLabel;
                }

                if (typeof options.locale.cancelLabel === 'string') {
                  this.locale.cancelLabel = options.locale.cancelLabel;
                }

                if (typeof options.locale.fromLabel === 'string') {
                  this.locale.fromLabel = options.locale.fromLabel;
                }

                if (typeof options.locale.toLabel === 'string') {
                  this.locale.toLabel = options.locale.toLabel;
                }

                if (typeof options.locale.weekLabel === 'string') {
                  this.locale.weekLabel = options.locale.weekLabel;
                }

                if (typeof options.locale.customRangeLabel === 'string') {
                  this.locale.customRangeLabel = options.locale.customRangeLabel;
                }
            }

            if (typeof options.opens === 'string')
                this.opens = options.opens;

            if (typeof options.drops === 'string')
                this.drops = options.drops;

            if (typeof options.showWeekNumbers === 'boolean') {
                this.showWeekNumbers = options.showWeekNumbers;
            }

            if (typeof options.buttonClasses === 'string') {
                this.buttonClasses = [options.buttonClasses];
            }

            if (typeof options.buttonClasses === 'object') {
                this.buttonClasses = options.buttonClasses;
            }

            if (typeof options.showDropdowns === 'boolean') {
                this.showDropdowns = options.showDropdowns;
            }

            if (typeof options.singleDatePicker === 'boolean') {
                this.singleDatePicker = options.singleDatePicker;
                if (this.singleDatePicker) {
                    this.endDate = this.startDate.clone();
                }
            }

            if (typeof options.timePicker === 'boolean') {
                this.timePicker = options.timePicker;
            }

            if (typeof options.timePickerSeconds === 'boolean') {
                this.timePickerSeconds = options.timePickerSeconds;
            }

            if (typeof options.timePickerIncrement === 'number') {
                this.timePickerIncrement = options.timePickerIncrement;
            }

            if (typeof options.timePicker12Hour === 'boolean') {
                this.timePicker12Hour = options.timePicker12Hour;
            }

            // update day names order to firstDay
            if (this.locale.firstDay != 0) {
                var iterator = this.locale.firstDay;
                while (iterator > 0) {
                    this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                    iterator--;
                }
            }

            var start, end, range;

            //if no start/end dates set, check if an input element contains initial values
            if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
                if ($(this.element).is('input[type=text]')) {
                    var val = $(this.element).val(),
                        split = val.split(this.separator);

                    start = end = null;

                    if (split.length == 2) {
                        start = moment(split[0], this.format);
                        end = moment(split[1], this.format);
                    } else if (this.singleDatePicker && val !== "") {
                        start = moment(val, this.format);
                        end = moment(val, this.format);
                    }
                    if (start !== null && end !== null) {
                        this.startDate = start;
                        this.endDate = end;
                    }
                }
            }

            // bind the time zone used to build the calendar to either the timeZone passed in through the options or the zone of the startDate (which will be the local time zone by default)
            if (typeof options.timeZone === 'string' || typeof options.timeZone === 'number') {
            	if (typeof options.timeZone === 'string' && typeof moment.tz !== 'undefined') {
            		this.timeZone = moment.tz.zone(options.timeZone).parse(new Date) * -1;	// Offset is positive if the timezone is behind UTC and negative if it is ahead.
            	} else {
            		this.timeZone = options.timeZone;
            	}
              this.startDate.utcOffset(this.timeZone);
              this.endDate.utcOffset(this.timeZone);
            } else {
                this.timeZone = moment(this.startDate).utcOffset();
            }

            if (typeof options.ranges === 'object') {
                for (range in options.ranges) {

                    if (typeof options.ranges[range][0] === 'string')
                        start = moment(options.ranges[range][0], this.format);
                    else
                        start = moment(options.ranges[range][0]);

                    if (typeof options.ranges[range][1] === 'string')
                        end = moment(options.ranges[range][1], this.format);
                    else
                        end = moment(options.ranges[range][1]);

                    // If we have a min/max date set, bound this range
                    // to it, but only if it would otherwise fall
                    // outside of the min/max.
                    if (this.minDate && start.isBefore(this.minDate))
                        start = moment(this.minDate);

                    if (this.maxDate && end.isAfter(this.maxDate))
                        end = moment(this.maxDate);

                    // If the end of the range is before the minimum (if min is set) OR
                    // the start of the range is after the max (also if set) don't display this
                    // range option.
                    if ((this.minDate && end.isBefore(this.minDate)) || (this.maxDate && start.isAfter(this.maxDate))) {
                        continue;
                    }

                    this.ranges[range] = [start, end];
                }

                var list = '<ul>';
                for (range in this.ranges) {
                    list += '<li>' + range + '</li>';
                }
                list += '<li>' + this.locale.customRangeLabel + '</li>';
                list += '</ul>';
                this.container.find('.ranges ul').remove();
                this.container.find('.ranges').prepend(list);
            }

            if (typeof callback === 'function') {
                this.cb = callback;
            }

            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }

            if (this.singleDatePicker) {
                this.opens = 'right';
                this.container.addClass('single');
                this.container.find('.calendar.right').show();
                this.container.find('.calendar.left').hide();
                if (!this.timePicker) {
                    this.container.find('.ranges').hide();
                } else {
                    this.container.find('.ranges .daterangepicker_start_input, .ranges .daterangepicker_end_input').hide();
                }
                if (!this.container.find('.calendar.right').hasClass('single'))
                    this.container.find('.calendar.right').addClass('single');
            } else {
                this.container.removeClass('single');
                this.container.find('.calendar.right').removeClass('single');
                this.container.find('.ranges').show();
            }

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.oldChosenLabel = this.chosenLabel;

            this.leftCalendar = {
                month: moment([this.startDate.year(), this.startDate.month(), 1, this.startDate.hour(), this.startDate.minute(), this.startDate.second()]),
                calendar: []
            };

            this.rightCalendar = {
                month: moment([this.endDate.year(), this.endDate.month(), 1, this.endDate.hour(), this.endDate.minute(), this.endDate.second()]),
                calendar: []
            };

            if (this.opens == 'right' || this.opens == 'center') {
                //swap calendar positions
                var first = this.container.find('.calendar.first');
                var second = this.container.find('.calendar.second');

                if (second.hasClass('single')) {
                    second.removeClass('single');
                    first.addClass('single');
                }

                first.removeClass('left').addClass('right');
                second.removeClass('right').addClass('left');

                if (this.singleDatePicker) {
                    first.show();
                    second.hide();
                }
            }

            if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
                this.container.addClass('show-calendar');
            }

            this.container.removeClass('opensleft opensright').addClass('opens' + this.opens);

            this.updateView();
            this.updateCalendars();

            //apply CSS classes and labels to buttons
            var c = this.container;
            $.each(this.buttonClasses, function (idx, val) {
                c.find('button').addClass(val);
            });
            this.container.find('.daterangepicker_start_input label').html(this.locale.fromLabel);
            this.container.find('.daterangepicker_end_input label').html(this.locale.toLabel);
            if (this.applyClass.length)
                this.container.find('.applyBtn').addClass(this.applyClass);
            if (this.cancelClass.length)
                this.container.find('.cancelBtn').addClass(this.cancelClass);
            this.container.find('.applyBtn').html(this.locale.applyLabel);
            this.container.find('.cancelBtn').html(this.locale.cancelLabel);
        },

        setStartDate: function(startDate) {
            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.format).utcOffset(this.timeZone);

            if (typeof startDate === 'object')
                this.startDate = moment(startDate);

            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');

            this.oldStartDate = this.startDate.clone();

            this.updateView();
            this.updateCalendars();
            this.updateInputText();
        },

        setEndDate: function(endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.format).utcOffset(this.timeZone);

            if (typeof endDate === 'object')
                this.endDate = moment(endDate);

            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');

            this.oldEndDate = this.endDate.clone();

            this.updateView();
            this.updateCalendars();
            this.updateInputText();
        },

        updateView: function () {
            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
            this.updateFormInputs();
        },

        updateFormInputs: function () {
            this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.format));
            this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.format));

            if (this.startDate.isSame(this.endDate) || this.startDate.isBefore(this.endDate)) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }
        },

        updateFromControl: function () {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            var dateString = this.element.val().split(this.separator),
                start = null,
                end = null;

            if(dateString.length === 2) {
                start = moment(dateString[0], this.format).utcOffset(this.timeZone);
                end = moment(dateString[1], this.format).utcOffset(this.timeZone);
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.format).utcOffset(this.timeZone);
                end = start;
            }

            if (end.isBefore(start)) return;

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.startDate = start;
            this.endDate = end;

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.updateCalendars();
        },
        
        keydown: function (e) {
            //hide on tab or enter
        	if ((e.keyCode === 9) || (e.keyCode === 13)) {
        		this.hide();
        	}
        },

        notify: function () {
            this.updateView();
            this.cb(this.startDate, this.endDate, this.chosenLabel);
        },

        move: function () {
            var parentOffset = { top: 0, left: 0 },
            	containerTop;
            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }
            
            if (this.drops == 'up')
            	containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            else
            	containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
            this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');

            if (this.opens == 'left') {
                this.container.css({
                    top: containerTop,
                    right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else if (this.opens == 'center') {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
                            - this.container.outerWidth() / 2,
                    right: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        toggle: function (e) {
            if (this.element.hasClass('active')) {
                this.hide();
            } else {
                this.show();
            }
        },

        show: function (e) {
            if (this.isShowing) return;

            this.element.addClass('active');
            this.container.show();
            this.move();

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function (e) { this.outsideClick(e); }, this);
            // Bind global datepicker mousedown for hiding and
            $(document)
              .on('mousedown.daterangepicker', this._outsideClickProxy)
              // also support mobile devices
              .on('touchend.daterangepicker', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
              .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
              .on('focusin.daterangepicker', this._outsideClickProxy);

            this.isShowing = true;
            this.element.trigger('show.daterangepicker', this);
        },

        outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix
                e.type == "focusin" ||
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-date').length
                ) return;
            this.hide();
        },

        hide: function (e) {
            if (!this.isShowing) return;

            $(document)
              .off('.daterangepicker');

            this.element.removeClass('active');
            this.container.hide();

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.isShowing = false;
            this.element.trigger('hide.daterangepicker', this);
        },

        enterRange: function (e) {
            // mouse pointer has entered a range label
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.format));
                this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.format));
            }
        },

        showCalendars: function() {
            this.container.addClass('show-calendar');
            this.move();
            this.element.trigger('showCalendar.daterangepicker', this);
        },

        hideCalendars: function() {
            this.container.removeClass('show-calendar');
            this.element.trigger('hideCalendar.daterangepicker', this);
        },

        // when a date is typed into the start to end date textboxes
        inputsChanged: function (e) {
            var el = $(e.target);
            var date = moment(el.val(), this.format);
            if (!date.isValid()) return;

            var startDate, endDate;
            if (el.attr('name') === 'daterangepicker_start') {
                startDate = (false !== this.minDate && date.isBefore(this.minDate)) ? this.minDate : date;
                endDate = this.endDate;
            } else {
                startDate = this.startDate;
                endDate = (false !== this.maxDate && date.isAfter(this.maxDate)) ? this.maxDate : date;
            }
            this.setCustomDates(startDate, endDate);
        },

        inputsKeydown: function(e) {
            if (e.keyCode === 13) {
                this.inputsChanged(e);
                this.notify();
            }
        },

        updateInputText: function() {
            if (this.element.is('input') && !this.singleDatePicker) {
                this.element.val(this.startDate.format(this.format) + this.separator + this.endDate.format(this.format));
                this.element.trigger('change');
            } else if (this.element.is('input')) {
                this.element.val(this.endDate.format(this.format));
                this.element.trigger('change');
            }
        },

        clickRange: function (e) {
            var label = e.target.innerHTML;
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];

                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }

                this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
                this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
                this.updateCalendars();

                this.updateInputText();

                this.hideCalendars();
                this.hide();
                this.element.trigger('apply.daterangepicker', this);
            }
        },

        clickPrev: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract(1, 'month');
            } else {
                this.rightCalendar.month.subtract(1, 'month');
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add(1, 'month');
            } else {
                this.rightCalendar.month.add(1, 'month');
            }
            this.updateCalendars();
        },

        hoverDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            if (cal.hasClass('left')) {
                this.container.find('input[name=daterangepicker_start]').val(this.leftCalendar.calendar[row][col].format(this.format));
            } else {
                this.container.find('input[name=daterangepicker_end]').val(this.rightCalendar.calendar[row][col].format(this.format));
            }
        },

        setCustomDates: function(startDate, endDate) {
            this.chosenLabel = this.locale.customRangeLabel;
            if (startDate.isAfter(endDate)) {
                var difference = this.endDate.diff(this.startDate);
                endDate = moment(startDate).add(difference, 'ms');
                if (this.maxDate && endDate.isAfter(this.maxDate)) {
                  endDate = this.maxDate.clone();
                }
            }
            this.startDate = startDate;
            this.endDate = endDate;

            this.updateView();
            this.updateCalendars();
        },

        clickDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            var startDate, endDate;
            if (cal.hasClass('left')) {
                startDate = this.leftCalendar.calendar[row][col];
                endDate = this.endDate;
                if (typeof this.dateLimit === 'object') {
                    var maxDate = moment(startDate).add(this.dateLimit).startOf('day');
                    if (endDate.isAfter(maxDate)) {
                        endDate = maxDate;
                    }
                }
            } else {
                startDate = this.startDate;
                endDate = this.rightCalendar.calendar[row][col];
                if (typeof this.dateLimit === 'object') {
                    var minDate = moment(endDate).subtract(this.dateLimit).startOf('day');
                    if (startDate.isBefore(minDate)) {
                        startDate = minDate;
                    }
                }
            }

            if (this.singleDatePicker && cal.hasClass('left')) {
                endDate = startDate.clone();
            } else if (this.singleDatePicker && cal.hasClass('right')) {
                startDate = endDate.clone();
            }

            cal.find('td').removeClass('active');

            $(e.target).addClass('active');

            this.setCustomDates(startDate, endDate);

            if (!this.timePicker)
                endDate.endOf('day');

            if (this.singleDatePicker && !this.timePicker)
                this.clickApply();
        },

        clickApply: function (e) {
            this.updateInputText();
            this.hide();
            this.element.trigger('apply.daterangepicker', this);
        },

        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.chosenLabel = this.oldChosenLabel;
            this.updateView();
            this.updateCalendars();
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

        updateMonthYear: function (e) {
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.'+leftOrRight);

            // Month must be Number for new moment versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            if (!isLeft && !this.singleDatePicker) {
                if (year < this.startDate.year() || (year == this.startDate.year() && month < this.startDate.month())) {
                    month = this.startDate.month();
                    year = this.startDate.year();
                }
            }

            if (this.minDate) {
                if (year < this.minDate.year() || (year == this.minDate.year() && month < this.minDate.month())) {
                    month = this.minDate.month();
                    year = this.minDate.year();
                }
            }

            if (this.maxDate) {
                if (year > this.maxDate.year() || (year == this.maxDate.year() && month > this.maxDate.month())) {
                    month = this.maxDate.month();
                    year = this.maxDate.year();
                }
            }


            this[leftOrRight+'Calendar'].month.month(month).year(year);
            this.updateCalendars();
        },

        updateTime: function(e) {

            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);
            var second = 0;

            if (this.timePickerSeconds) {
                second = parseInt(cal.find('.secondselect').val(), 10);
            }

            if (this.timePicker12Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                start.second(second);
                this.startDate = start;
                this.leftCalendar.month.hour(hour).minute(minute).second(second);
                if (this.singleDatePicker)
                    this.endDate = start.clone();
            } else {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                end.second(second);
                this.endDate = end;
                if (this.singleDatePicker)
                    this.startDate = end.clone();
                this.rightCalendar.month.hour(hour).minute(minute).second(second);
            }

            this.updateView();
            this.updateCalendars();
        },

        updateCalendars: function () {
            this.leftCalendar.calendar = this.buildCalendar(this.leftCalendar.month.month(), this.leftCalendar.month.year(), this.leftCalendar.month.hour(), this.leftCalendar.month.minute(), this.leftCalendar.month.second(), 'left');
            this.rightCalendar.calendar = this.buildCalendar(this.rightCalendar.month.month(), this.rightCalendar.month.year(), this.rightCalendar.month.hour(), this.rightCalendar.month.minute(), this.rightCalendar.month.second(), 'right');
            this.container.find('.calendar.left').empty().html(this.renderCalendar(this.leftCalendar.calendar, this.startDate, this.minDate, this.maxDate, 'left'));
            this.container.find('.calendar.right').empty().html(this.renderCalendar(this.rightCalendar.calendar, this.endDate, this.singleDatePicker ? this.minDate : this.startDate, this.maxDate, 'right'));

            this.container.find('.ranges li').removeClass('active');
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                } else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                }
                i++;
            }
            if (customRange) {
                this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
                this.showCalendars();
            }
        },

        buildCalendar: function (month, year, hour, minute, second, side) {
            var daysInMonth = moment([year, month]).daysInMonth();
            var firstDay = moment([year, month, 1]);
            var lastDay = moment([year, month, daysInMonth]);
            var lastMonth = moment(firstDay).subtract(1, 'month').month();
            var lastYear = moment(firstDay).subtract(1, 'month').year();

            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            var i;

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            calendar.firstDay = firstDay;
            calendar.lastDay = lastDay;

            for (i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]).utcOffset(this.timeZone);

            var col, row;
            for (i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour);
                curDate.hour(12);

                if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
                    calendar[row][col] = this.minDate.clone();
                }

                if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
                    calendar[row][col] = this.maxDate.clone();
                }

            }

            return calendar;
        },

        renderDropdowns: function (selected, minDate, maxDate) {
            var currentMonth = selected.month();
            var currentYear = selected.year();
            var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var minYear = (minDate && minDate.year()) || (currentYear - 50);

            var monthHtml = '<select class="monthselect">';
            var inMinYear = currentYear == minYear;
            var inMaxYear = currentYear == maxYear;

            for (var m = 0; m < 12; m++) {
                if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        ">" + this.locale.monthNames[m] + "</option>";
                }
            }
            monthHtml += "</select>";

            var yearHtml = '<select class="yearselect">';

            for (var y = minYear; y <= maxYear; y++) {
                yearHtml += '<option value="' + y + '"' +
                    (y === currentYear ? ' selected="selected"' : '') +
                    '>' + y + '</option>';
            }

            yearHtml += '</select>';

            return monthHtml + yearHtml;
        },

        renderCalendar: function (calendar, selected, minDate, maxDate, side) {

            var html = '<div class="calendar-date">';
            html += '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers)
                html += '<th></th>';

            if (!minDate || minDate.isBefore(calendar.firstDay)) {
                html += '<th class="prev available"><i class="fa fa-arrow-left icon icon-arrow-left glyphicon glyphicon-arrow-left"></i></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

            if (this.showDropdowns) {
                dateHtml = this.renderDropdowns(calendar[1][1], minDate, maxDate);
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if (!maxDate || maxDate.isAfter(calendar.lastDay)) {
                html += '<th class="next available"><i class="fa fa-arrow-right icon icon-arrow-right glyphicon glyphicon-arrow-right"></i></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';

                for (var col = 0; col < 7; col++) {
                    var cname = 'available ';
                    cname += (calendar[row][col].month() == calendar[1][1].month()) ? '' : 'off';

                    if ((minDate && calendar[row][col].isBefore(minDate, 'day')) || (maxDate && calendar[row][col].isAfter(maxDate, 'day'))) {
                        cname = ' off disabled ';
                    } else if (calendar[row][col].format('YYYY-MM-DD') == selected.format('YYYY-MM-DD')) {
                        cname += ' active ';
                        if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) {
                            cname += ' start-date ';
                        }
                        if (calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) {
                            cname += ' end-date ';
                        }
                    } else if (calendar[row][col] >= this.startDate && calendar[row][col] <= this.endDate) {
                        cname += ' in-range ';
                        if (calendar[row][col].isSame(this.startDate)) { cname += ' start-date '; }
                        if (calendar[row][col].isSame(this.endDate)) { cname += ' end-date '; }
                    }

                    var title = 'r' + row + 'c' + col;
                    html += '<td class="' + cname.replace(/\s+/g, ' ').replace(/^\s?(.*?)\s?$/, '$1') + '" data-title="' + title + '">' + calendar[row][col].date() + '</td>';
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';
            html += '</div>';

            var i;
            if (this.timePicker) {

                html += '<div class="calendar-time">';
                html += '<select class="hourselect">';

                // Disallow selections before the minDate or after the maxDate
                var min_hour = 0;
                var max_hour = 23;

                if (minDate && (side == 'left' || this.singleDatePicker) && selected.format('YYYY-MM-DD') == minDate.format('YYYY-MM-DD')) {
                    min_hour = minDate.hour();
                    if (selected.hour() < min_hour)
                        selected.hour(min_hour);
                    if (this.timePicker12Hour && min_hour >= 12 && selected.hour() >= 12)
                        min_hour -= 12;
                    if (this.timePicker12Hour && min_hour == 12)
                        min_hour = 1;
                }

                if (maxDate && (side == 'right' || this.singleDatePicker) && selected.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD')) {
                    max_hour = maxDate.hour();
                    if (selected.hour() > max_hour)
                        selected.hour(max_hour);
                    if (this.timePicker12Hour && max_hour >= 12 && selected.hour() >= 12)
                        max_hour -= 12;
                }

                var start = 0;
                var end = 23;
                var selected_hour = selected.hour();
                if (this.timePicker12Hour) {
                    start = 1;
                    end = 12;
                    if (selected_hour >= 12)
                        selected_hour -= 12;
                    if (selected_hour === 0)
                        selected_hour = 12;
                }

                for (i = start; i <= end; i++) {

                    if (i == selected_hour) {
                        html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                    } else if (i < min_hour || i > max_hour) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + i + '</option>';
                    }
                }

                html += '</select> : ';

                html += '<select class="minuteselect">';

                // Disallow selections before the minDate or after the maxDate
                var min_minute = 0;
                var max_minute = 59;

                if (minDate && (side == 'left' || this.singleDatePicker) && selected.format('YYYY-MM-DD h A') == minDate.format('YYYY-MM-DD h A')) {
                    min_minute = minDate.minute();
                    if (selected.minute() < min_minute)
                        selected.minute(min_minute);
                }

                if (maxDate && (side == 'right' || this.singleDatePicker) && selected.format('YYYY-MM-DD h A') == maxDate.format('YYYY-MM-DD h A')) {
                    max_minute = maxDate.minute();
                    if (selected.minute() > max_minute)
                        selected.minute(max_minute);
                }

                for (i = 0; i < 60; i += this.timePickerIncrement) {
                    var num = i;
                    if (num < 10)
                        num = '0' + num;
                    if (i == selected.minute()) {
                        html += '<option value="' + i + '" selected="selected">' + num + '</option>';
                    } else if (i < min_minute || i > max_minute) {
                        html += '<option value="' + i + '" disabled="disabled" class="disabled">' + num + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + num + '</option>';
                    }
                }

                html += '</select> ';

                if (this.timePickerSeconds) {
                    html += ': <select class="secondselect">';

                    for (i = 0; i < 60; i += this.timePickerIncrement) {
                        var num = i;
                        if (num < 10)
                            num = '0' + num;
                        if (i == selected.second()) {
                            html += '<option value="' + i + '" selected="selected">' + num + '</option>';
                        } else {
                            html += '<option value="' + i + '">' + num + '</option>';
                        }
                    }

                    html += '</select>';
                }

                if (this.timePicker12Hour) {
                    html += '<select class="ampmselect">';

                    // Disallow selection before the minDate or after the maxDate
                    var am_html = '';
                    var pm_html = '';

                    if (minDate && (side == 'left' || this.singleDatePicker) && selected.format('YYYY-MM-DD') == minDate.format('YYYY-MM-DD') && minDate.hour() >= 12) {
                        am_html = ' disabled="disabled" class="disabled"';
                    }

                    if (maxDate && (side == 'right' || this.singleDatePicker) && selected.format('YYYY-MM-DD') == maxDate.format('YYYY-MM-DD') && maxDate.hour() < 12) {
                        pm_html = ' disabled="disabled" class="disabled"';
                    }

                    if (selected.hour() >= 12) {
                        html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
                    } else {
                        html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
                    }
                    html += '</select>';
                }

                html += '</div>';

            }

            return html;

        },

        remove: function() {

            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData('daterangepicker');

        }

    };

    $.fn.daterangepicker = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, options, cb));
        });
        return this;
    };

}));







$( document ).ready(function() {
 
	$( "form#new_event_form" ).validate({
	  rules: {
	    'event[event_date]': {
	      date: true
	    },
	    'end_date': {
	      date: true
	    }
	  }
	});
	
	// Add events - calendar
	$('#data_1 .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
    $('.clockpicker').clockpicker();
    
	$('#data_5 .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
});  

 
