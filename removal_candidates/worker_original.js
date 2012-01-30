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

K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
				0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
				0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
				0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
				0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
				0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
				0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
				0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];

var TotalHashes = 0;
var the_hash_rate = 0;
var kernel;
var strang = "none";
var strang2 = "nones";

function send_it(midstate_0, midstate_1, midstate_2, midstate_3, midstate_4, midstate_5, midstate_6, midstate_7,
				 midstate2_1, midstate2_2, midstate2_3, midstate2_5, midstate2_6, midstate2_7, 
				 fW0, fW1, fW2, fW3, fW15, fW01r, fcty_e, fcty_e2)

{

	strang = midstate_0 + "*" + midstate_1 + "*" + midstate_2 + "*" + midstate_3 + "*" + midstate_4 + "*" + midstate_5 + "*" + midstate_6 + "*" + midstate_7 + "*" + midstate2_1 + "*" + midstate2_2 + "*" + midstate2_3 + "*" + midstate2_5 + "*" + midstate2_6 + "*" + midstate2_7 + "*" + fW0 + "*" + fW1 + "*" + fW2 + "*" + fW3 + "*" + fW15 + "*" + fW01r + "*" + fcty_e + "*" + fcty_e2;

}		


function send_data(data) {

	//strang2 = data[0] + "--, " + data[1].toString(10) + ", " + data[2].toString(10) + ", " +  data[3].toString(10) + ", " + data[4].toString(10) + ", " +  data[5].toString(10) + ", " +  data[6].toString(10) + ", " +  data[7].toString(10) + ", " +  data[8].toString(10) + ", " +  data[9].toString(10) + ", " +  data[10].toString(10) + ", " +  data[11].toString(10) + ", " +  data[12].toString(10) + ", " +  data[13].toString(10) + ", " + data[14].toString(10) + ", " +  data[15]

}

function rotl (n, b) {
		return (n << b) | (n >>> (32 - b));
}

function rot (n, b) {
		return (n << b) | (n >>> (32 - b));
}

function rotate (n, b) {
		return (n << b) | (n >>> (32 - b));
}

function rotr (n, b) {
		return (n << (32 - b)) | (n >>> b);
}

function R(a, b, c, d, e, f, g, h, w, k) {

	h = h + (rotate(e, 26) ^ rotate(e, 21) ^ rotate(e, 7)) + (g ^ (e & (f ^ g))) + k + w;
	d = d + h;
	h = h + (rotate(a, 30) ^ rotate(a, 19) ^ rotate(a, 10)) + ((a & b) | (c & (a | b)));	
}



function sharound_a(a,b,c,d,e,f,g,h,x,K) {
	t1=h+(rot(e, 26)^rot(e, 21)^rot(e, 7))+(g^(e&(f^g)))+K+x;
	t2=(rot(a, 30)^rot(a, 19)^rot(a, 10))+((a&b)|(c&(a|b)));
	return (d + t1)
}

function sharound_b(a,b,c,d,e,f,g,h,x,K) {
	t1=h+(rot(e, 26)^rot(e, 21)^rot(e, 7))+(g^(e&(f^g)))+K+x;
	t2=(rot(a, 30)^rot(a, 19)^rot(a, 10))+((a&b)|(c&(a|b)));
	return (t1+t2)
}
// midstate is 256-bits:	Array of 8, 32-bit numbers
// data is 512-bits:		Array of 16, 32-bit numbers
// hash1 is 256-bits:		Array of 8, 32-bit numbers
// target is 256-bits:		Array of 8, 32-bit numbers

function sharound(out, na, nb, nc, nd, ne, nf, ng, nh, x, KK) {

    a = out[na];
    b = out[nb];
    c = out[nc];
    d = out[nd];
    e = out[ne];
    f = out[nf];
    g = out[ng];
    h = out[nh];

    t1 = h + (rot(e, 6) ^ rot(e, 11) ^ rot(e, 25)) + ((e & f) ^ ((~e) & g)) + KK + x;
    t2 = (rot(a, 2) ^ rot(a, 13) ^ rot(a, 22)) + ((a & b) ^ (a & c) ^ (b & c));

    out[nd] = d + t1;
    out[nh] = t1 + t2;
}

function scanhash(stateb, datab, hash1, target)
{

	var nonce = 0;
	
	var fbuf = new ArrayBuffer(64);
	var fs = new Uint32Array(fbuf);
		
	fW0 = fs[0];
	fW1 = fs[1];
	fW2 = fs[2];
	fW3 = fs[3];
	fW15 = fs[4];
	fW01r = fs[5];
	fcty_e = fs[6];
	fcty_e2 = fs[7];

 	var state = new Uint32Array(stateb);
 	var data = new Uint32Array(datab, 64, 64);
	var	state2b = new ArrayBuffer(1024);
	var	state_tempb = new ArrayBuffer(1024);
	var	state_temp = new Uint32Array(state_tempb);
	var	state2 = new Uint32Array(state2b);
	var A, B, C, D, E, F, G, H;

	state2[0] = state[0];  // a
	state2[1] = state[1];  // b
	state2[2] = state[2];  // c
	state2[3] = state[3];  // d
	state2[4] = state[4];  // e
	state2[5] = state[5];  // f
	state2[6] = state[6];  // g
	state2[7] = state[7];  // h

	//sharound(state2, 0, 1, 2, 3, 4, 5, 6, 7, data[0], 0x428A2F98);
	//sharound(state2, 7, 0, 1, 2, 3, 4, 5, 6, data[1], 0x71374491);
	//sharound(state2, 6, 7, 0, 1, 2, 3, 4, 5, data[2], 0xB5C0FBCF);
	
	var i = 0;
	
	for (i = 0; i < 3; i++) { //in xrange(3):
		state2[~(i-4)&7] = sharound_a(state2[(~(i-1)&7)],state2[~(i-2)&7],state2[~(i-3)&7],state2[~(i-4)&7],state2[~(i-5)&7],state2[~(i-6)&7],state2[~(i-7)&7],state2[~(i-8)&7],data[i],K[i]);
		state2[~(i-8)&7] = sharound_b(state2[(~(i-1)&7)],state2[~(i-2)&7],state2[~(i-3)&7],state2[~(i-4)&7],state2[~(i-5)&7],state2[~(i-6)&7],state2[~(i-7)&7],state2[~(i-8)&7],data[i],K[i]);
				
	}
	
	

	fs[0] = data[0] + (rotr(data[1], 7) ^ rotr(data[1], 18) ^ (data[1] >>> 3));
	fs[1] = data[1] + (rotr(data[2], 7) ^ rotr(data[2], 18) ^ (data[2] >>> 3)) + 0x01100000;
	fs[2] = data[2] + (rotr(fs[0], 17) ^ rotr(fs[0], 19) ^ (fs[0] >>> 10));
	fs[3] = 0x11002000 + (rotr(fs[1], 17) ^ rotr(fs[1], 19) ^ (fs[1] >>> 10));
	fs[4] = 0x00000280 + (rotr(fs[0], 7) ^ rotr(fs[0], 18) ^ (fs[0] >>> 3));
	fs[5] = fs[0] + (rotr(fs[1], 7) ^ rotr(fs[1], 18) ^ (fs[1] >>> 3));
	
	fs[6] = state[4] + (rotr(state2[1], 6) ^ rotr(state2[1], 11) ^ rotr(state2[1], 25)) + (state2[3] ^ (state2[1] & (state2[2] ^ state2[3]))) + 0xe9b5dba5;
    fs[7] = (rotr(state2[5], 2) ^ rotr(state2[5], 13) ^ rotr(state2[5], 22)) + ((state2[5] & state2[6]) | (state2[7] & (state2[5] | state2[6])));                 
                        
	send_it(state[0], state[1], state[2], state[3], state[4], state[5], state[6], state[7],
			state2[1], state2[2], state2[3], state2[5], state2[6], state2[7],
			fs[0], fs[1], fs[2], fs[3], fs[4], fs[5], fs[6], fs[7]);

	//send_data(data);

	return false;
	//close();

}


onmessage = function(event) {

	var job = event.data;
	
	scanhash(event.data.midstate, event.data.data, event.data.hash1, event.data.target);

	sendStrangUpdate(job);
	
};


function sendStrangUpdate(job)
{
	job.strang = strang;
	//job.strang2 = strang2;
	
	postMessage(job);
} 
