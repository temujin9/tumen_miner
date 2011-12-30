# Tumen Miner #
An experimental [BitCoin](http://bitcoin.org/) miner, which uses WebCL for pooled block calculations.

## WebCL ##
[WebCL](http://www.khronos.org/webcl/) is an emerging web standard for accessing a computer's GPU (Graphics Processor Unit) for general purpose computation. At this time there are two open-source implementations: [a Firefox 4 plugin from Nokia](http://webcl.nokiaresearch.com/), and [a Webkit prototype from Samsung](http://code.google.com/p/webcl/).

## Copyright & License ##
> Copyright 2011 T9 Productions

>   Licensed under the Apache License, Version 2.0 (the "License");
>   you may not use this file except in compliance with the License.
>   You may obtain a copy of the License at
>
>       http://www.apache.org/licenses/LICENSE-2.0
>
>   Unless required by applicable law or agreed to in writing, software
>   distributed under the License is distributed on an "AS IS" BASIS,
>   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
>   See the License for the specific language governing permissions and
>   limitations under the License.

## History ##
Tumen Miner started life as [Krad Miner](https://en.bitcoin.it/wiki/Krad_Miner), developed by [oneman](https://github.com/oneman). Its development went into hiatus on June 2011, due in part to DDoS attacks made against the core infrastructure. In December of 2011 the code was purchased by T9 Productions and released as open source.

### Credits ###
The [dark-hive theme](http://www.magpress.com/wordpress-themes/darkhive.html) is licensed from [MagPress](http://www.magpress.com/) under [CC-BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/us/). The [mining proxy](https://github.com/cdhowie/Bitcoin-mining-proxy/) is licensed from [Chris Howie](http://www.chrishowie.com/) under the [Affero GPL](http://www.gnu.org/licenses/agpl.html).

### Original Author Notes, 2011/12/24 ###
> Here is the dump, I may have other versions, but this was the first thing I found, it maybe the best I have. I think the important javascript parts were miner_original.js and worker_original.js (which is missing) but you maybe able to de-minfy the worker.js file.

> The whole client side of the system was just the index.html page, and those two javascript files. IIRC the 'web-worker' can't create an opencl context so all the work is done in the main javascript thread. The backend is just a proxy to a bitcoin miner, the reason it exists is just because of javascript security you have to connect to the same url/port, so that can be replaced by a modern mining proxy of some kind. 

> My advice would be to study how webcl works, and get a demo of that going in your own code, then learn how the mining process works, and try to load the opencl kernel using your own webcl javascript code. then look over the worker.js and miner.js files and pick out the pieces that actually do the work of converting the bytes around to the right formats and talking to the webcl kernel. Looking at the source of poclbm and diablominer should give you an idea of the various byte conversion functions needed, krad miner works in the same ways as these miners do, only the code is in javascript and you have to deal with the strange different world of javascript.
