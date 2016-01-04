angular.module('oxelie.map.home', [ ])

  .controller('HomeCtrl', function ($scope, $stateParams, $location, $http, $q, helpers, $timeout, oxelieMapStore) {
    $scope.interfaceDisabled = !!$stateParams.noInterface;
    $scope.siteMode = ($stateParams.siteMode == 'true');
    $scope.zoom = $stateParams.zoom;
    $scope.item = null;
    $scope.autofocus = true;
    $scope.showClimate = false;
    $scope.climateLoadingState = 0;
    $scope.climateIsVisible = false;
    $scope.introduction = {step: -1};
    $scope.currentTool = -1;
    $scope.measure = {data: 0};

    if (!oxelieMapStore.get('visited') && !$scope.siteMode) $scope.introduction.step = 0;

    oxelieMapStore.set('visited', true);

    $scope.toggleMeasure = function () {
    	if ($scope.currentTool == 0) {
      	selectTools(-1);
        $scope.$broadcast ('stopMeasure');
        return;
      }

    	if ($scope.currentTool != 0) selectTools(0);

      $scope.$broadcast ('startMeasure');
    };

    $scope.toggleHighres = function () {
    	if ($scope.currentTool == 1) {
      	selectTools(-1);
        return;
      }
    	if ($scope.currentTool != 1) selectTools(1);
    };

    $scope.toggleClimates = function () {
    	if ($scope.currentTool == 2) {
        selectTools(-1);
        return;
      }

    	if ($scope.currentTool != 2) selectTools(2);

      if (!$scope.climateLoadingState) $scope.climateLoadingState = 1;

      $scope.climateIsVisible = !$scope.climateIsVisible;

    	$timeout(function () {
    	  $scope.showClimate = !$scope.showClimate;	
    	}, 50);
    };

    $scope.showIntroduction = function () {
    	if ($scope.currentTool == 3) {
      	selectTools(-1);
        return;
      }
    	if ($scope.currentTool != 3) selectTools(3);

      $scope.introduction.step = 0;
    	
    };

    $scope.closeIntroduction = function() {
    	if ($scope.currentTool == 3) $scope.currentTool = -1;
      $scope.introduction.step = -1;      
    }

    var canceler;

    $scope.data = {searchItem: ''};
    $scope.search = function(value) {
      if (!value) return [];

      var params = {ajax: true, action: 'getTags', field: 'name', query: value};
      
      if (canceler) canceler.resolve();
      canceler = $q.defer();

      return $http.get('https://maps.oxelie.com/api/search.php', {timeout: canceler.promise, params: params}).then(function(res) {
        return res.data;
      });
    };

    $scope.getInformations = function (id) {
      $location.path('/'+id);
      var params = {id: id};

      $http.get('https://maps.oxelie.com/api/getElement.php', {params: params}).then(function(res) {
        res.data.zoom = $scope.zoom;
        $scope.item = res.data;
      });
    };

    $scope.clearItem = function () {
      $scope.item = null;
      $scope.searchItem = '';
      $scope.autofocus = true;
    };

    $scope.$watch('data.searchItem', function (value) {
    	if (typeof(value) == 'object') {
        $scope.getInformations(value.id);
    	}
    })

    function selectTools(tool) {
      if (tool != 3) $scope.closeIntroduction();
      
      if (tool != 2) {
        $scope.climateIsVisible = false
        $scope.showClimate = false;        
      }

      if ($scope.currentTool == 0) $scope.$broadcast ('stopMeasure');

      $scope.measure.data = null;
    	$scope.currentTool = tool;
    };

    if ($stateParams.objectID) $scope.getInformations($stateParams.objectID);
  })

;
