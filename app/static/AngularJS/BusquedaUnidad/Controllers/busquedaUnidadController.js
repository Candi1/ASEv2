registrationModule.controller('busquedaUnidadController', function($scope, $location, $rootScope, $routeParams, alertFactory, globalFactory, commonService, localStorageService, busquedaUnidadRepository) {
    //*****************************************************************************************************************//
    //SE INICIALIZAN VARIABLES
    //*****************************************************************************************************************//
    $scope.idUsuario = 2;
    //Inicializa la pagina
    $scope.init = function() {
        console.log($routeParams.economico);
        $scope.getDetalleUnidad();

    };
    $scope.getDetalleUnidad = function() {
        busquedaUnidadRepository.getDetalleUnidad($scope.idUsuario, $routeParams.economico).then(function(result) {
            $scope.detalleUnidad = result.data[0];
            console.log($scope.detalleUnidad)
        });
    };
    $scope.btnAgendarCita = function() {
        location.href = '/nuevacita?economico=' + $routeParams.economico;
    };
});