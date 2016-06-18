'use strict';

/**
 * @ngdoc function
 * @name bookmarkerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bookmarkerApp
 */
angular.module('bookmarkerApp')
  .controller('MainCtrl', function ($scope, $http, BookmarkAPI, Group, Site, $filter) {

    var bmkStructureJSON,
        bmkSites,
        bmkGroups,
        bmkColors,
        bmkError,
        bmkGroupInitLen,
        bmkSiteInitLen;

    var onBookmarkSuccess = function(bookmarkResponse) {
      bmkStructureJSON = bookmarkResponse;
      bmkSites = bookmarkResponse["sites"];
      bmkGroups = bookmarkResponse["groups"];
      bmkGroupInitLen = bmkGroups.length;
      bmkSiteInitLen = bmkSites.length;
    };

    var onColorSuccess = function(colorResponse) {
      bmkColors = colorResponse;
    };

    var onServiceError = function(reason) {
      $scope.bmkError = "Ooops, an error occured while fetching the data. " + reason.toString();
    };

    BookmarkAPI.serviceBookmark.data()
      .then(onBookmarkSuccess, onServiceError);

    BookmarkAPI.serviceColors.data()
      .then(onColorSuccess, onServiceError);

    $scope.getPrettyJSON = function(JSONstructure) {
      return JSON.stringify(JSONstructure, null, "  ");
    };

    $scope.getBookmarkJSONStructure = function() {
      return bmkStructureJSON;
    };

    $scope.getSitesList = function() {
      return bmkSites;
    };

    $scope.getGroupsList = function() {
      return bmkGroups;
    };

    $scope.isUncategorized = function (site) {
      return site.groups && site.groups.length === 0;
    };

    $scope.getColorsList = function() {
      return bmkColors;
    };

    $scope.getSizeOfSites = function() {
      return bmkSites.length;
    };

    $scope.getSizeOfGroups = function() {
      return bmkGroups.length;
    };

    var getSiteByID = function(siteID) {
      return $filter('filter')(bmkSites, {id: siteID})[0];
    };

    var getGroupByID = function(groupID) {
      return $filter('filter')(bmkGroups, {id: groupID})[0];
    };

    $scope.getSitesLengthByGroup = function(groupID) {
      var tmpGroup = getGroupByID(groupID);
      return tmpGroup.sites.length;
    };

    var dismissModalFromView = function() {
      $(".modal").modal('hide');
    };

    var resetGroupFormFields = function() {
      $scope.group.id = "";
      $scope.group.name = "";
      $scope.group.color = bmkColors[0];
      $scope.group.sites = [];
    };

    var setGroupID = function(newGroup) {
      bmkGroupInitLen = bmkGroupInitLen + 1;
      newGroup.id = bmkGroupInitLen;
    };

    $scope.addNewGroup = function() {
      setGroupID($scope.group);
      bmkGroups.push(new Group($scope.group));
      dismissModalFromView();
      resetGroupFormFields();
    };

    $scope.getListOfSitesPerGroup = function(groupID) {

      // null => user didn't click yet on group edit button
      // so no modal has been created.
      if(groupID !== null) {
        return getGroupByID(groupID)["sites"];
      }

      return null;
    };

    var destroyGroupIdFromSiteList = function(siteID, groupID) {
      var tmpSite = getSiteByID(siteID);
      var indexOfGroupIDToDelete = tmpSite.groups.indexOf(groupID);

      // -1 represents site without defined groupID
      if(indexOfGroupIDToDelete !== -1) {
        tmpSite.groups.splice(indexOfGroupIDToDelete, 1);
      }
    };

    var destroySiteListFromGroupID = function(listOfSiteIDsToDelete, group) {
      angular.forEach(listOfSiteIDsToDelete, function(siteID) {
        destroySiteFromGroupsList(siteID);
        destroyGroupIdFromSiteList(siteID, group.id);
      });
    };

    var tmpGroupHolder;

    $scope.editGroup = function(groupToEdit) {
      tmpGroupHolder = groupToEdit;
      $scope.groupCopy = angular.copy(tmpGroupHolder);
    };

    var resetGroupChecklistModel = function() {
      $scope.listOfSiteIDsToDelete = [];
    };

    $scope.updateGroup = function() {
      tmpGroupHolder.name = $scope.groupCopy.name;
      tmpGroupHolder.color = $scope.groupCopy.color;
      destroySiteListFromGroupID($scope.listOfSiteIDsToDelete, tmpGroupHolder);
      resetGroupChecklistModel();
      dismissModalFromView();
    };

    var getGroupIDsListFromSite = function(site) {
      return site.groups;
    };

    var destroyGroupIdFromSitesList = function(groupIDToDelete) {
      angular.forEach(bmkSites, function(tmpSite) {
        var tmpSiteGroups = getGroupIDsListFromSite(tmpSite);
        var indexOfGroupIDToDelete = tmpSiteGroups.indexOf(groupIDToDelete);

        // -1 represents site without defined groupID
        if(indexOfGroupIDToDelete !== -1) {
          tmpSiteGroups.splice(indexOfGroupIDToDelete, 1);
        }
      });
    };

    var isConfirmedDialog = function(message) {
      return confirm("Are you sure you want to " + message + "?");
    };

    $scope.destroyGroup = function(groupToDelete) {
      var indexOfGroupToDelete = bmkGroups.indexOf(groupToDelete);

      if(isConfirmedDialog("delete group")) {
        bmkGroups.splice(indexOfGroupToDelete, 1);
        destroyGroupIdFromSitesList(groupToDelete.id);
      }
    };

    var setSiteID = function(newSite) {
      bmkSiteInitLen = bmkSiteInitLen + 1;
      newSite.id = bmkSiteInitLen;
    };

    $scope.displayAddSiteChecklistModel = function(isVisible) {
      var checklistModel = $(".checklist-model-groups");

      if(isVisible) {
        checklistModel.show();
      } else {
        checklistModel.hide();
      }
    };

    var selectOneGroupFromCheckboxes = function(groupID) {
      $scope.site.groups.push(groupID);
    };

    var tmpDefaultGroup = null;

    $scope.setDefaultGroupForSite = function(defaultGroup) {
      selectOneGroupFromCheckboxes(defaultGroup.id);
      $scope.displayAddSiteChecklistModel(false);
      tmpDefaultGroup = defaultGroup;
    };

    var addSiteToChoosenGroup = function(newSite) {
        tmpDefaultGroup.sites.push(newSite);
        tmpDefaultGroup = null;
    };

    var addSiteToSpecifiedGroups = function(newSite) {

      angular.forEach(newSite.groups, function(groupID) {
        var tmpGroup = getGroupByID(groupID);
        tmpGroup.sites.push(newSite);
      });

    };

    var resetSiteFormFields = function() {
      $scope.site.id = "";
      $scope.site.url = "";
      $scope.site.color = bmkColors[0];
      $scope.site.groups = [];
    };

    $scope.addNewSite = function() {
      setSiteID($scope.site);
      var tmpSite = new Site($scope.site);
      bmkSites.push(tmpSite);

      // !null => add site to default group
      if (tmpDefaultGroup !== null) {
        addSiteToChoosenGroup(tmpSite);
      } else {
        addSiteToSpecifiedGroups(tmpSite);
      }

      dismissModalFromView();
      resetSiteFormFields();
    };

    var tmpSiteHolder;

    $scope.editSite = function(siteToEdit) {
      tmpSiteHolder = siteToEdit;
      $scope.siteCopy = angular.copy(tmpSiteHolder);
    };

    var getSiteFromGroup = function(group, siteId) {
      return $filter('filter')(group.sites, {id: siteId})[0];
    };

    // potential 3 functions in 1
    var updateSiteInGroups = function(updatedSite) {

      angular.forEach(bmkGroups, function(group) {
        var siteFromGroupToEdit = getSiteFromGroup(group, updatedSite.id);

        // undefined => site doesn't have group
        if (typeof siteFromGroupToEdit !== 'undefined') {
          siteFromGroupToEdit.url = updatedSite.url;
          siteFromGroupToEdit.color = updatedSite.color;
          siteFromGroupToEdit.groups = updatedSite.groups;
        }
      });

      destroySiteFromGroupsList(updatedSite.id);

      angular.forEach(updatedSite.groups, function(groupID) {
        var tmpGroup = getGroupByID(groupID);
        tmpGroup.sites.push(updatedSite);
      });

    };

    $scope.updateSite = function() {
      tmpSiteHolder.url = $scope.siteCopy.url;
      tmpSiteHolder.color = $scope.siteCopy.color;
      tmpSiteHolder.groups = $scope.siteCopy.groups;
      updateSiteInGroups(tmpSiteHolder);
      dismissModalFromView();
    };

    var destroySiteFromGroupsList = function(siteIdToDelete) {
      angular.forEach(bmkGroups, function(group) {

        var siteFromGroupToDel = getSiteFromGroup(group, siteIdToDelete);

        // undefined => site doesn't have group
        if (typeof siteFromGroupToDel !== 'undefined') {
          var indexOfSiteFromGroupToDel = group.sites.indexOf(siteFromGroupToDel);
          group.sites.splice(indexOfSiteFromGroupToDel, 1);
        }

      });
    };

    $scope.destroySite = function(siteToDelete) {
      var indexOfSiteToDelete = bmkSites.indexOf(siteToDelete);

      if(isConfirmedDialog("delete site")) {
        bmkSites.splice(indexOfSiteToDelete, 1);
        destroySiteFromGroupsList(siteToDelete.id);
      }
    };

    $scope.toggleAccordionVisibility = function(accordionID) {
      var accordionToToggle = $("#accord-" + accordionID);

      accordionToToggle.find(".toggle-indicator").toggleClass('over');
      accordionToToggle.next().slideToggle('fast');
    };

    $scope.group     = {id: null, name: null, color: null, sites: []};
    $scope.groupCopy = {id: null, name: null, color: null, sites: []};
    $scope.site      = {id: null, url: null, color: null, groups: []};
    $scope.siteCopy  = {id: null, url: null, color: null, groups: []};

    // sites checklistmodel for group edit
    $scope.listOfSiteIDsToDelete = [];


  });
