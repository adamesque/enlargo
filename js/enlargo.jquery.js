// Plugin skeleton c.f. http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ($, window, document, undefined) {
	var pluginName = 'enlargo',
		defaults = {
			duration: 200
		},
		overlay = $('<div class="enlargo-overlay"></div>')
			.appendTo(document.body);

	function Enlargo( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Enlargo.prototype.init = function () {
		var data;

		this.el = $(this.element);
		data = this.el.data();

		this.width = this.el.width();
		this.height = this.el.height();
		this.offset = this.el.offset();

		this.fullSrc = data["fullSrc"];
		this.fullWidth = data["fullWidth"];
		this.fullHeight = data["fullHeight"];

		this.loaded = false;

		if (!this.fullSrc) {
			return false;
		}

		this.fullImg = $("<img />", {
			css: {
				left: this.offset.left,
				height: this.height,
				top: this.offset.top,
				width: this.width
			},
			load: $.proxy(function () {
				this.loaded = true;
			}, this),
			src: this.fullSrc
		}).appendTo(overlay);

		this.el.on("click mouseenter", $.proxy(this.expand, this));
		this.fullImg.on("mouseleave", $.proxy(this.contract, this));
	};

	Enlargo.prototype.expand = function () {
		overlay.show();
		this.fullImg.show().animate({
			height: this.height * 3,
			width: this.width * 3
		}, this.options.duration);
	};

	Enlargo.prototype.contract = function () {
		this.fullImg.animate({
			height: this.height,
			width: this.width
		}, this.options.duration, function () {
			$(this).hide();
			overlay.hide();
		});
	}

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName,
					  new Enlargo( this, options ));
			}
		});
	}
}(jQuery, window, document));
