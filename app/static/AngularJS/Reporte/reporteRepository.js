var loginUrl = global_settings.urlCORS + '/api/reporte/';

registrationModule.factory('reporteRepository', function ($http) {
    return {        
        reporteGral: function () {
            return $http({
                url: searchUrl + 'reporteGral',
                method: "GET"
            });
        },
    };
});