$(function(){
  getUrlOnLoad();
  
	var change = {
		"usd-vef": null,
		"btc-usd": null
	}

	$('#btn-update').on('click', function(){
		updateChange()
		return false;
	})

	$('#btn-calc').on('click', function(){
		updateData()
		return false;
	})

	$('#data-input').on('keyup', function(){
		updateData()
	})

	$('#data-type').on('change', function(){
		updateData()
	}).material_select();

	function updateChange(){
		loader(true)
		$.getJSON( "https://s3.amazonaws.com/dolartoday/data.json", function( data ) {
			change['usd-vef'] = data["USD"]["promedio"];
			$.getJSON( "https://blockchain.info/es/ticker", function( data ) {
				change['btc-usd'] = data["USD"]["last"];
				$(".change-usd-vef").text(change['usd-vef']);
				$(".change-btc-usd").text(change['btc-usd']);
				loader(false)
				updateData()			
			})
		})
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
				$('.rs-usd').html( (rule3(data_input, change['btc-usd'])).toFixed(2) );
				$('.rs-vef').html( (rule3(data_input, change['btc-usd']) * change['usd-vef']).toFixed(2) );
				break;
			case 'usd':
				$('.rs-btc').html( ((data_input * 1) / change['btc-usd']).toFixed(8) );
				$('.rs-usd').html( parseFloat(data_input).toFixed(2) );
				$('.rs-vef').html( (rule3(data_input, 1) * change['usd-vef']).toFixed(2) );
				break;
			case 'vef':
				$('.rs-btc').html( ((((data_input * 1 )/ change['usd-vef'])*1)/change['btc-usd']).toFixed(8) );
				$('.rs-usd').html( ((data_input * 1 )/ change['usd-vef']).toFixed(2) );
				$('.rs-vef').html( parseFloat(data_input).toFixed(2) );
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
    }else if(vef = getQueryVariable('vef')){
      $('#data-input').val(vef);
      $('#data-type').val('vef');
    }
  }

	updateChange();

	setInterval(function(){ updateChange() }, 36000000);
});


