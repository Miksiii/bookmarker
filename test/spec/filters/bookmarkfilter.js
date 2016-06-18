'use strict';

describe('Filter: bookmarkFilter', function () {

  // load the filter's module
  beforeEach(module('bookmarkerApp'));

  // initialize a new instance of the filter before each test
  var bookmarkFilter;
  beforeEach(inject(function ($filter) {
    bookmarkFilter = $filter('bookmarkFilter');
  }));

  it('should return the input prefixed with "bookmarkFilter filter:"', function () {
    var text = 'angularjs';
    expect(bookmarkFilter(text)).toBe('bookmarkFilter filter: ' + text);
  });

});
