# Tumen Miner #
An experimental BitCoin miner, which uses WebCL for pooled block calculations.

This codebase is copyright T9 Productions, 2011. It is not currently licensed for third-parties, although the intention is to release under the Apache 2.0 license as soon as possible. As the original software contains third-party code under other licenses, the code must first be inspected carefully, to avoid potential license conflicts.

## WebCL ##
[WebCL](http://www.khronos.org/webcl/) is an emerging web standard for accessing a computer's GPU (Graphics Processor Unit) for general purpose computation. At this time there are two open-source implementations: [a Firefox 4 plugin from Nokia](http://webcl.nokiaresearch.com/), and [a Webkit prototype from Samsung](http://code.google.com/p/webcl/).

## History ##
Tumen Miner started life as [Krad Miner](https://en.bitcoin.it/wiki/Krad_Miner), developed by [oneman](https://github.com/oneman). Its development went into hiatus on June 2011, due in part to DDoS attacks made against the core infrastructure. In December of 2011 the code was purchased by T9 Productions, with the intention of releasing it as open source.

### Original Author Notes, 2011/12/24 ###
Here is the dump, I may have other versions, but this was the first thing I found, it maybe the best I have. I think the important javascript parts were miner_original.js and worker_original.js (which is missing) but you maybe able to de-minfy the worker.js file.

The whole client side of the system was just the index.html page, and those two javascript files. IIRC the 'web-worker' can't create an opencl context so all the work is done in the main javascript thread. The backend is just a proxy to a bitcoin miner, the reason it exists is just because of javascript security you have to connect to the same url/port, so that can be replaced by a modern mining proxy of some kind. 

My advice would be to study how webcl works, and get a demo of that going in your own code, then learn how the mining process works, and try to load the opencl kernel using your own webcl javascript code. then look over the worker.js and miner.js files and pick out the pieces that actually do the work of converting the bytes around to the right formats and talking to the webcl kernel. Looking at the source of poclbm and diablominer should give you an idea of the various byte conversion functions needed, krad miner works in the same ways as these miners do, only the code is in javascript and you have to deal with the strange different world of javascript.
