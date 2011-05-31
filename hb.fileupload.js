/*
 * HTML5 File Uploader
 *
 * Author: Herman Banken
 * Blog: http://hermanbanken.nl
 *
 * Url: https://github.com/hermanbanken/html5-file-uploader
 *
 * Please don't steal this code. 
 * Please keep this header intact.
 *
 * Copyright Creative Commons Licence
 * Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0).
 * http://creativecommons.org/licenses/by-sa/3.0/
 */

function FileUploader(){
	
	// Private variables and methods
	
	var uploader = {
	 	
	 	defaults: {
	 		address: '',
	 		vars: {},
	 	},
	 	
	 	// Store progress of upload
	 	progress: [],
	 	listeners: {},
	 	filters: {},
	
	 	_applyFilters: function(key, data){
	 		if(this.filters[key])
		 		for(var i = this.filters[key].length; i--;){
		 			data = this.filters[key][i](data);
		 		}
	 		return data;
	 	},
	 	
	 	_formatQuery: function(){
	 		// Apply filters for query vars
	 		
	 		address = this._applyFilters("Address", this.options.address);
	 		vars = this._applyFilters("QueryVars", this.options.vars);
	 		
	 		var query_string = "";
	 		for(key in vars)
	 			query_string += (query_string ? "&" : "?") + escape(key) + "=" + escape(vars[key]);
	 		return address + query_string;
	 	},
	 	
	 	_informListeners: function(eventname, event){
	 		if(this.listeners[eventname])
	 			for(var i = this.listeners[eventname].length; i--;){
	 				result = this.listeners[eventname][i](event);
	 				if(result === false) break;
	 			}
	 	},
	 	
	 	_progress: function(e, file){
	 		var p = {
	 			time: e.timeStamp, 
	 			send: (e.loaded || e.position),
	 			done: (e.loaded || e.position) / (e.total || e.totalSize),
	 		};
	 		
	 		if( this.progress.length > 0 ) {
	 			var last = this.progress[this.progress.length-1];
		 		var diff = {
		 			time: (p.time - last.time)/1000,
		 			send: p.send - last.send,
		 			done: p.send / (e.total || e.totalSize) - last.done,
		 		};
		 		p.speed = diff.send / diff.time;
		 		p.diff = diff;
	 		}
	 		
	 		this.progress.push(p);
	 		this._informListeners('progress', p); 		
	 	},
	 	_complete: function(e, file){
	 		if(e.target && e.target.status == 200){
	 			var last = this.progress[this.progress.length-1];
	 			this._informListeners('complete', {
	 				info: last ? {
	 					time: last.time - this.progress[0].time,
	 					speed: (e.total || e.totalSize) / (last.time - this.progress[0].time) * 1000,
	 				} : { time: 0, speed: 0 },
	 				xhrEvent: e,
	 				result: e.target.responseText,
	 			});
	 		}else this._error(e, file);
	 	},
	 	_error: function(e, file){
	 		var error = {
	 			xhrEvent: e,
	 		};
	 		if(e.target){
	 			if(e.target.status) 
	 				error.status = e.target.status;
		 		if(e.target.responseText)
		 			error.result = e.target.responseText;
		 	}
		 	this._informListeners('error', error);
		},
	};
	
	// Public functions
	
	uploader.init = function(options){
		this.options = this.defaults;
		for(key in options) this.options[key] = options[key];
		
		return this;
	}.bind(uploader);
	
	/*
	 * Add filters. Some filters are:
	 * - QueryVars: the GET vars send to the server
	 * - Address: the server script to upload to
	 *
	 * @param key - which filter
	 * @param func - the filter function
	 * @return FileUploader - for making this function chainable
	 */
	uploader.addFilter = function(key, func){
		if(!this.filters[key]) this.filters[key] = [];
		this.filters[key].push(func);
		return this;
	}.bind(uploader);
	
	/*
	 * Add listeners. Events are:
	 * - progress: the file was uploaded further
	 * - complete: the file is completely uploaded
	 * - error: an error occured while uploading
	 *
	 * @param event - which event to listen for
	 * @param func - the callback function
	 * @return FileUploader - for making this function chainable
	 */
	uploader.addListener = function(eventname, func){
		if(!this.listeners[eventname]) this.listeners[eventname] = [];
		this.listeners[eventname].push(func);
		return this;
	}.bind(uploader);
	
	uploader.pause = function(file){
		this.file = file;
		this._informListeners('waiting', {});
		return this;
	}.bind(uploader);
	
	uploader.upload = function(file){
		// If we previously paused the upload: restore
		if(!file && this.file) file = this.file;
		// No file specified? Cancel
		if(!file) return false;
		
		var xhr = new XMLHttpRequest();
		
		this.options.vars.file = file.fileName;
		
		// Add eventhandlers
		xhr.upload.addEventListener("progress", function(e){this._progress(e, file)}.bind(this), false);
		xhr.onload = (function(e){this._complete(e, file)}).bind(this);
		xhr.onerror = (function(e){this._error(e, file)}).bind(this);
		
		// Send file for upload
		xhr.open('POST', this._formatQuery(), true);
		xhr.send(file);
		
		return this;
	}.bind(uploader);
	 
	return uploader;
};
 