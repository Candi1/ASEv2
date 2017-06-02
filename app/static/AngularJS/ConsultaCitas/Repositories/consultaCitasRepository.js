var consultaCitaUrl = global_settings.urlCORS + '/api/OrdenServicio/';
//var cotizacionUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('consultaCitasRepository', function($http, $q) {
    var deferred = $q.defer();

    return {
        getTotalOrdenes: function() {
            return $http({
                url: consultaCitaUrl + 'getTotalOrdenes/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getExisteOrden: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenExistente/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenAcciones: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenAcciones/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenCliente: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenCliente/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenDocumentos: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenDocumentos/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenEvidencias: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenEvidencias/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenDetalle: function(idUsuario, numeroOrden) {
            return $http({
                url: consultaCitaUrl + 'getOrdenDetalle/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    numeroOrden: numeroOrden
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
         getTalleres: function() {
            return $http({
                url: consultaCitaUrl + 'getTalleres/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getPartidasTaller: function(idTaller) {
            return $http({
                url: consultaCitaUrl + 'getPartidasTaller/',
                method: "GET",
                params: {
                    idTaller: idTaller
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getdatosComprobante: function (idTipoUnidad ) {
            return $http({
                url: consultaCitaUrl + 'getdatosComprobante',
                method: "GET",
                params: {
                    idTipoUnidad:idTipoUnidad
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
