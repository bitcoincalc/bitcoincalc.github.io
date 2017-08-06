			var change = {
				"usd-vef": null,
				"btc-usd": null
			}

			$('#btn-update').on('click', function(){
				updateChange()
				updateData()
			})

			$('#btn-calc').on('click', function(){
				updateData()
			})


			function updateChange(){
				loader()
				$.getJSON( "https://s3.amazonaws.com/dolartoday/data.json", function( data ) {
					//alert(data["USD"]["promedio"])
					change['usd-vef'] = data["USD"]["promedio"];
					$.getJSON( "https://blockchain.info/es/ticker", function( data ) {
						change['btc-usd'] = data["USD"]["last"];

						$(".change-usd-vef").text(change['usd-vef']);
						$(".change-btc-usd").text(change['btc-usd']);
					})
				})
			}

			function loader(){
				$('.change').html('<i class="fa fa-spin fa-refresh"></i>');
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

	updateChange()
