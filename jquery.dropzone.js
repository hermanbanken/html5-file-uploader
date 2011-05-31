/*
 * jQuery DropZone Plugin 1.0.0 alfa
 * Requires jQuery 1.4.2
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

(function($) {
	$.fn.DropZone = function(options) {
		methods = {
			blockDocumentDrop: function(){
				$(document)
				    .bind('dragenter', function(e) {return false;})
				    .bind('dragleave', function(e) {return false;})
				    .bind('dragover', function(e) {
				        var dt = e.originalEvent.dataTransfer;
				        if (!dt) { return; }
				        dt.dropEffect = 'none';
				        return false;
				    }.bind(this));
				
				},
			
			hideHighlight: function() {
				$(this).removeClass(this.dropOptions.class_mouseover);
				return;
				},
			_leave:function(e) {
				return this.dropMethods.hideHighlight.apply(this);
				},
			_over: function(e) {
				var dt = e.originalEvent.dataTransfer;
				if(!dt) return;
				//FF
				if(dt.types.contains&&!dt.types.contains("Files")) return;
				//Chrome
				if(dt.types.indexOf&&dt.types.indexOf("Files")==-1) return;
				
				// Add nice copy-icon for cursor
				if($.browser.webkit) dt.dropEffect = 'copy';
				
				$(this).addClass(this.dropOptions.class_mouseover);	
		
				return false;
				},
			_drop:function(e) {
				var dt = e.originalEvent.dataTransfer;
				if(!dt&&!dt.files) return;
				
				this.dropMethods.hideHighlight.apply(this);
				
				var files = dt.files;
				for (var i = 0; i < files.length; i++) {
					var file = files[i];
					this.dropOptions.onDropFile(file);
				}
				return false;
				},
			
			_enter: function(e){},
			
			};
		
		// Defaults
		options = $.extend({
			class_mouseover: "dropzone_hover",
			onDropFile: function(file){},
	     	}, options);
		
		// Generate template
		$.template(options.guid, options.template);
		
		// Initialization
		$(this).each(function() {
		    /* Plugin Code Here */
			this.dropOptions = options;
			this.dropMethods = methods;
			
			$(this).bind("dragover", methods._over.bind(this));
			$(this).bind("dragenter", methods._enter.bind(this));
			$(this).bind("dragleave", methods._leave.bind(this));
			$(this).bind("drop", methods._drop.bind(this));
			
			methods.blockDocumentDrop();
			});
 	}
 })(jQuery);