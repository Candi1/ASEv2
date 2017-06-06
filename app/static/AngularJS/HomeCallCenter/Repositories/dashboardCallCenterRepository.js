var dashboardCallcenterUrl = global_settings.urlCORS + '/api/dashboardCallcenter/';

registrationModule.factory('dashboardCallCenterRepository', function ($http) {
    return {
       

        getOrdenAtraso: function (idContratoOperacion,idUsuario) {
            return $http({
                url: dashboardCallcenterUrl + 'ordenesAtraso/',
                method: "GET",
                params: {
                    idUsuario:idUsuario,
                    idContratoOperacion:idContratoOperacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenParaHoy: function (idContratoOperacion,idUsuario) {
            return $http({
                url: dashboardCallcenterUrl + 'ordenesParaHoy/',
                method: "GET",
                params: {
                    idUsuario:idUsuario,
                    idContratoOperacion:idContratoOperacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenSinObjetivo: function (idContratoOperacion,idUsuario) {
            return $http({
                url: dashboardCallcenterUrl + 'ordenesSinObjetivo/',
                method: "GET",
                params: {
                    idUsuario:idUsuario,
                    idContratoOperacion:idContratoOperacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 

        getRecordatorios: function (idContratoOperacion,idUsuario) {
            return $http({
                url: dashboardCallcenterUrl + 'recordatorios/',
                method: "GET",
                params: {
                    idUsuario:idUsuario,
                    idContratoOperacion:idContratoOperacion
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});