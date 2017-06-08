var citaUrl = global_settings.urlCORS + '/api/cita/';
var cotizacionUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('citaRepository', function($http, $q) {
    var deferred = $q.defer();

    return {
        getTipoOrdenesServicio: function() {
            return $http({
                url: citaUrl + 'tiposOrdenesServicio/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getTipoEstadoUnidad: function() {
            return $http({
                url: citaUrl + 'tipoEstadoUnidad/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        putAgendarCita: function(idUnidad, idUsuario, idTipoCita, idEstadoUnidad, grua, fechaCita, comentario, idZona, taller) {
            return $http({
                url: citaUrl + 'agendarCita/',
                method: "PUT",
                params: {
                    idUnidad: idUnidad,
                    idUsuario: idUsuario,
                    idTipoOrdenServicio: idTipoCita,
                    idEstadoUnidad: idEstadoUnidad,
                    grua: grua,
                    fechaCita: fechaCita,
                    comentario: comentario,
                    idZona: idZona,
                    taller: taller
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getServicios: function(idUsuario, economico) {
            return $http({
                url: citaUrl + 'servicios/',
                method: "GET",
                params: {
                    idUsuario: idUsuario,
                    economico: economico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        putActualizarCita: function(idOrden,idUnidad, idUsuario, idTipoCita, idEstadoUnidad, grua, fechaCita, comentario, idZona, taller) {
            return $http({
                url: citaUrl + 'actualizarCita/',
                method: "PUT",
                params: {
                    idOrden: idOrden,
                    idUnidad: idUnidad,
                    idUsuario: idUsuario,
                    idTipoOrdenServicio: idTipoCita,
                    idEstadoUnidad: idEstadoUnidad,
                    grua: grua,
                    fechaCita: fechaCita,
                    comentario: comentario,
                    idZona: idZona,
                    taller: taller
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    };
});
