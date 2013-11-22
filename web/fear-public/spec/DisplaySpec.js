describe('Display', function() {

  it('should filter data', function() {

    d3.csv('fear.csv', function(data) { 

      expect(testData).not.toEqual(null);

      parsedData = parseFearData(data);

      expect(parsedData).not.toEqual(null);
      expect(parsedData.length).toEqual(data.length);

      _.each(parsedData, function(element) {
        expect(typeof element.date).toEqual('object');
      });
    });

  });

});