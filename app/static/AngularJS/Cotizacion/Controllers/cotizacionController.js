// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 28/03/2016
// -- Description: Cotizacion Controller
// -- Modificó: Mario Mejía
// -- Fecha:
// -- =============================================
registrationModule.controller('cotizacionController', function($scope, $route, tallerRepository,$rootScope, userFactory, alertFactory, $routeParams, globalFactory, uploadRepository, localStorageService, cotizacionRepository, cotizacionMailRepository, exampleRepo, uploadRepository, consultaCitasRepository, citaRepository, commonService) {

    $scope.idTaller = '';
    //$scope.idCatalogoTipoOrdenServicio = 0;
    $scope.lstPartidaSeleccionada = [];
    $scope.mostrarTalleres = true;
    $scope.mostrarPartida = false;
    $scope.idTipoCita = 0;
    $scope.especialidad = '2,4'
    $scope.userData = userFactory.getUserData();
    $scope.show_nuevaCotizacion = true;

    $scope.init = function() {

        $scope.idCotizacion = $routeParams.idCotizacion;
        $scope.numeroOrden = $routeParams.orden;
        $scope.estatus = $routeParams.estatus;

        $scope.getTipoOrdenesServicio()
        $scope.mostrarTalleres = true;
        $scope.mostrarPartida = false;
        $scope.getCotizacionDetalle();
        
        //if ($scope.idCotizacion != undefined ) { //LQMA comment 10072017
        if($scope.numeroOrden != undefined) {  //LQMA add 10072017 
            console.log('entro a obtener detalle')
            $scope.getOrdenDetalle();
            
            if ($scope.idCotizacion != undefined ) //LQMA add 10072017
                $scope.show_nuevaCotizacion = false;
        };

    }

    $scope.getTipoOrdenesServicio = function() {
        citaRepository.getTipoOrdenesServicio().then(function(result) {
            $scope.tipoCita = result.data;
        });
    };
    $scope.seleccionarTipoCotizacion = function(obj) {
        $scope.idTipoCita = obj.idTipoCita;
        //$scope.idCatalogoTipoOrdenServicio = obj.idCatalogoTipoOrdenServicio
        $scope.getTalleres()
        $scope.limpiarParametros()
    }

    $scope.getTalleres = function() {
        $('#loadModal').modal('show');
        $('.dataTableTalleres').DataTable().destroy();
        $scope.promise = consultaCitasRepository.getTalleres().then(function(result) {
            if (result.data.length > 0) {

                 if ($scope.idCotizacion != undefined ) {
                    for (var i = 0 ; i < result.data.length; i++) {
                         if (result.data[i].idProveedor == $scope.idTaller) { //LQMA cambio de result.data[i].idTaller a idProveedor
                            $scope.datosTaller = result.data[i];
                         };
                    };
                }else{
                    $scope.totalOrdenes = result.data;
                    globalFactory.minMinDrawDocument("dataTableTalleres", "Talleres");
                }
            }
            $('#loadModal').modal('hide');
        }, function(error) {
            alertFactory.error('No se puenen obtener las órdenes');
            $('#loadModal').modal('hide');
        });
        //LQMA 11072017 add destruye tabla, se repetian datos
        $('.dataTablePartidasTalleres').DataTable().destroy();
        // tallerRepository.getTalleres($scope.idUsuario, $scope.idContratoOperacion, $scope.zonaSelected, $scope.taller, $scope.idServicios.slice(0, -1)).then(function(result) {
        //     $scope.mostrarTabla = true;
        //     $scope.talleres = result.data;
        //     globalFactory.filtrosTabla("talleres", "Talleres", 5);
        // });
    }
        $scope.getCotizacionDetalle = function() {

            consultaCitasRepository.getCotizacionDetalle($scope.idCotizacion, $scope.userData.idUsuario).then(function(result) {

                if (result.data.length > 0) {
                    //$scope.getPartidasTaller(result.data[0].idProveedor)
                    //$scope.idTaller=result.data[0].idProveedor;
                    //LQMA add 14062017
                    $scope.getPartidasTaller(result.data[0].idTaller)
                    $scope.idTaller=result.data[0].idTaller;
                    //////////////////////////////
                    $scope.mostrarTalleres = false;
                    $scope.mostrarPartida = true;
                    $scope.lstPartidaSeleccionada=[];
                    for (var i = 0 ; i < result.data.length; i++) {
                        $scope.lstPartidaSeleccionada.push({
                            idPartida: result.data[i].idPartida,
                            partida: result.data[i].partida,
                            numPartida: result.data[i].noParte,
                            cantidad: result.data[i].cantidad,
                            descripcion: result.data[i].descripcion,
                            costoUnitario: result.data[i].costo,
                            precioUnitario: result.data[i].venta,
                            estatus: 1
                        });
                    }
                    $scope.sumatoriaTotal();
                    $scope.getTalleres();
                }
            }, function(error) {
                alertFactory.error('No se puede obtener los detalles de la orden');
            });
        }

    $scope.getOrdenDetalle = function() {
        consultaCitasRepository.getOrdenDetalle($scope.userData.idUsuario, $scope.numeroOrden).then(function(result) {
            if (result.data.length > 0) {
                $scope.detalleOrden = result.data[0];
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los detalles de la orden');
        });
    }

    $scope.seleccionarTaller = function(obj) {
        $scope.limpiarParametros();
        $scope.datosTaller = obj;
        $scope.getPartidasTaller(obj.idTaller)
        $scope.mostrarTalleres = false;
        $scope.mostrarPartida = true;

    }

    $scope.limpiarParametros = function() {
        $scope.lstPartidaSeleccionada = [];
        $scope.partidasTaller = [];
        $scope.subTotal = 0;
        $scope.ivaSubTotal = 0;
        $scope.total = 0;
        $scope.mostrarTalleres = true;
        $scope.mostrarPartida = false;
        $('.dataTablePartidasSeleccionadas').DataTable().destroy();
    }


    $scope.getPartidasTaller = function(idTaller) {
        var partidas = [];
        $('#loadModal').modal('show');
        $scope.idTaller = idTaller;
        //LQMA 110702017 se comento
        //$('.dataTablePartidasTalleres').DataTable().destroy();
        
        consultaCitasRepository.getPartidasTaller($scope.idTaller, $scope.especialidad, $scope.userData.contratoOperacionSeleccionada).then(function(result) {
            if (result.data.length > 0) {
               //partidas.push(result.data[0]);

               console.log('result.data'); 
               console.log(result.data); 

               /* LQMA 11072017, se comento
                result.data.forEach(function(item) {

                    partidas.forEach(function(item2) {
                      if (item.idPartida != item2.idPartida) {
                        partidas.push(item);
                      };
                    });
                  
                });

                $scope.partidasTaller =partidas;
                */
                $scope.partidasTaller = result.data;    

                //globalFactory.minMinDrawDocument("dataTablePartidasTalleres", "PartidasTalleres");
                globalFactory.filtrosTabla("dataTablePartidasTalleres", "PartidasTalleres", 100);
            }
            $('#loadModal').modal('hide');
        }, function(error) {
            $('#loadModal').modal('hide');
            alertFactory.error('No se puenen obtener las órdenes');
        });

    }

    // $scope.partidaSeleccionada = function(obj) {
    //     $scope.objeto = obj
    //     var existe = 0;
    //     var noExiste = 0;
    //     $scope.subTotal = 0;
    //     $scope.ivaSubTotal = 0;
    //     $scope.total = 0;
    //     if ($scope.lstPartidaSeleccionada.length == 0) {
    //         $scope.lstPartidaSeleccionada.push({
    //             idPartida: $scope.objeto.idPartida,
    //             cantidad: 1,
    //             descripcion : $scope.objeto.descripcion,
    //             precioUnitario: $scope.objeto.precio
    //         });
    //     } else {
    //         for (var i = 0; i < $scope.lstPartidaSeleccionada.length; i++) {
    //             if ($scope.lstPartidaSeleccionada[i].idPartida != $scope.objeto.idPartida) {
    //                 noExiste += 1;
    //             } else {
    //                 $scope.lstPartidaSeleccionada[i].cantidad += 1
    //                 existe += 1;
    //             }
    //         }
    //         if (existe == 0) {
    //             $scope.lstPartidaSeleccionada.push({
    //                 idPartida: $scope.objeto.idPartida,
    //                 cantidad: 1,
    //                 descripcion : $scope.objeto.descripcion,
    //                 costo: $scope.objeto.costo,
    //                 venta: $scope.objeto.venta
    //             });
    //         }
    //     }
    //     $scope.sumatoriaTotal();
    // }

    $scope.slideDown = function() {
        $("#borderTop").slideDown(2000);
    };
    //contrae el div de las tablas
    $scope.slideUp = function() {
        $("#borderTop").slideUp(3000);
    };

    $scope.nuevaCotizacion = function() {
        $('#loadModal').modal('show');
        cotizacionRepository.insCotizacionNueva($scope.idTaller, $scope.userData.idUsuario, 1, $scope.numeroOrden, $scope.idTipoCita).then(function(result) {
                                                //idTaller, idUsuario, idEstatusCotizacion, idOrden,idCatalogoTipoOrdenServicio
            if (result.data[0].idCotizacion > 0) {
                $scope.idCotizacion = result.data[0].idCotizacion;
                $scope.lstPartidaSeleccionada.forEach(function(detalleCotizacion) {
                    cotizacionRepository.inCotizacionDetalle($scope.idCotizacion, detalleCotizacion.precioUnitario, detalleCotizacion.cantidad, detalleCotizacion.precioUnitario, detalleCotizacion.idPartida, detalleCotizacion.estatus).then(function(nuevos) {
                        if (nuevos.data[0].idCotizacionDetalle > 0) {} else {
                        }
                    });
                });
                alertFactory.success('se creo nueva cotización');
                $scope.limpiarParametros();
                $('#loadModal').modal('hide');
                location.href = '/detalle?orden=' + $scope.numeroOrden + '&estatus=' + 2;
            } else {
                $('#loadModal').modal('hide');
                alertFactory.error('No se pudo crear cotización');
                $scope.limpiarParametros();

            }
        }, function(error) {
            $('#loadModal').modal('hide');
            alertFactory.error('No se pudo crear cotización');
            $scope.limpiarParametros();
        });
    }

    $scope.actulizacionDetalle = function (){

        $scope.lstPartidaSeleccionada.forEach(function(detalleCotizacion) {
            cotizacionRepository.inCotizacionDetalle($scope.idCotizacion, detalleCotizacion.precioUnitario, detalleCotizacion.cantidad, detalleCotizacion.precioUnitario, detalleCotizacion.idPartida, detalleCotizacion.estatus).then(function(nuevos) {

                if (nuevos.data[0].idCotizacionDetalle > 0) {
                    alertFactory.success('Se  actulizó la cotización');
                    $scope.limpiarParametros();
                    $('#loadModal').modal('hide');
                    location.href = '/detalle?orden=' + $scope.numeroOrden+ '&estatus=' + $scope.estatus;
                } else {
                }
            }, function(error) {
                alertFactory.error('No se pudo actulizar la cotización');
            });
        });

    }

    $scope.partidaSeleccionada = function(obj) {

        $scope.objeto = obj
        var existe = 0;
        var noExiste = 0;
        $scope.subTotal = 0;
        $scope.ivaSubTotal = 0;
        $scope.total = 0;

        if ($scope.lstPartidaSeleccionada.length == 0) {
            $scope.lstPartidaSeleccionada.push({
                idPartida: $scope.objeto.idPartida,
                partida: $scope.objeto.partida,
                numPartida: $scope.objeto.noParte,
                cantidad: 1,
                descripcion: $scope.objeto.descripcion,
                costoUnitario: $scope.objeto.costo,
                precioUnitario: $scope.objeto.venta,
                estatus: 1
            });
        } else {
            for (var i = 0; i < $scope.lstPartidaSeleccionada.length; i++) {
                if ($scope.lstPartidaSeleccionada[i].idPartida != $scope.objeto.idPartida) {
                    noExiste += 1;
                } else {
                    $scope.lstPartidaSeleccionada[i].cantidad += 1
                    existe += 1;
                }
            }
            if (existe == 0) {
                $scope.lstPartidaSeleccionada.push({
                    idPartida: $scope.objeto.idPartida,
                    partida: $scope.objeto.partida,
                    numPartida: $scope.objeto.noParte,
                    cantidad: 1,
                    descripcion: $scope.objeto.descripcion,
                    costoUnitario: $scope.objeto.costo,
                    precioUnitario: $scope.objeto.venta,
                    estatus: 1
                });
            }
        }
        $scope.sumatoriaTotal();
    };


    $scope.sumatoriaTotal = function() {
        $scope.subTotalPrecio = 0;
        $scope.subTotalCosto = 0;
        $scope.ivaSubTotalPrecio = 0;
        $scope.ivaSubTotalCosto = 0;
        $scope.totalPrecio = 0;
        $scope.totalCosto = 0;
        for (var h = 0; h < $scope.lstPartidaSeleccionada.length; h++) {
            $scope.subTotalPrecio += $scope.lstPartidaSeleccionada[h].cantidad * $scope.lstPartidaSeleccionada[h].precioUnitario;
            $scope.subTotalCosto += $scope.lstPartidaSeleccionada[h].cantidad * $scope.lstPartidaSeleccionada[h].costoUnitario;
        }
        $scope.ivaSubTotalPrecio += $scope.subTotalPrecio * 0.16;
        $scope.ivaSubTotalCosto += $scope.subTotalCosto * 0.16;
        $scope.totalPrecio += $scope.subTotalPrecio + $scope.ivaSubTotalPrecio;
        $scope.totalCosto += $scope.subTotalCosto + $scope.ivaSubTotalCosto;
    };

    // $scope.sumatoriaTotal = function() {
    //     $scope.total = 0;
    //     $scope.subTotal = 0;
    //     $scope.ivaSubTotal = 0;
    //     for (var h = 0; h < $scope.lstPartidaSeleccionada.length; h++) {
    //         $scope.subTotal += $scope.lstPartidaSeleccionada[h].cantidad * $scope.lstPartidaSeleccionada[h].costo
    //     }
    //     $scope.ivaSubTotal += $scope.subTotal * 0.16
    //     $scope.total += $scope.subTotal + $scope.ivaSubTotal
    // }

    $scope.agregarItem = function(obj) {
        for (var h = 0; h < $scope.lstPartidaSeleccionada.length; h++) {
            if ($scope.lstPartidaSeleccionada[h].idPartida == obj.idPartida) {
                $scope.lstPartidaSeleccionada.slice(h, 1, $scope.lstPartidaSeleccionada[h].cantidad += 1)
            }
        }
        $scope.sumatoriaTotal();
    }

    $scope.quitarItem = function(obj) {
        for (var h = 0; h < $scope.lstPartidaSeleccionada.length; h++) {
            if ($scope.lstPartidaSeleccionada[h].idPartida == obj.idPartida) {
                $scope.posicion = h
                if ($scope.lstPartidaSeleccionada[h].cantidad <= 1) {

                    if ($scope.idCotizacion == undefined) {
                        $scope.lstPartidaSeleccionada.splice((h), 1)
                        $scope.sumatoriaTotal();
                    }else{
                       $scope.lstPartidaSeleccionada[h].estatus = 3;
                       $scope.lstPartidaSeleccionada[h].cantidad = 0;
                       $scope.lstPartidaSeleccionada[h].precioUnitario = 0;
                       $scope.lstPartidaSeleccionada[h].costoUnitario = 0;
                       $scope.sumatoriaTotal();
                    }
                } else {
                    $scope.lstPartidaSeleccionada.slice(h, 1, $scope.lstPartidaSeleccionada[h].cantidad -= 1)
                    $scope.sumatoriaTotal();
                }
            }
        }
    }
    $scope.eliminar = function() {
        swal({
            title: "¿Quieres eliminar la partida?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si",
            closeOnConfirm: false
        }, function(isConfirm) {
            if (isConfirm) {
                $scope.respuesta = 1
                    // break;
                swal("Exito!", "Registro Eliminado", "success");
            } else {
                swal("Cancelado", "Se cancelo eliminación", "error");
                $scope.respuesta = 2
            }
        });
    }

    $scope.mostrarDetallesPartida = function(obj) {

    }


});
