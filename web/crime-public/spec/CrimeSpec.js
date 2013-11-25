describe('Philly crime data', function() {

  var DATA_SIZE       = 1008448,
      FIELDS          = ['longitude', 'latitude', 'x', 'y', 'calc'],
      DATA_FILE_NAME  = 'philly-crime.csv',
      TIMEOUT         = 5000;

  var loaded_data;

  function loadData() {
    d3.csv(DATA_FILE_NAME, function(data) {
      loaded_data = data;
    });
  };

  function latch() {
    return (loaded_data !== null) ? true : false;
  };

  beforeEach(function() {
    loaded_data = null;
  });

  it('should load data from CSV', function() {
    runs(loadData);
    waitsFor(latch, 'crime data to load.', TIMEOUT);
    runs(function() {
      expect(loaded_data).not.toEqual(null);
      expect(loaded_data.length).toEqual(DATA_SIZE);
    });
  });

  it('should correspond to our data object interface', function() {
    runs(loadData);
    waitsFor(latch, 'crime data to load.', TIMEOUT);
    runs(function() {
      expect(loaded_data).not.toEqual(null);
      var datum = loaded_data.pop();
      _.each(FIELDS, function(field) {
        expect(datum[field]).not.toEqual(null);
      });
    });
  });

});