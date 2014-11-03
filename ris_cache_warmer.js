(function ($) {

  RisCacheWarmerStatus = function() {

    this.numItems = -1;
    this.processedItems = 0;
    this.progressVisible = false;
    this.progressElem = null;

    this.url = Drupal.settings.basePath + 'admin/content/handle-ris-cache';
    this.checkStatus();

  };


  RisCacheWarmerStatus.prototype.checkStatus = function() {
    $.ajax(this.url).done(function (result) { this.handleAjax(result);}.bind(this));
  };

  RisCacheWarmerStatus.prototype.handleAjax = function(result) {

    if (result.remaining > 0) {
      this.setProgress(result.remaining);
      this.checkStatus();
    }
  };

  RisCacheWarmerStatus.prototype.setProgress = function(remaining) {
    if (this.numItems < 0) {
      this.numItems = remaining;
    }
    this.processedItems = this.numItems - remaining;

    if(!this.progressVisible) {
      this.progressElem = $('<div id="ris-progress-bar"><span style="background-color: #f00; display: block; width: 0%; height: 100%; position: absolute; left: 0; top: 0;"></span></div>');
      this.progressElem.css({ position: 'fixed', width: '100%', height: '2px', left: 0, bottom: 0 });
      $('body').append(this.progressElem);
      this.progressVisible = true;
    }
    var percent = this.processedItems / this.numItems * 100.0;
    this.progressElem.find('span').css('width', percent + "%");

  };

  Drupal.behaviors.risCacheWarmerStatus = {

    attach: function (context, settings) {

      $('body:not(.ris-cache-warmer-status-attached)', context).addClass('ris-cache-warmer-status-attached').each(function(ndx, elem) {
        $(this).data('ris-cache-warmer-status', new RisCacheWarmerStatus());
      }.bind(this));
    }
  };

})(jQuery);
