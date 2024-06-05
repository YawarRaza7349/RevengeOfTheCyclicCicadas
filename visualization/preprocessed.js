"use strict";

const preprocessed = JSON.parse(`{"startYear":2013,"data":[{"state":"AL","cycle13":[0,0,0,0,0,0,0,0,0,0,0,624,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0]},{"state":"AR","cycle13":[0,0,2,0,0,0,0,0,0,0,0,131,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0]},{"state":"CT","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[1,0,0,0,0,0,0,0,0,55,0,0,0,0,0,0,0]},{"state":"DC","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,44,0,0,0,0,0,0,0,0]},{"state":"DE","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,34,0,0,0,0,0,0,0,0]},{"state":"GA","cycle13":[0,0,0,0,0,0,0,0,0,0,0,1273,0],"cycle17":[0,0,0,0,36,0,0,0,120,0,0,0,204,0,0,0,0]},{"state":"IA","cycle13":[0,0,0,0,0,0,0,0,0,0,0,402,0],"cycle17":[0,15,0,0,2,0,0,0,0,0,0,375,0,0,0,0,0]},{"state":"IL","cycle13":[0,0,3678,0,0,0,54,0,0,0,0,4181,0],"cycle17":[0,2834,0,1,3,1,1,5,1398,0,2,9877,0,0,0,0,0]},{"state":"IN","cycle13":[0,0,391,0,0,0,57,0,0,0,0,68,0],"cycle17":[0,0,0,0,1,0,0,0,1342,0,0,61,238,0,0,1,0]},{"state":"KS","cycle13":[0,0,0,0,0,0,0,0,0,0,0,33,0],"cycle17":[0,0,13,0,0,0,0,0,0,0,0,0,0,0,0,2,0]},{"state":"KY","cycle13":[0,0,8,0,0,0,0,0,0,0,0,152,0],"cycle17":[0,0,0,0,0,0,0,1,533,0,1,6,4417,0,0,0,0]},{"state":"LA","cycle13":[0,3,54,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"state":"MA","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,0,1,0,2,865,0,0,0,0]},{"state":"MD","cycle13":[0,0,0,0,0,0,0,0,0,0,0,190,0],"cycle17":[0,0,0,0,0,0,0,0,1282,0,0,0,31,0,0,0,2]},{"state":"MI","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,23,0,0,13,0,0,0,0,0]},{"state":"MO","cycle13":[0,0,16,0,0,0,0,0,0,0,0,1558,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"state":"MS","cycle13":[0,6,103,0,0,0,0,0,0,0,0,58,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"state":"NC","cycle13":[0,0,0,0,0,0,0,0,0,0,0,1398,0],"cycle17":[1,0,0,0,361,0,0,52,11,1,0,1,2367,0,0,1,0]},{"state":"NJ","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[1,0,0,0,0,0,0,0,94,0,0,0,0,0,0,0,0]},{"state":"NY","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,2,0,31,0,0,5,0,0,1,227,0,0,0,2]},{"state":"OH","cycle13":[0,0,0,0,0,0,0,0,0,0,0,1,0],"cycle17":[0,0,0,33,0,0,4,0,820,0,4,13,1514,0,0,0,50]},{"state":"OK","cycle13":[0,0,0,0,0,0,0,0,0,0,0,32,0],"cycle17":[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"state":"PA","cycle13":[0,0,0,0,0,0,0,0,0,0,0,1,0],"cycle17":[0,0,0,1,0,0,1,0,1078,0,0,2,718,0,0,0,0]},{"state":"RI","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0]},{"state":"SC","cycle13":[0,0,0,0,0,0,0,0,0,0,0,841,0],"cycle17":[0,0,0,0,9,0,0,0,0,0,0,0,58,0,0,0,0]},{"state":"TN","cycle13":[0,0,15,0,0,0,0,0,0,0,0,1498,0],"cycle17":[0,0,0,0,0,0,0,0,36,0,0,2,631,0,0,0,4222]},{"state":"TX","cycle13":[0,0,0,0,0,0,0,0,0,0,0,2,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"state":"VA","cycle13":[0,0,0,0,0,0,0,0,0,0,0,522,0],"cycle17":[1,0,0,7,0,0,0,5,499,0,0,0,208,0,0,0,9701]},{"state":"WI","cycle13":[0,0,0,0,0,0,0,0,0,0,0,0,0],"cycle17":[0,0,0,0,0,0,0,0,0,0,2,168,0,0,0,0,0]},{"state":"WV","cycle13":[0,0,0,0,0,0,0,0,0,0,0,2,1],"cycle17":[0,0,0,30,0,0,2,4,86,0,1,3,141,0,0,0,268]}]}`);
