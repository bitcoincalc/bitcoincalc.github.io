$(function(){
  getUrlOnLoad();

	var change = {
		"usd-ves-dt": null,
		"btc-usd-cmc": null,
    "btc-ves-lbtc": null,
    "usd-ves-lbtc": null,
	}

	$('#btn-update').on('click', function(){
		updateChange()
		return false;
	})

	$('#btn-calc').on('click', function(){
		updateData()
		return false;
	})

	$('#data-input')
    .on('keyup', function(){
  		updateData()
      updateUrl($('#data-type').val(), $(this).val())
  	})

	$('#data-type').on('change', function(){
		updateData()
    updateUrl($(this).val(), $('#data-input').val())
	}).material_select();

  function updateUrl(data_type, data_input){
    history.pushState(null, "", "?"+data_type+"="+data_input);
  }

  function updateChange(){
    loader(true)

    var p_dt = $.getJSON( "https://s3.amazonaws.com/dolartoday/data.json")
      .then(function(data){
        change['usd-ves-dt'] = data["USD"]["dolartoday"]
        $(".change-usd-ves-dt").text(change['usd-ves-dt'])
      })

    var p_cmc = $.getJSON( "https://api.coinmarketcap.com/v1/ticker/bitcoin/")
      .then(function(data){
        change['btc-usd-cmc'] = data[0]["price_usd"]
        $(".change-btc-usd-cmc").text(parseFloat(change['btc-usd-cmc']).toFixed(2))
      })

    var p_lbtc = $.getJSON( "https://cors-anywhere.herokuapp.com/https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/")
      .then(function(data){
        let v = data["VES"]

        if (typeof v["avg_1h"] !== 'undefined') {
          change['btc-ves-lbtc'] = v["avg_1h"]
        }else if (typeof v["avg_6h"] !== 'undefined') {
          change['btc-ves-lbtc'] = v["avg_6h"]
        }else if (typeof v["avg_12h"] !== 'undefined') {
          change['btc-ves-lbtc'] = v["avg_12h"]
        }else if (typeof v["avg_24h"] !== 'undefined') {
          change['btc-ves-lbtc'] = v["avg_24h"]
        }

        $(".change-btc-ves-lbtc").text(change['btc-ves-lbtc'])
      })

    $.when(p_lbtc, p_cmc).then(function(){
      change['usd-ves-lbtc'] = change['btc-ves-lbtc']/change['btc-usd-cmc']
      $(".change-usd-ves-lbtc").text(parseFloat(change['usd-ves-lbtc']).toFixed(2))
    })

    $.when(p_lbtc, p_cmc, p_dt).then(function(){
      loader(false)
      updateData()
    })

    /*$.getJSON( "https://s3.amazonaws.com/dolartoday/data.json", function( data ) {
      change['usd-ves-dt'] = data["USD"]["dolartoday"];
      $(".change-usd-ves-dt").text(change['usd-ves-dt']);
      loader(false)
      updateData()
    })
    $.getJSON( "https://api.coinmarketcap.com/v1/ticker/bitcoin/", function( data ) {
      change['btc-usd-cmc'] = data[0]["price_usd"];
      $(".change-btc-usd-cmc").text(parseFloat(change['btc-usd-cmc']).toFixed(2));
      loader(false)
      updateData()
    })
    $.getJSON( "https://cors-anywhere.herokuapp.com/https://localbitcoins.com/bitcoinaverage/ticker-all-currencies/", function( data ) {
      change['btc-ves-lbtc'] = data["VES"]["avg_1h"];
      change['usd-ves-lbtc'] = change['btc-ves-lbtc']/change['btc-usd-cmc'];
      $(".change-usd-ves-lbtc").text(parseFloat(change['usd-ves-lbtc']).toFixed(2));
      $(".change-btc-ves-lbtc").text(change['btc-ves-lbtc']);
      loader(false)
      updateData()
    })*/


  }

	function loader(on){
		if(on){
			$('.progress').show();
      $('#btn-update .fa').addClass('fa-spin');

		}else{
			$('.progress').hide();
      $('#btn-update .fa').removeClass('fa-spin');
		}
	}

	function updateData(){
		var data_input = $('#data-input').val();
		var data_type = $('#data-type').val();

		switch(data_type){
			case 'btc':
				$('.rs-btc').html( parseFloat(data_input).toFixed(8) );
				$('.rs-usd').html( (rule3(data_input, change['btc-usd-cmc'])).toFixed(2) );
				$('.rs-ves').html( (rule3(data_input, change['btc-ves-lbtc'])).toFixed(2) );
				break;
			case 'usd':
        $('.rs-usd').html( parseFloat(data_input).toFixed(2) );
        $('.rs-btc').html( ((data_input * 1) / change['btc-usd-cmc']).toFixed(8) );
				$('.rs-ves').html( (rule3(data_input, 1) * change['usd-ves-dt']).toFixed(2) );
				break;
			case 'ves':
				$('.rs-btc').html( ((data_input * 1 )/ change['btc-ves-lbtc']).toFixed(8) );
				$('.rs-usd').html( ((data_input * 1 )/ change['usd-ves-dt']).toFixed(2) );
				$('.rs-ves').html( parseFloat(data_input).toFixed(2) );
				break;
		}
	}

	function rule3(input, change){
		x = (input * change) / 1;
		return x;
	}

	function getQueryVariable(name){
		     var query = window.location.search.substring(1);
		     var vars = query.split("&");
		     for (var i=0;i<vars.length;i++) {
		             var pair = vars[i].split("=");
		             if(pair[0] == name){return pair[1];}
		     }
		     return(false);
	}

  function getUrlOnLoad(){
    if(btc = getQueryVariable('btc')){
      $('#data-input').val(btc);
      $('#data-type').val('btc');
    }else if(usd = getQueryVariable('usd')){
      $('#data-input').val(usd);
      $('#data-type').val('usd');
    }else if(ves = getQueryVariable('ves')){
      $('#data-input').val(ves);
      $('#data-type').val('ves');
    }
  }

	updateChange();

	setInterval(function(){ updateChange() }, 300000);
});
