(function($){
  
  $.jsonPrice = function(options){
    var $jsonPrice = $(this);
    var price1=0;
    var updated=false;
    
    var settings = $.extend({
      url: null,
      jsonValue: null,
      coinFrom: 'BTC',
      coinTo: 'USD',
      actionUpdate: function(price){},
    }, options );
    
    $jsonPrice.update = function(){
      $.ajax({
        url: settings.url,
        type: 'GET',
        //async: false,
        cache: false,
        timeout: 30000,
        error: function(){
          return true;
        },
        success: function(data){
          updated=true;
          price1 = getJsonValue(data);;
          settings.actionUpdate(price1);
        }
      });
    }
    
    $jsonPrice.getPrice = function(){
      if(!updated){
        $jsonPrice.update();
      }
      return price1;
    };
    
    function getJsonValue(data){
      var res = settings.jsonValue.split('.');
      var value = data;
      res.forEach(function(current){
        value = value[current];
      });
      return value;
    }
    
    return $jsonPrice;
  }
})(window.jQuery);