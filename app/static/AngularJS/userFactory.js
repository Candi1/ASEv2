registrationModule.factory('userFactory', function(localStorageService, loginRepository, alertFactory) {
  return{
    getUserData: function(){
      return (localStorageService.get('userData'));
    },
    saveUserData: function(userData){
      localStorageService.set('userData',userData);
      return (localStorageService.get('userData'));
    },
    updateSelectedOperation: function(data){
      var userData = localStorageService.get('userData');

      for (var i = 0; i < userData.Operaciones.length; i++) {
        if(userData.Operaciones[i].idContratoOperacion == data){
          ObjetoOperacionSelected = userData.Operaciones[i];
        }
      }

      userData.contratoOperacionSeleccionada = ObjetoOperacionSelected.idContratoOperacion;
      userData.idOperacion = ObjetoOperacionSelected.idOp;
      userData.nombreOperacion = ObjetoOperacionSelected.nombreOperacion;
      userData.manejoUtilidad = ObjetoOperacionSelected.manejoUtilidad;
      userData.porcentajeUtilidad = ObjetoOperacionSelected.porcentajeUtilidad;
      userData.presupuesto = ObjetoOperacionSelected.presupuesto;
      userData.geolocalizacion = ObjetoOperacionSelected.geolocalizacion;
      userData.tiempoAsignado = ObjetoOperacionSelected.tiempoAsignado;
      userData.Modulos = ObjetoOperacionSelected.modulos;
      userData.idRol = ObjetoOperacionSelected.idRol;
      userData.Rol = ObjetoOperacionSelected.nombreRol;

      localStorageService.set('userData', userData);
      return (localStorageService.get('userData'));
    },
    logOut: function(){
      localStorageService.clearAll();
    }
  }
});
