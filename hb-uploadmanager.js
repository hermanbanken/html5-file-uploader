/*
 * HTML5 File Upload Manager
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

var FileUploadManager = function(){
	var manager = {
		_queue: [],
		_uploading: false,
	};
	
	manager.queue = function(uploader){
		this._queue.push(uploader);
		uploader.addListener('progress', this.handleProgress);
		uploader.addListener('complete', this.handleComplete);
		uploader.addListener('error', this.handleComplete);
		this.start();
	}.bind(manager);
	
	manager.start = function(){
		if(!this._uploading && this._queue.length > 0){
			this._uploading = true;
			this._current = this._queue.shift();
			this._current.upload(false);
		}
	}.bind(manager);
	
	manager.handleComplete = function(e){
		this._uploading = false;
		this.start();
	}.bind(manager);
	
	manager.handleProgress = function(e){
	}.bind(manager);
	
	return manager;
};
