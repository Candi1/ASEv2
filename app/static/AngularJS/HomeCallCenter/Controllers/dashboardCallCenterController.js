registrationModule.controller('dashboardCallCenterController', function($scope, alertFactory, userFactory, $rootScope, localStorageService, $route, dashboardCallCenterRepository,$timeout,dateFilter,globalFactory) {
    
    $rootScope.modulo            = 'home'; // <<-- Para activar en que opción del menú se encuentra
    $scope.userData              = userFactory.getUserData();
    $scope.idOperacion           = $scope.userData.idOperacion;

    $scope.init = function() {
      $scope.fecha_actual = new Date();
      $scope.traeOrdenesAtrasadas();
      $scope.traeOrdenesParaHoy();
      $scope.traeOrdenesSinObjetivo();
      $scope.traeRecordatorios();
      $scope.traeOrdenCallCenter();
    };

    //funcion reloj recursiva cada minuto
    $scope.iniClock = function(){
        $scope.theclock = (dateFilter(new Date(), 'hh:mm'));
          $timeout(function(){
            $scope.iniClock();
        },60000);
      };

    //inicia reloj 
      $scope.iniClock();

    $scope.traeOrdenesAtrasadas = function() {

            dashboardCallCenterRepository.getOrdenAtraso($scope.idOperacion, $scope.userData.idUsuario)
                .then(function successCallback(response) {
                    $scope.ordenesAtrasadas = response.data[0].NUM;
                  }, function errorCallback(response) {
                    $scope.ordenesAtrasadas = 0;
                });

        };

    $scope.traeOrdenesParaHoy = function() {
            dashboardCallCenterRepository.getOrdenParaHoy($scope.idOperacion, $scope.userData.idUsuario)
                .then(function successCallback(response) {
                    $scope.ordenesParaHoy = response.data[0].NUM;
                }, function errorCallback(response) {
                    $scope.ordenesParaHoy = 0;
                });
        };

    $scope.traeOrdenesSinObjetivo = function() {
            dashboardCallCenterRepository.getOrdenSinObjetivo($scope.idOperacion, $scope.userData.idUsuario)
                .then(function successCallback(response) {
                    $scope.ordenesSinObjetivo = response.data[0].NUM;
                }, function errorCallback(response) {
                    $scope.ordenesSinObjetivo = 0;
                });
        };


     $scope.traeRecordatorios = function(){
         $('.dataTableRecordatorios').DataTable().destroy();
         $scope.operaciones=[];
        $scope.promise = dashboardCallCenterRepository.getRecordatorios($scope.idOperacion, $scope.userData.idUsuario).then(function (result) {
            if (result.data.length > 0) {
                $scope.recordatorios = result.data;
                 globalFactory.filtrosTabla("dataTableRecordatorios", "fechaAccion", 3);
            }
        }, function (error) {
            alertFactory.error('El usuario no tiene recordatorios');
        });
    };

    $scope.traeOrdenCallCenter = function(){
         $('.dataTableOrdenCallCenter').DataTable().destroy();
         $scope.operaciones=[];
        $scope.promise = dashboardCallCenterRepository.getOrdenCallCenter($scope.idOperacion, $scope.userData.idUsuario).then(function (result) {
            if (result.data.length > 0) {
                $scope.ordencall = result.data;
                 globalFactory.filtrosTabla("dataTableOrdenCallCenter", "numeroOrden", 10);
            }
        }, function (error) {
            alertFactory.error('El usuario no tiene recordatorios');
        });
    };

     $scope.seleccionarOrden = function(obj) {
        location.href = '/detalle?orden=' + obj.numeroOrden + '&estatus=' + 1;
    }


});
