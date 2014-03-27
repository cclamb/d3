
var Statistics = function(){

	var _mean = function(arr) {
		var running_sum = 0;
        for (var i in arr) {
            running_sum += arr[i];
        }
        return running_sum / arr.length;
	}

	var _stdev = function(arr) {
		var mean = _mean(arr),
			sum = 0;
		for (var i in arr) {
			var value = arr[i] - mean;
			sum += Math.pow(value, 2)
		}
		return sum / arr.length;
	}

	return {
		mean: _mean,
		standard_deviation: _stdev
	};
}();

var Processor = function() {

	return {
		process_data: function(data) {
            var ret = {
                total_records: [],
                time_stamps: [],
                store_time: [],
                fetch_time: [],
                bad_records: [],
                processed_records: []
            };

            _.each(data, function(e) {
                ret.total_records.push(e['total-records']);
                ret.time_stamps.push(e['time-stamp']);
                ret.store_time.push(e['store-time']);
                ret.fetch_time.push(e['fetch-time']);
                ret.bad_records.push(e['bad-records']);
                ret.processed_records.push(e['processed-records']);
            });

            return ret;
        }
	};
}();