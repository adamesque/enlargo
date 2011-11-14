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

		this.el = $(this.element).addClass("enlargo");
		this.img = this.el.find("img");

		data = this.el.data();

		this.width = this.img.width();
		this.height = this.img.height();
		this.offset = this.img.offset();

		this.fullSrc = this.el.attr("href");
		this.fullWidth = data["width"];
		this.fullHeight = data["height"];

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

		this.el.on("click mouseenter", function (e) {
			e.preventDefault();
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
			height,
			$window = $(window),
			$windowScrollTop = $window.scrollTop(),
			$windowScrollLeft = $window.scrollLeft(),
			$windowHeight = $window.height(),
			$windowWidth = $window.width(),
			maxHeight = $windowHeight - 2*m,
			maxWidth = $windowWidth - 2*m,
			imageRatio = this.width / this.height,
			screenRatio = maxWidth / maxHeight;

		this.offset = this.img.offset();
		this.fullContainer.css({
			left: this.offset.left,
			top: this.offset.top
		});

		if (this.fullWidth > maxWidth || this.fullHeight > maxHeight) {
			if (screenRatio > imageRatio) {
				height = maxHeight;
				width = this.fullWidth * (maxHeight/this.fullHeight);
			} else {
				height = this.fullHeight * (maxWidth/this.fullWidth);
				width = maxWidth;
			}
		} else {
			width = this.fullWidth;
			height = this.fullHeight;
		}

		left = this.offset.left - (width - this.width) / 2;
		// If we're hanging off the right edge, scootch left.
		if (left + width > $windowScrollLeft + $windowWidth - m) {
			left -= (left + width) - ($windowScrollLeft + $windowWidth - m);
		} else if (left < $windowScrollLeft) {
			left = $windowScrollLeft + m;
		}

		top = this.offset.top - (height - this.height) / 2;
		// if we're hanging off the bottom edge, scootch up.
		if (top + height > $windowScrollTop + $windowHeight - m) {
			top -= (top + height) - ($windowScrollTop + $windowHeight - m);
		} else if (top < $windowScrollTop) {
			top = $windowScrollTop + m;
		}

		this.img.css("visibility", "hidden");
		this.fullContainer.show().animate({
			height: height || this.height * 3,
			left: left > m ? left : m,
			top: top > m ? top : m,
			width: width || this.width * 3
		}, this.options.duration);
	};

	Enlargo.prototype.contract = function () {
		var $this = this;
		this.fullContainer.animate({
			height: this.height,
			left: this.offset.left,
			top: this.offset.top,
			width: this.width
		}, this.options.duration, function () {
			$this.img.css("visibility", "visible");
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
