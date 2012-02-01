onmessage = function (m) {

		longpoller();
};



function longpoller() {


	var response;

	getwork = '{"params": [], "method": "getwork", "id": "1"}';

	$.ajax({ url: 'http://kradminer.com/mp/longpoll',  dataType: 'json', type: "POST", data: getwork, username: worker_name, password: worker_pass, success: function(response) {

	//$.ajax({ url: 'http://192.168.1.8/bitcoind/',  dataType: 'json', type: "POST", data: getwork, username: "REPLACEME", password: "REPLACEME", success: function(response) {
		//alert(response);
		//response = $.parseJSON(response);
		

		if ((response != null) && (response.result != null) && (response.result == true)) {
			//shares_found = shares_found + 1;
			//$('#shares').val(shares_found);
			//earnings(shares_found);
			//showearnings();
			
			//debugprint("Share Found. Total: " + shares_found);
		} else {
			//stale_shares_found = stale_shares_found + 1;
			//debugprint("Stale / Invalid Share.. Total Stale: " + stale_shares_found);

			postMessage(response);

		}
		
	}});



}
