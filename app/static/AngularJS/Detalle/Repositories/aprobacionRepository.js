var aprobacionUrl = global_settings.urlCORS + '/api/aprobacion/';


registrationModule.factory('aprobacionRepository', function($http) {
    return {
        getApprovalTest: function() {
            return $http({
                url: aprobacionUrl + 'approvalTest/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getUpdateStatusPartida: function() {
            return $http({
                url: aprobacionUrl + 'updateStatusPartida/',
                method: "GET",
                params: { idTar: idTar },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getUpdateStatusCotizacion: function() {
            return $http({
                url: aprobacionUrl + 'updateStatusCotizacion/',
                method: "GET",
                params: { idTar: idTar },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPresupuesto: function(numeroOrden) {
            return $http({
                url: aprobacionUrl + 'presupuesto/',
                method: "GET",
                params: { numeroOrden: numeroOrden },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});
