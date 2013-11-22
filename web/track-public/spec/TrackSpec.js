
describe('Track data', function() {

  var DATA_SIZE       = 237635,
      FIELDS          = ['type', 'id', 'time', 'lat', 'lon', 'alt'],
      DATA_FILE_NAME  = 'flights.tsv',
      TIMEOUT         = 1000;

  var loaded_data;

  function loadData() {
    d3.tsv(DATA_FILE_NAME, function(data) {
      loaded_data = data;
    });
  };

  function latch() {
    return (loaded_data !== null) ? true : false;
  };

  beforeEach(function() {
    loaded_data = null;
  });

  it('should load data from TSV', function() {
    runs(loadData);
    waitsFor(latch, 'track data to load.', TIMEOUT);
    runs(function() {
      expect(loaded_data).not.toEqual(null);
      expect(loaded_data.length).toEqual(DATA_SIZE);
    });
  });

  it('should correspond to our data object interface', function() {
    runs(loadData);
    waitsFor(latch, 'track data to load.', TIMEOUT);
    runs(function() {
      expect(loaded_data).not.toEqual(null);
      var datum = loaded_data.pop();
      _.each(FIELDS, function(field) {
        expect(datum[field]).not.toEqual(null);
      });
    });
  });

});