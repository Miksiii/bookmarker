'use strict';

describe('Service: BookmarkAPI', function () {

  // load the service's module
  beforeEach(module('bookmarkerApp'));

  // instantiate service
  var BookmarkAPI;
  beforeEach(inject(function (_BookmarkAPI_) {
    BookmarkAPI = _BookmarkAPI_;
  }));

  it('should do something', function () {
    expect(!!BookmarkAPI).toBe(true);
  });

});
