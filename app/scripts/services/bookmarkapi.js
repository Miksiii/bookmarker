'use strict';

/**
 * @ngdoc service
 * @name bookmarkerApp.BookmarkAPI
 * @description
 * # BookmarkAPI
 * Factory in the bookmarkerApp.
 */
angular.module('bookmarkerApp')
  .factory('BookmarkAPI', function ($http) {

    var resourceBookmarks = {
      data: function() {

        var promise = $http.get("collection/bookmarks.json")
          .then(function(response){
            return response.data;
          });

        return promise;
      }
    };

    var resourceColors = {
      data: function() {

        var promise = $http.get("collection/colors.json")
          .then(function(response){
            return response.data;
          });

        return promise;
      }
    };

    return {
      serviceBookmark: resourceBookmarks,
      serviceColors: resourceColors
    };

  });
