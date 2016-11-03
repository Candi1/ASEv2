
registrationModule.controller('token_controller', function ($scope, $modalInstance, $modal, idAprobacionUtilidad, origen, callback, error, $http, $sce, $window, ordenServicioRepository, alertFactory) {

	
	$scope.init= function (){
		$scope.token='';

        if (origen == 'Aprobacion') {
            $scope.show_Aprobacion= true;
        }else{
            $scope.show_Aprobacion= false; 
        }
	}
	 $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.saveToken = function () {
        ordenServicioRepository.estatusToken($scope.token).then(function (estatus) {
      
            if (estatus.data.length > 0) {
                if (estatus.data[0].estatus == 1) {
                  
                    ordenServicioRepository.putAprobacionUtilidadRespuesta(idAprobacionUtilidad,$scope.userData.idUsuario, $scope.token).then(function (aprobacionUtilidad) {
                     
                        if (aprobacionUtilidad.data[0].id > 0) {
                              
                            alertFactory.success("Proceso Realizado!");   
                            callback();   
                            $scope.close();                         
                        }
                    }, function (error) {
                        alertFactory.error("Error al cargar la orden");
                    });
                }else{
                    alertFactory.error("El token se ha utilizado previamente."); 
                }
                                               
            }else{
                 alertFactory.error("El token es incorrecto");  
            }
        }, function (error) {
            alertFactory.error("Error al cargar la orden.");
        });
    }
    

});	