'use strict';

/**
 * @ngdoc filter
 * @name bookmarkerApp.filter:bookmarkFilter
 * @function
 * @description
 * # bookmarkFilter
 * Filter in the bookmarkerApp.
 */
angular.module('bookmarkerApp')
  .filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  })
  .filter('orderUncategorized', function(potentialUncatSite) {
      return potentialUncatSite.groups && potentialUncatSite.groups.length === 0;
  });
