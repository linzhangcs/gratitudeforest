//COLORS
var Colors = {
    white_l:0xf3f3e7,
    white_m:0xe1d7df,
    white_d:0xb5b0b4,

    grey_l:0xa3a1ba,
    grey_m:0x646371,
    grey_d:0x47444d,

    blue_l:0xc0c1ff,
    blue_m:0x888aee,
    blue_d:0x5557ad,
    blue_s:0x86CDEB,

    // yellow_l:0xf6dc9c,
    // yellow_m:0xe9be55,
    // yellow_d:0xdfa745,
    yellow_p:0xfef3df,
    yellow_l:0xfef2b9,
    yellow_m:0xe9be55,
    yellow_d:0xdfa745,
    yellow_b:0xffc901,
    yellow_v:0xfe9700,

    pink_l:0xfbb496,
    pink_m:0xf47763,
    pink_d:0xc04c39,

    // green_l:0xb5e5d9,
    // green_m:0x7ebaab,
    // green_d:0x3c7e6d,
    green_l:0x8EBA5F,
    green_m:0x528F47,
    green_d:0x1F5C45,
    green_b:0x188266,
    green_f:0x48A882,

    purple_l:0xca9ebf,
    purple_m:0x94748c,
    purple_d:0x584a5d,
};

Colors.whites = [
                Colors.white_l, Colors.white_m, Colors.white_d,
                ];

Colors.greys = [
                Colors.grey_l, Colors.grey_m, Colors.grey_d,
                ];

Colors.pinks = [
                Colors.pink_l, Colors.pink_m, Colors.pink_d
                ];

Colors.blues = [
                Colors.blue_l, Colors.blue_m, Colors.blue_d,Colors.blue_s
                ];

Colors.yellows = [
                Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
                ];

Colors.greens = [
                Colors.green_l, Colors.green_m, Colors.green_d,
                ];
Colors.purples = [
                Colors.purple_l, Colors.purple_m, Colors.purple_d,
                ];

Colors.all = [
            Colors.white_l, Colors.white_m, Colors.white_d,
            Colors.grey_l, Colors.grey_m, Colors.grey_d,
            Colors.blue_l, Colors.blue_m, Colors.blue_d,
            Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
            Colors.pink_l, Colors.pink_m, Colors.pink_d,
            Colors.green_l, Colors.green_m, Colors.green_d,
            Colors.purple_l, Colors.purple_m, Colors.purple_d,

         ];

Colors.trunc = [
                Colors.white_l, Colors.white_m, Colors.white_d,
                Colors.grey_l, Colors.grey_m, Colors.grey_d,
                //Colors.green_l, Colors.green_m, Colors.green_d,
                ];

Colors.leaves = [
                Colors.green_l, Colors.green_m, Colors.green_d,
                Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
                Colors.pink_l, Colors.pink_m, Colors.pink_d,
                ];

Colors.floor = [
                Colors.yellow_l, Colors.yellow_m, Colors.yellow_d,
                Colors.pink_l, Colors.pink_m, Colors.pink_d,
                Colors.green_l, Colors.green_m, Colors.green_d,
                Colors.grey_l, Colors.grey_m, Colors.grey_d,
                ];



Colors.getRandom = function(){
    var indx = Math.floor(Math.random()*Colors.all.length);
    return Colors.all[indx];
};

Colors.getRandomFrom = function(arr){
    var indx = Math.floor(Math.random()*arr.length);
    return arr[indx];
};
