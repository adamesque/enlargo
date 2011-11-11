// Plugin skeleton c.f. http://coding.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
;(function ($, window, document, undefined) {
	var pluginName = 'enlargo',
		defaults = {
			duration: 200,
			margin: 20
		};

	function Enlargo( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Enlargo.prototype.init = function () {
		var $this = this,
			data;

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

		this.fullContainer = $('<div class="enlargo-container"/>')
			.css({
				height: this.height,
				width: this.width
			})
			.appendTo(document.body);

		this.fullImg = $("<img />", {
			load: $.proxy(function () {
				this.loaded = true;
			}, this),
			src: this.fullSrc
		}).appendTo(this.fullContainer);

		this.el.on("click mouseenter", function () {
			window.clearTimeout($this.enlargoTimer);
			$this.enlargoTimer = window.setTimeout($.proxy($this.expand, $this), $this.options.duration);
		});
		this.el.on("mouseleave", function () {
			window.clearTimeout($this.enlargoTimer);
		});
		this.fullContainer.on("mouseleave", $.proxy(this.contract, this));
	};

	Enlargo.prototype.expand = function () {
		var m = this.options.margin,
			left,
			top,
			width,
			height;

		this.offset = this.el.offset();
		this.fullContainer.css({
			left: this.offset.left,
			top: this.offset.top
		});

		left = this.offset.left - (this.fullWidth - this.width) / 2;
		if (left + this.fullWidth > $(window).width() - m) {
			left -= (left + this.fullWidth) - ($(window).width() - m);
		}
		top = this.offset.top - (this.fullHeight - this.height) / 2;

		this.fullContainer.show().animate({
			height: this.fullHeight || this.height * 3,
			left: left > m ? left : m,
			top: top > m ? top : m,
			width: this.fullWidth || this.width * 3
		}, this.options.duration);
	};

	Enlargo.prototype.contract = function () {
		this.fullContainer.animate({
			height: this.height,
			left: this.offset.left,
			top: this.offset.top,
			width: this.width
		}, this.options.duration, function () {
			$(this).hide();
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
