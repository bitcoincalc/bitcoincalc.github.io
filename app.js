$(function(){
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

	$('.data-type, .data-input').on('change', function(){
		updateData()
	});

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
		}else{
			$('.progress').hide();
		}
	}

	function updateData(){
		var data_input = $('.data-input').val();
		var data_type = $('.data-type').val();

		switch(data_type){
			case 'BTC':
				$('.rs-btc').html( parseFloat(data_input).toFixed(8) );
				$('.rs-usd').html( (rule3(data_input, change['btc-usd'])).toFixed(2) );
				$('.rs-vef').html( (rule3(data_input, change['btc-usd']) * change['usd-vef']).toFixed(2) );
				break;
			case 'USD':
				$('.rs-btc').html( ((data_input * 1) / change['btc-usd']).toFixed(8) );
				$('.rs-usd').html( parseFloat(data_input).toFixed(2) );
				$('.rs-vef').html( (rule3(data_input, 1) * change['usd-vef']).toFixed(2) );
				break;
			case 'VEF':
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

	function getQueryVariable(variable){
		     var query = window.location.search.substring(1);
		     var vars = query.split("&");
		     for (var i=0;i<vars.length;i++) {
		             var pair = vars[i].split("=");
		             if(pair[0] == variable){return pair[1];}
		     }
		     return(false);
	}

	updateChange()

	setInterval(function(){ updateChange() }, 36000000);
});
		


