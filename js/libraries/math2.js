var Math2 = {
  rangeRandom : function (v1, v2){
    var max = Math.max(v1,v2);
    var min = (max==v1)?v2 : v1;
    return min + Math.random()*(max-min);
  },
  rangeRandomInt : function (v1,v2){
    var max = Math.max(v1,v2);
    var min = (max==v1)?v2 : v1;
    var rnd = min + Math.random()*(max-min);
    return Math.round(rnd);
  },
  map : function(num, input_min, input_max, output_min, output_max){
    return(num - input_min)*(output_max - output_min) / (input_max - input_min) + output_min;
  }
}
