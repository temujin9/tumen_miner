// Copyright 2011 T9 Productions
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

	var worker_name = "worker1";
	var worker_pass = "REPLACEME";
	var miner_status = "Not Operational";
	var miner_error = "";
    var utils;
	var hashed_total = 0;
    var cmdQueue;
    var cycles_per = 1;
    var cycle_check_time = 10;
    var cycle_wait_time = 1;
	var hashed = 0;
	var run_time = 0;
	var last_time;
    var dataObject1; 
	var d;
    var bufout;
	var globalThreads;
    var kernelSrc;
    var program;
    var devices;
    var global_worksize;
    var worksize;
    var global_worksize_arr = new Array();
    var worksize_arr = new Array();
    var device_names = new Array();
    var event;
    var eventk;
    var event;
    var events = new Array();
	var noncesleft;
	var output;
	var lastRated;
	var hashspace = 4294967295;
	var status;
	var response;
	var job = {};
	var gotwork = false;
	var need_new_work = false;
	var worker_started = false;
	var longpoller_started = false;
	var worker;
	var first_run = true;
	var shares_found = 0;
	var bufsize;
	var shareindex;
	var outbuffer8;
	var outBuffer;
	var outbuffab;
	var threads_run = 0;
	var threads_run_pace = 0;
	var last_rated_pace = ((new Date().getTime()) / 1000);
	//var last_hashrate_update = new Date().getTime();
	var rate_divisor = 1000;

	var frames_num = 30;
	var frames = Math.max(parseInt(frames_num, 10), 3);
	var frame = 1.0 / frames;
	var last_rated = last_rated_pace;
	var work_unit;
	var last_hashrate = 0;
	var rate = 0;
	var work_start_time;
	var stale_shares_found = 0;
	var global_worksize_peak = 0;
	function loadKernel(id){
		var kernelElement = document.getElementById(id);
		var kernelSource = kernelElement.text;
		
		return kernelSource;
	}


function minerstatus(status) {

		$('#miner_status').html(status);
		
}

function minererror(error) {

		$('#miner_error').html("Solution: " + error);
		
}

function showearnings() {

											//000103476
			earnings = (shares_found / 2) * 0.000070;
			$('#earnings').html(earnings + " BTC");
			
}

function earnings_add(amount) {

			shares_found = shares_found + (amount * 2);

			earnings = (shares_found / 2) * 0.000070;
			$('#earnings').html(earnings + " BTC");
			
}

function hashrate(hashes) {
	//	$('#info1').val("wtf");

	//var current_time = new Date().getTime();

	//if (last_hashrate_update < current_time - 1000) {

		//actual_time_since_update = current_time - last_hashrate_update;
		
		//hashes = (hashes / actual_time_since_update) * 1000;
		$('#khashes').html(hashes);
		//$('#hashes').val(hashes * 1000);
		$('#mhashes').html(hashes / 1000);

lastupdated = ((new Date().getTime()) / 1000);
		//$('#info1').val("wtf");
		
		//last_hashrate_update = current_time;

	//}
	//		$('#info1').val("wtf2");
}


function start_mining()
{

	ask_for_work();
	wait_for_work();
	
}

function engage_mining()
{

	job.start_date = new Date().getTime();

	if (worker_started == false) {
		worker_started = true;
		worker = new Worker("worker.js");
		worker.onmessage = receive_worker_message;
		worker.onerror = receive_worker_error;
	}

	worker.postMessage(job);
	
	if (longpoller_started == false) {
		longpoller_started = true;
		longpoller = new Worker("longpoller.js");
		longpoller.onmessage = receive_longpoller_message;
		longpoller.onerror = receive_longpoller_error;
	}

	longpoller.postMessage(job);
}

function receive_longpoller_message(event) {

			need_new_work = true;
			longpoller.postMessage(need_new_work);

}

function receive_longpoller_error(event) {

			need_new_work = true;

}


function receive_worker_message(event) {

	var job = event.data;

	$('#jobs').val(job.total_hashes);
	$('#strang').val(job.strang);
	$('#strang2').val(job.strang2);


	work_start_time = ((new Date().getTime()) / 1000.0);

	if (first_run == true) {
		first_run = false;
		minerstatus("Running");
		CL_mine();
	} else {
		set_kernel_args();
		runcycle();
	}

}

function receive_worker_error(event) {

	throw event.data;

}

function wait_for_work() {

	if(gotwork == true) {
		gotwork = false;
		engage_mining();
	} else {
		setTimeout ( "wait_for_work();", 100 );
	}
}


function ask_for_work()
{

	var response;

	getwork = '{"jsonrpc": "1.0", "id":"json", "method": "getwork", "params": [] }';

	$.ajax({ url: 'http://kradminer.com/mp/',  dataType: 'json', type: "POST", data: getwork, username: worker_name, password: worker_pass, success: function(response) {

	//$.ajax({ url: 'http://192.168.1.8/bitcoind/',  dataType: 'json', type: "POST", data: getwork, username: "REPLACEME", password: "REPLACEME", success: function(response) {
		//alert(response);
		//response = $.parseJSON(response);
		
/*
	var response = "{\"result\":{\"midstate\":\"9a4bc1abf96b4dc7488ca37913874eadd285716ece3ad05275566fe4d1cf651b\",\"data\":\"00000001dcec9c276d850e39ca2eefcaa5023676b26e79ccba15e70c000007a300000000a566108432a8777a8dedd1c85b54a27907a7b922965dbd4637836cd0fcaae37b4dd9dcd91a44b9f200000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000080020000\",\"hash1\":\"000000000000000000000000000000000000\
00000000000000000000000000000000008000000000000000000000000000000000000000000000\
000000010000\",\"target\":\"FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF\
00000000\"},\"error\":null,\"id\":0}";


response = $.parseJSON(response);
*/

		if ((response != null) && (response.result != null)) {

		job = {};

		//alert(response.result.midstate);

		job.midstate = hexstring_to_binary(response.result.midstate);
		
		job.data_hex = response.result.data;
		job.data = hexstring_to_binary_b(response.result.data);
		job.data_arr = new Uint32Array(job.data);
		job.hash1 = hexstring_to_binary(response.result.hash1);
		job.target = hexstring_to_binary(response.result.target);
		gotwork = true;
		
		} else {
		
		ask_for_work();
		
		}
	}});

}


function submit_share(share)
{

	var response;

	getwork = '{"params": ["' + share + '"], "method": "getwork", "id": "1"}';

	$.ajax({ url: 'http://kradminer.com/mp/',  dataType: 'json', type: "POST", data: getwork, username: worker_name, password: worker_pass, success: function(response) {

	//$.ajax({ url: 'http://192.168.1.8/bitcoind/',  dataType: 'json', type: "POST", data: getwork, username: "REPLACEME", password: "REPLACEME", success: function(response) {
		//alert(response);
		//response = $.parseJSON(response);
		

		if ((response != null) && (response.result != null) && (response.result == true)) {
			shares_found = shares_found + 1;
			//$('#shares').val(shares_found);
			//earnings(shares_found);
			showearnings();
			
			debugprint("Share Found. Total: " + shares_found);
		} else {
			stale_shares_found = stale_shares_found + 1;
			debugprint("Stale / Invalid Share.. Total Stale: " + stale_shares_found);
			need_new_work = true;
		}
		
	}});

}


function safe_add (x, y) {
	var lsw = (x & 0xFFFF) + (y & 0xFFFF);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return (msw << 16) | (lsw & 0xFFFF);
}

function hexstring_to_binary(str)
{
	var b = new ArrayBuffer(1024);
 	var result = new Uint32Array(b);
	var resultb = new Uint8Array(b);

	for(var i = 0; i < str.length; i += 8) {
		var number = 0x00000000;

		for(var j = 0; j < 4; ++j) {
			number = safe_add(number, hex_to_byte(str.substring(i + j*2, i + j*2 + 2)) << (j*8));
		}

		result[i/8] = number;
	}

	return result;
}

function hexstring_to_binary_b(str)
{
	var b = new ArrayBuffer(1024);
 	var result = new Uint32Array(b);
	var resultb = new Uint8Array(b);

	for(var i = 0; i < str.length; i += 8) {
		var number = 0x00000000;

		for(var j = 0; j < 4; ++j) {
			number = safe_add(number, hex_to_byte(str.substring(i + j*2, i + j*2 + 2)) << (j*8));
		}

		result[i/8] = number;
	}

	return b;
}


function hex_to_byte(hex)
{
	return( parseInt(hex, 16));
}

function set_kernel_args() {


kernel.setKernelArg (14, 0, WebCL.types.UINT);
    
    
arg = $('#strang').val();

args = arg.split("*");

kernel.setKernelArg (0, parseInt(args[0]), WebCL.types.UINT);
kernel.setKernelArg (1, parseInt(args[1]), WebCL.types.UINT);
kernel.setKernelArg (2, parseInt(args[2]), WebCL.types.UINT);
kernel.setKernelArg (3, parseInt(args[3]), WebCL.types.UINT);
kernel.setKernelArg (4, parseInt(args[4]), WebCL.types.UINT);
kernel.setKernelArg (5, parseInt(args[5]), WebCL.types.UINT);
kernel.setKernelArg (6, parseInt(args[6]), WebCL.types.UINT);
kernel.setKernelArg (7, parseInt(args[7]), WebCL.types.UINT);

kernel.setKernelArg (8, parseInt(args[8]), WebCL.types.UINT);
kernel.setKernelArg (9, parseInt(args[9]), WebCL.types.UINT);
kernel.setKernelArg (10, parseInt(args[10]), WebCL.types.UINT);
kernel.setKernelArg (11, parseInt(args[11]), WebCL.types.UINT);
kernel.setKernelArg (12, parseInt(args[12]), WebCL.types.UINT);
kernel.setKernelArg (13, parseInt(args[13]), WebCL.types.UINT);

kernel.setKernelArg (15, parseInt(args[14]), WebCL.types.UINT);
kernel.setKernelArg (16, parseInt(args[15]), WebCL.types.UINT);
kernel.setKernelArg (17, parseInt(args[16]), WebCL.types.UINT);
kernel.setKernelArg (18, parseInt(args[17]), WebCL.types.UINT);
kernel.setKernelArg (19, parseInt(args[18]), WebCL.types.UINT);
kernel.setKernelArg (20, parseInt(args[19]), WebCL.types.UINT);
kernel.setKernelArg (21, parseInt(args[20]), WebCL.types.UINT);
kernel.setKernelArg (22, parseInt(args[21]), WebCL.types.UINT);

}


function CL_mine () {

	utils = WebCL.getUtils ();
	platforms = WebCL.getPlatformIDs();
	ctx = WebCL.createContextFromType ([WebCL.CL_CONTEXT_PLATFORM, platforms[0]], WebCL.CL_DEVICE_TYPE_DEFAULT);

	bufsize = (257 * 4); // size in bytes
	bufout = ctx.createBuffer (WebCL.CL_MEM_WRITE_ONLY, bufsize);

	kernelSrc = loadKernel("clProgramsearch");
	program = ctx.createProgramWithSource(kernelSrc);
	devices = ctx.getContextInfo(WebCL.CL_CONTEXT_DEVICES);

	try {
      program.buildProgram ([devices[devicenum]], "");
	  device_names.push(devices[devicenum].getDeviceInfo(WebCL.CL_DEVICE_NAME).replace("Cypress", "Radeon"));
	  $('#device_' + devicenum).html(device_names[devicenum]);
    } catch(e) {
      alert ("Failed to build WebCL program. Error "
             + program.getProgramBuildInfo (devices[devicenum], 
                                            WebCL.CL_PROGRAM_BUILD_STATUS)
             + ":  " 
             + program.getProgramBuildInfo (devices[devicenum], 
                                            WebCL.CL_PROGRAM_BUILD_LOG));
      throw e;
    }
    
    
    

    kernel = program.createKernel ("search");

	set_kernel_args();

	kernel.setKernelArg (23, bufout);
    
	cmdQueue = ctx.createCommandQueue (devices[devicenum], 0);

	dataObject1 = WebCL.createDataObject ();
	dataObject1.allocate(bufsize);

	outbuffab = new ArrayBuffer(1028); 

	outBuffer = new Uint32Array(outbuffab);

	outbuffer8 = new Uint8Array(outbuffab);


	d = new Date();
	starttime = d.getTime();
	lastRatedPace = d.getTime();
	lastRated = d.getTime();
	lastNTime = d.getTime();
	base = 0;
	lastHashRate = 0;
	threadsRunPace = 0;
	threadsRun = 0;
	hashspace = 0x7FFFFFFF;
	k = 0;
	lastcycles = 0;		

	worksize = 256;
	cycles = 0;

	work_unit = worksize * 256;
	global_worksize = work_unit * 10;

	//global_worksize = global_worksize * 60;

	worksize_arr = [worksize];
	global_worksize_arr = [global_worksize];
	
	//output = document.getElementById("output");

 		
	run_time = new Date();
	last_time = d.getTime();

	//sayit("Start time");

	noncesleft = hashspace;

	setInterval(check_cycle_status, 10);


	runcycle();
	
}


function runcycle() {


	for (var k = 0; k < cycles_per; k++) {
 
		cycles++;
	
		kernel.setKernelArg (14, base, WebCL.types.UINT);
    
    	// Execute (enqueue) kernel
    	eventk = cmdQueue.enqueueNDRangeKernel(kernel, global_worksize_arr.length, [], [global_worksize], worksize_arr, []);

    	// Read the result buffer from OpenCL device
    	cmdQueue.enqueueReadBuffer (bufout, false, 0, bufsize, dataObject1, []);    



		base = (base + global_worksize);
		noncesleft -= global_worksize;
		threads_run_pace += global_worksize;
		threads_run += global_worksize;

		//cmdQueue.finish ();

	  //if (base > 4000000000) {
		if (base > 4294967295) {
        	base = 0;
			noncesleft = hashspace;
			need_new_work = true;
		}
      


//    	utils.writeDataObjectToTypedArray (dataObject1, outBuffer);

}


	//cmdQueue.finish (); //Finish all the operations
    
    cmdQueue.flush ();
    
	//setTimeout ( "check_cycle_status();", 10 );


}


function check_cycle_status() {

if (eventk != null) {

	status = eventk.getEventInfo(0x11D3);
	status = parseInt(status);

	if (status == 0) {
		//cmdQueue.finish ();
		on_cycle_completed();
	} else {
		//setTimeout ( "check_cycle_status();", cycle_check_time );
	}
	
}

}

function on_cycle_completed() {


	eventk = null;

	var frames_num = 55 - (aggression * 5);
	var frames = Math.max(parseInt(frames_num, 10), 3);
	var frame = 1.0 / frames;



	utils.writeDataObjectToTypedArray (dataObject1, outBuffer);

   	found = false;
   	
   	
   	if (outBuffer[256] != 0) {
   
    for (var i = 0; i < 256; i++) {

		if (outBuffer[i] != 0) {
			//found = true;
			sharenum = outBuffer[i];
			shareindex = (i * 4);

      
     
	//if (found == true) {
      	//output.innerHTML = "<br>found = "

		//joby = new Uint8Array(job.data,64,4)
		d = job.data_hex.slice(0);
				
		//sayit(sharenum);
		//sayit(shareindex);
		//sayit(decimalToHexString(sharenum));
		joby2 = new Uint8Array(outbuffab,shareindex,4);
		//sayit(bytesToHex_rev3(joby2));
		
		d = d.slice(0,152) + bytesToHex(joby2) + d.slice(160);



		//d2 = d.slice(0,136) + bytesToHex_rev2(joby) +  d.slice(144,152) + bytesToHex_rev3(joby2) + d.slice(160);
		//sayit(job.data_arr[17]);
		//sayit(bytesToHex(joby));
		//sayit(bytesToHex_rev(joby));
		//sayit(bytesToHex_rev2(joby));
		//sayit(bytesToHex_rev3(joby));
		//if (d != d2) { 
			//sayit("im diffy!");
		//}


		//sayit(d);
		//sayit(d2);
		//sayit("\n");
		//sayit("--ff-- " + decimalToHexString(sharenum) + "--ff-\n");
		//sayit("---" + decimalToHexString(job.data_arr[1]) + "---");
		submit_share(d);
		
		d = 0;
		joby2 = 0;
		
		//submit_share(d2);


		}
	}

    	for (var i = 0; i < 257; i++) {
      		//output.innerHTML += outBuffer[i] + " ";
      		outBuffer[i] = 0;
    	}

    	dataObject1.fill();
		cmdQueue.enqueueWriteBuffer (bufout, false, 0, bufsize, dataObject1, []);    
    }

 /*   
    hashed = hashed + (cycles_per * global_worksize);
    hashed_total = hashed_total + hashed;

	d = new Date();
	time_now = d.getTime();
       
    if (last_time < (time_now - 2000)) {
       // hashrate(hashed);
    	//hashed = 0;
    	last_time = time_now;
		$('#cycles').val(cycles);
		$('#totalhashes').val(hashed_total);
    	
    }
*/
	var t = 0;
	var r = 0;

	//now = new Date();
	now = (new Date().getTime() / 1000);
	t = now - last_rated_pace;

	//debugprint(now);
	if (t > 1) {
		rate = (threads_run_pace / t) / rate_divisor;
		//rate = rate + Math.pow(2, parseInt(aggression));
		last_rated_pace = now; 
		threads_run_pace = 0;

		//last_hashrate = last_hashrate * (1.0 - aggression);
		//rate = rate * (1.0 - aggression);

		//rate_lie = aggression * 90000;

		r = last_hashrate / rate;
		//r = r * (1.0 - aggression);
		if ((r < 0.87) || (r > 1.13)) {
    		

				global_worksize = Math.max(work_unit * parseInt((rate * frame * rate_divisor) / work_unit, 10), work_unit);
			
				//global_worksize = Math.ceil(global_worksize * aggression) - (Math.ceil(global_worksize * aggression) % worksize);
			
				last_hashrate = rate;
				//global_worksize_arr.length = 0;
    			//global_worksize_arr.push(global_worksize);
    		
    			if (global_worksize > global_worksize_peak) {
    				global_worksize_peak = global_worksize;
    			}
    		
    		}
    		
    		
			debugprint("rate: " + rate + " r: " + r + " gt: " + global_worksize + " ag: " + aggression);
		}
	t = now - last_rated;// / 1000);
	if (t > 2.0) {
		//debugprint("tr: " + threads_run);

		hashrate(parseInt((threads_run / t) / rate_divisor), 10);
		last_rated = now;
		threads_run = 0;
    }
    
    
	t = now - work_start_time;// / 1000);
    if (t > 8.0) {
		debugprint("timeout");
    	need_new_work = true;
    }
    
    
    if(need_new_work == true) {

    	need_new_work = false;
    	start_mining();
    
    } else {
      // if (aggression < 9.9) {
    //	setTimeout ( "runcycle();", 30 * (10 - aggression) );
      // } else {
       
           	runcycle();
     //  }
    	
    	//setTimeout ( "runcycle();", cycle_wait_time );
    }

}


function bytesToHex (bytes) {
		for (var hex = [], i = 0; i < 4; i++) {
			hex.push((bytes[i] >>> 4).toString(16));
			hex.push((bytes[i] & 0xF).toString(16));
		}
		return hex.join("");
		
}
