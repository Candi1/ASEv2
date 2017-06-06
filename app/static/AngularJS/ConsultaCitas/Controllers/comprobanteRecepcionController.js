registrationModule.controller('comprobanteRecepcionController', function($scope, $route, $modal, $rootScope, $routeParams, localStorageService, alertFactory, globalFactory, consultaCitasRepository, ordenServicioRepository, cotizacionRepository, trabajoRepository, uploadRepository) {
   

    $scope.numeroOrden = $routeParams.orden;
    $scope.validateAprobacion = true;
    $scope.init = function() {
        // $scope.infoCita = localStorageService.get('cita');
        // $scope.show_exteriores = true;
        // $scope.show_interiores = false;
        // $scope.show_accesorios = false;
        // $scope.show_componentes = false;
        // $scope.show_documentos = false;
        // $scope.show_tablero = false;
        // $scope.show_unidad = false;
        // $scope.ubi_Delantera = false;
        // $scope.ubi_Trasera = false;
        // $scope.ubi_ParteDerecha = false;
        // $scope.ubi_ParteIzquierda = false;
        // $scope.ubi_Techo = false;
        $scope.getdatosComprobante(1)
        $scope.getOrdenDetalle(1, $scope.numeroOrden)
    };


    $scope.getdatosComprobante = function(idTipoUnidad) {
        consultaCitasRepository.getdatosComprobante(idTipoUnidad).then(function(result) {
            if (result.data.success == true) {
                $scope.modulosComprobante = result.data.data;
            } else {
                alertFactory.error('No pueden mostrar los registros para el comprobante de recipción');
            }
        }, function(error) {
            alertFactory.error(result.msg);
        });
    }


    $scope.getOrdenDetalle = function(idUsuario, orden) {
        consultaCitasRepository.getOrdenDetalle(idUsuario, orden).then(function(result) {
            if (result.data.length > 0) {
                $scope.detalleOrden = result.data[0];
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los detalles de la orden');
        });
    }

    $scope.menu = function(data) {
        $scope.show_exteriores = false;
        $scope.show_interiores = false;
        $scope.show_accesorios = false;
        $scope.show_componentes = false;
        $scope.show_documentos = false;
        $scope.show_tablero = false;
        $scope.show_unidad = false;
        switch (data) {
            case 0:
                $scope.show_exteriores = true;
                break;

            case 1:
                $scope.show_interiores = true;
                break;

            case 2:
                $scope.show_accesorios = true;
                break;

            case 3:
                $scope.show_componentes = true;
                break;

            case 4:
                $scope.show_documentos = true;
                break;

            case 5:
                $scope.show_tablero = true;
                break;

            case 6:
                $scope.show_unidad = true;
                break;
        }
    }

    $scope.addComprobanteRecepcion = function(obj) {
        var contador = 0;
        var contadorTotal = 0;
        angular.forEach(obj, function(value, key) {
            contadorTotal += value.detalle.length
            angular.forEach(value.detalle, function(value2, key) {
                if (value2.select == 0 || value2.select == 1)
                    contador++
            });
        });
        if ((contadorTotal) - 2 == contador) {
            console.log('todo validado' + contador + ' total ' + contadorTotal)
            $scope.validateAprobacion = false;

        } else {
            console.log('faltan campos' + contador + ' total ' + contadorTotal)
        }

    }

    $scope.nuevoComprobanteRecepcion = function(obj) {
        console.log(obj)
        $scope.numeroComprobanteRecepcion = 0;
        angular.forEach(obj, function(value, key) {
            console.log(value.idCatalogoModuloComprobante)
            consultaCitasRepository.agregarModuloComprobante(value.idCatalogoModuloComprobante, $scope.numeroOrden).then(function(result) {
                $scope.moduloComprobante = result.data[0].idModuloComprobante;
                if (result.data[0].idModuloComprobante > 0) {
                    $scope.idModuloComprobante = result.data[0].idModuloComprobante;
                    angular.forEach(value.detalle, function(value2, key) {
                        console.log(value2.idCatalogoDetalleModuloComprobante)
                        consultaCitasRepository.agregarDetalleModuloComprobante(value2.select, value2.idCatalogoDetalleModuloComprobante, $scope.idModuloComprobante, value2.selectTxt).then(function(result) {
                            $scope.numeroComprobanteRecepcion = $scope.numeroComprobanteRecepcion + 1;
                            if($scope.numeroComprobanteRecepcion == 1){
                              $scope.comprobanteRecepcion();  
                            }    
                            if (result.data[0].idDetalleModuloComprobante > 0) {
                                console.log('detalle agregado')
                            } else {
                                console.log('error')
                            }
                        });
                    });
                } else {
                    console.log('error')
                }
            });    
            setTimeout(function () {
              location.href = '/detalle?orden=' + $scope.numeroOrden +'&estatus='+1;
             }, 8000); 
        });
    }

    $scope.comprobanteRecepcion = function() {
            consultaCitasRepository.getDatosRecepcion().then(function(result) {
                if (result.data.length > 0) {
                var data = {
                    "DatosUnidad": 
                        {
                        "ext_Claxon": result.data[0].accion,
                        "ext_TaponGasolina": result.data[1].accion,
                        "ext_TaponLlantas": result.data[2].accion,
                        "ext_FarosDelanteros": result.data[3].accion,
                        "ext_Antena": result.data[4].accion,
                        "ext_Emblemas": result.data[5].accion,
                        "ext_Cristales": result.data[6].accion,
                        "int_EspejoRetrovisor": result.data[7].accion,
                        "int_Radio": result.data[8].accion,
                        "int_CinturonSeguridad": result.data[9].accion,
                        "int_ManijasSeguros": result.data[10].accion,
                        "int_Tapetes": result.data[11].accion,
                        "int_Ac": result.data[12].accion,
                        "int_BolsaAireDelantera": result.data[13].accion,
                        "int_BolsaAireLateral": result.data[14].accion,
                        "int_LlavesUnidad": result.data[15].accion,
                        "acs_Reflejantes": result.data[16].accion,
                        "acs_Extintor": result.data[17].accion,
                        "acs_LlantaRefaccion": result.data[18].accion,
                        "acs_CableCorriente": result.data[19].accion,
                        "acs_PeliculaAntiasalto": result.data[20].accion,
                        "com_TaponAceite": result.data[21].accion,
                        "com_TaponRadiador": result.data[22].accion,
                        "com_VarillaAceite": result.data[23].accion,
                        "com_Bateria": result.data[24].accion,
                        "com_TaponMotor": result.data[25].accion,
                        "doc_PolizaSeguro": result.data[26].accion,
                        "doc_TarjetaCirculacion": result.data[27].accion,
                        "tab_Descripcion": result.data[28].descripcion,
                        "tab_Odometro": result.data[29].descripcion

                        }
                    }   
                }   
   
                    var jsonData = {
                        "template": {
                            "name": "ASEUnidad_rpt" 
                        },
                        "data": data
                    }

                consultaCitasRepository.callExternalPdf(jsonData).then(function (result) {               
                    setTimeout(function () {
                          var url = $rootScope.vIpServer + result.data;
                          var a = document.createElement('a');
                          a.href = url;
                          a.download = 'ComprobanteRecepcion';
                          a.click();
                     }, 5000);                          
                });
            });
        }
    // $scope.changeDesc = function(data, esttus) {
    //     if (!esttus) {
    //         switch (data) {
    //             case 'delantera':
    //                 $scope.ubi_DelanteraDesc = '';
    //                 break;
    //             case 'trasera':
    //                 $scope.ubi_TraseraDesc = '';
    //                 break;
    //             case 'derecha':
    //                 $scope.ubi_ParteDerechaDesc = '';
    //                 break;
    //             case 'izquierda':
    //                 $scope.ubi_ParteIzquierdaDesc = '';
    //                 break;
    //             case 'techo':
    //                 $scope.ubi_TechoDesc = '';
    //                 break;
    //         }
    //     }
    // };
    // $scope.addComprobanteRecepcion = function() {
    //     var data = {};
    //     if (!$scope.acepta) {
    //         alertFactory.info("Debe Aceptar las Condiciones.");
    //     } else {
    //         $scope.class_buttonCeritficado = 'fa fa-spinner fa-spin';
    //         data.ext_Claxon = $scope.ext_Claxon;
    //         data.ext_TaponGasolina = $scope.ext_TaponGasolina;
    //         data.ext_TaponLlantas = $scope.ext_TaponLlantas;
    //         data.ext_FarosDelanteros = $scope.ext_FarosDelanteros;
    //         data.ext_Antena = $scope.ext_Antena;
    //         data.ext_Emblemas = $scope.ext_Emblemas;
    //         data.ext_Cristales = $scope.ext_Cristales;
    //         data.int_EspejoRetrovisor = $scope.int_EspejoRetrovisor;
    //         data.int_Radio = $scope.int_Radio;
    //         data.int_CinturonSeguridad = $scope.int_CinturonSeguridad;
    //         data.int_ManijasSeguros = $scope.int_ManijasSeguros;
    //         data.int_Tapetes = $scope.int_Tapetes;
    //         data.int_Ac = $scope.int_Ac;
    //         data.int_BolsaAireDelantera = $scope.int_BolsaAireDelantera;
    //         data.int_BolsaAireLateral = $scope.int_BolsaAireLateral;
    //         data.int_LlavesUnidad = $scope.int_LlavesUnidad;
    //         data.acs_Reflejantes = $scope.acs_Reflejantes;
    //         data.acs_Extintor = $scope.acs_Extintor;
    //         data.acs_LlantaRefaccion = $scope.acs_LlantaRefaccion;
    //         data.acs_CableCorriente = $scope.acs_CableCorriente;
    //         data.acs_PeliculaAntiasalto = $scope.acs_PeliculaAntiasalto;
    //         data.com_TaponAceite = $scope.com_TaponAceite;
    //         data.com_TaponRadiador = $scope.com_TaponRadiador;
    //         data.com_VarillaAceite = $scope.com_VarillaAceite;
    //         data.com_Bateria = $scope.com_Bateria;
    //         data.com_TaponMotor = $scope.com_TaponMotor;
    //         data.doc_PolizaSeguro = $scope.doc_PolizaSeguro;
    //         data.doc_TarjetaCirculacion = $scope.doc_TarjetaCirculacion;
    //         data.tab_Descripcion = $scope.tab_Descripcion;
    //         data.tab_Odometro = $scope.tab_Odometro;
    //         data.ubi_DelanteraDesc = $scope.ubi_DelanteraDesc;
    //         data.ubi_TraseraDesc = $scope.ubi_TraseraDesc;
    //         data.ubi_ParteDerechaDesc = $scope.ubi_ParteDerechaDesc;
    //         data.ubi_ParteIzquierdaDesc = $scope.ubi_ParteIzquierdaDesc;
    //         data.ubi_TechoDesc = $scope.ubi_TechoDesc;
    //         data.aprobacion = 1;
    //         data.idCita = $scope.infoCita.idCita;
    //         data.idUsuario = $scope.userData.idUsuario;

    //         if ($scope.ubi_Techo) {
    //             data.ubi_Techo = 1;
    //         } else {
    //             data.ubi_Techo = 0;
    //         }

    //         if ($scope.ubi_Delantera) {
    //             data.ubi_Delantera = 1;
    //         } else {
    //             data.ubi_Delantera = 0;
    //         }

    //         if ($scope.ubi_Trasera) {
    //             data.ubi_Trasera = 1;
    //         } else {
    //             data.ubi_Trasera = 0;
    //         }

    //         if ($scope.ubi_ParteDerecha) {
    //             data.ubi_ParteDerecha = 1;
    //         } else {
    //             data.ubi_ParteDerecha = 0;
    //         }

    //         if ($scope.ubi_ParteIzquierda) {
    //             data.ubi_ParteIzquierda = 1;
    //         } else {
    //             data.ubi_ParteIzquierda = 0;
    //         }
    //         consultaCitasRepository.addComprobanteRecepcion(data).then(function(rest) {
    //             if (rest.data[0].id > 0) {
    //                 $scope.updateEstatusTrabajo();
    //             } else {
    //                 alertFactory.error("Error al insertar datos");
    //             }
    //         }, function(error) {
    //             alertFactory.error("Error al insertar datos");
    //         });
    //     }
    // };
    // //comprobante recepción cargada
    // $scope.updateEstatusTrabajo = function() {
    //     trabajoRepository.insertTrabajo($scope.infoCita.idCita, $scope.userData.idUsuario, $scope.infoCita.idUnidad)
    //         .then(function(trabajo) {
    //             $scope.idTrabajoNew = trabajo.data[0].idTrabajo;
    //             $scope.generarPdfdata();
    //         }, function(error) {
    //             alertFactory.error("Error al insertar el trabajo");
    //         });
    // };
    // $scope.dzMethods = {};
    // $scope.validateAprobacion = function() {
    //     if ($scope.ext_Claxon != undefined && $scope.ext_TaponGasolina != undefined && $scope.ext_TaponLlantas != undefined && $scope.ext_FarosDelanteros != undefined && $scope.ext_Antena != undefined && $scope.ext_Emblemas != undefined && $scope.ext_Cristales != undefined && $scope.int_EspejoRetrovisor != undefined && $scope.int_Radio != undefined && $scope.int_CinturonSeguridad != undefined && $scope.int_ManijasSeguros != undefined && $scope.int_Tapetes != undefined && $scope.int_Ac != undefined && $scope.int_BolsaAireDelantera != undefined && $scope.int_BolsaAireLateral != undefined && $scope.int_LlavesUnidad != undefined && $scope.acs_Reflejantes != undefined && $scope.acs_Extintor != undefined && $scope.acs_LlantaRefaccion != undefined && $scope.acs_CableCorriente != undefined && $scope.acs_PeliculaAntiasalto != undefined && $scope.com_TaponAceite != undefined && $scope.com_TaponRadiador != undefined && $scope.com_VarillaAceite != undefined && $scope.com_Bateria != undefined && $scope.com_TaponMotor != undefined && $scope.doc_PolizaSeguro != undefined && $scope.doc_TarjetaCirculacion != undefined && $scope.tab_Descripcion != undefined && $scope.tab_Odometro != undefined && $scope.tab_Descripcion != '' && $scope.tab_Odometro != '') {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // };
    // //////////////////////////////////////////////////////////////////////////////////////////////////
    // //    Manda a Generar el PDF ultima version (03/feb/2017)
    // //////////////////////////////////////////////////////////////////////////////////////////////////
    // $scope.generarPdfdata = function() {
    //     consultaCitasRepository.getGeneraPdf($scope.infoCita.idCita).then(function(result) {
    //         if (result.data.length > 0) {
    //             var data = {
    //                 "DatosUnidad": {
    //                     "ext_Claxon": result.data[0].ext_Claxon,
    //                     "ext_TaponGasolina": result.data[0].ext_TaponGasolina,
    //                     "ext_TaponLlantas": result.data[0].ext_TaponLlantas,
    //                     "ext_FarosDelanteros": result.data[0].ext_FarosDelanteros,
    //                     "ext_Antena": result.data[0].ext_Antena,
    //                     "ext_Emblemas": result.data[0].ext_Emblemas,
    //                     "ext_Cristales": result.data[0].ext_Cristales,
    //                     "int_EspejoRetrovisor": result.data[0].int_EspejoRetrovisor,
    //                     "int_Radio": result.data[0].int_Radio,
    //                     "int_CinturonSeguridad": result.data[0].int_CinturonSeguridad,
    //                     "int_ManijasSeguros": result.data[0].int_ManijasSeguros,
    //                     "int_Tapetes": result.data[0].int_Tapetes,
    //                     "int_Ac": result.data[0].int_Ac,
    //                     "int_BolsaAireDelantera": result.data[0].int_BolsaAireDelantera,
    //                     "int_BolsaAireLateral": result.data[0].int_BolsaAireLateral,
    //                     "int_LlavesUnidad": result.data[0].int_LlavesUnidad,
    //                     "acs_Reflejantes": result.data[0].acs_Reflejantes,
    //                     "acs_Extintor": result.data[0].acs_Extintor,
    //                     "acs_LlantaRefaccion": result.data[0].acs_LlantaRefaccion,
    //                     "acs_CableCorriente": result.data[0].acs_CableCorriente,
    //                     "acs_PeliculaAntiasalto": result.data[0].acs_PeliculaAntiasalto,
    //                     "com_TaponAceite": result.data[0].com_TaponAceite,
    //                     "com_TaponRadiador": result.data[0].com_TaponRadiador,
    //                     "com_VarillaAceite": result.data[0].com_VarillaAceite,
    //                     "com_Bateria": result.data[0].com_Bateria,
    //                     "com_TaponMotor": result.data[0].com_TaponMotor,
    //                     "doc_PolizaSeguro": result.data[0].doc_PolizaSeguro,
    //                     "doc_TarjetaCirculacion": result.data[0].doc_TarjetaCirculacion,
    //                     "ubi_Delantera": result.data[0].ubi_Delantera,
    //                     "ubi_DelanteraDesc": result.data[0].ubi_DelanteraDesc,
    //                     "ubi_Trasera": result.data[0].ubi_Trasera,
    //                     "ubi_TraseraDesc": result.data[0].ubi_TraseraDesc,
    //                     "ubi_ParteDerecha": result.data[0].ubi_ParteDerecha,
    //                     "ubi_ParteDerechaDesc": result.data[0].ubi_ParteDerechaDesc,
    //                     "ubi_ParteIzquierda": result.data[0].ubi_ParteIzquierda,
    //                     "ubi_ParteIzquierdaDesc": result.data[0].ubi_ParteIzquierdaDesc,
    //                     "ubi_Techo": result.data[0].ubi_Techo,
    //                     "ubi_TechoDesc": result.data[0].ubi_TechoDesc,
    //                     "tab_Descripcion": result.data[0].tab_Descripcion,
    //                     "tab_Odometro": result.data[0].tab_Odometro,
    //                     "aprobacion": result.data[0].aprobacion,
    //                     "nombreCompleto": result.data[0].nombreCompleto,
    //                     "fecha": result.data[0].fecha,
    //                     "idTrabajo": result.data[0].idTrabajo
    //                 },
    //                 "Taller": {
    //                     "idTaller": result.data[0].idTaller,
    //                     "GAR": result.data[0].GAR,
    //                     "TAD": result.data[0].TAR,
    //                     "ciudad": result.data[0].ciudad,
    //                     "razonSocial": result.data[0].razonSocial,
    //                     "idTAR": result.data[0].idTAR,
    //                     "idProveedor": result.data[0].idTaller,
    //                 },
    //                 "unidad": {
    //                     "idUnidad": result.data[0].idUnidad,
    //                     "idLicitacion": result.data[0].idLicitacion,
    //                     "numEconomico": result.data[0].numEconomico,
    //                     "modelo": result.data[0].modelo,
    //                     "clienteNumInventario": result.data[0].clienteNumInventario,
    //                     "numTAR": result.data[0].numTAR,
    //                     "TAR": result.data[0].TAR,
    //                     "GAR": result.data[0].GAR,
    //                     "ubicacion": result.data[0].ubicacion,
    //                     "oper_pdes": result.data[0].oper_pdes,
    //                     "marca": result.data[0].marca,
    //                     "modeloMarca": result.data[0].modeloMarca,
    //                     "motor": result.data[0].motor,
    //                     "capacidadLts": result.data[0].capacidadLts,
    //                     "idTar": result.data[0].idTar
    //                 }
    //             }
    //         }
    //         var jsonData = {
    //             "template": {
    //                 "name": "talleresUnidad_rpt"
    //             },
    //             "data": data
    //         }
    //         consultaCitasRepository.callExternalPdf(jsonData).then(function(result) {
    //             setTimeout(function() {
    //                 var url = $rootScope.vIpServer + result.data;
    //                 var a = document.createElement('a');
    //                 a.href = url;
    //                 a.download = 'ComprobanteRecepción';
    //                 //a.target = '_blank';
    //                 a.click();

    //                 location.href = '/tallercita';
    //             }, 5000);
    //         });

    //     }, function(error) {
    //         alertFactory.error("Error al insertar datos");
    //     });
    // };

});
