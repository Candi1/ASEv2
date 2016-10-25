registrationModule.controller('ordenPorCobrarController', function ($scope, localStorageService, alertFactory, ordenPorCobrarRepository, $rootScope, uploadRepository, ordenServicioRepository) {

    $scope.message = "Buscando...";
    $scope.userData = localStorageService.get('userData');
    $scope.stories= [];

    $scope.init = function () {
        Dropzone.autoDiscover = false;
        $scope.dzOptionsOrdenCobrar = uploadRepository.getDzOptions("application/pdf,text/xml", 2);
        $scope.fecha = '';

        if ($scope.userData.idTipoUsuario == 1 || $scope.userData.idTipoUsuario == 2) {
            $scope.preFacturas();
        }
        if ($scope.userData.idTipoUsuario == 1) {
            $scope.getCopades();
        }
        $scope.limpiaFecha();
        $scope.cleanDatos();
        $scope.getOrdenesPorCobrar(); 
    }

    //Carga Adenda y Copade
    $scope.subir = function (idTrabajo) {
        $('#subirAdenda').appendTo('body').modal('show');
        $scope.idTrabajo = idTrabajo;
    }

    $scope.removePieza = function (idItem) {
            $scope.listaPiezas.forEach(function (p, i) {
                if (p.idItem == idItem) {
                    if (p.cantidad > 1) {
                        $scope.listaPiezas[i].cantidad = p.cantidad - 1;
                    } else {
                        $scope.listaPiezas.splice(i, 1);
                    }
                }
            })
        }
        //Inserta a historial proceso y Asocia DatosCopadeOrden
    $scope.trabajoCobrado = function (idTrabajo, idDatosCopade) {
        $('.dataTableOrdenesPorCobrar').DataTable().destroy();
        ordenPorCobrarRepository.putTrabajoCobrado(idTrabajo, idDatosCopade).then(function (result) {
            if (result.data.length > 0) {
                alertFactory.success('Trabajo cobrado exitosamente');
            } else {
                alertFactory.info('No se pudo actualizar el trabajo cobrado');
            }
        }, function (error) {
            alertFactory.error("Error al actualizar el trabajo cobrado");
        });
    }

    //Visualiza la órden de servicio
    $scope.aprobarTrabajo = function (orden, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = orden.idCita;
        localStorageService.set('objTrabajo', orden);
        localStorageService.set("botonera", objBotonera);
        location.href = '/ordenservicio';
    }

    $scope.preFacturas = function () {
        var sumatoria= 0;
        $('.dataTablePreFacturas').DataTable().destroy();
        ordenPorCobrarRepository.getPreFacturas().then(function (result) {
            if (result.data.length > 0) {
                $scope.facturas = result.data;
                for(var i=0;i<result.data.length;i++){
                    sumatoria += parseFloat(result.data[i].montoOrden);
                };
                $scope.sumatoriaPrefactura=sumatoria;
                waitDrawDocument("dataTablePreFacturas");
            } else {
                alertFactory.info('No se encontraron trabajos por cobrar');
            }
        }, function (error) {
            alertFactory.error("Error al obtener trabajos por cobrar");
        });
    }

    $scope.generaTXT = function (idTrabajo, numeroTrabajo) {
        ordenPorCobrarRepository.getGeneraTXT(idTrabajo).then(function (result) {
            if (result.data.length > 0) {
                alertFactory.success("PreFactura generada correctamente!");
                $scope.downloadFile($rootScope.vIpServer + '/facturas/factura-' + numeroTrabajo + '.txt')
            } else {
                alertFactory.info('No existe la factura.xml');
            }
        }, function (error) {
            alertFactory.error("Error al generar la prefactura");
        });
    }
    $('#fechaTrabajo .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });
    //Muestra la captura de la fecha
    $scope.fechaRecepcibeCopade = function () {
            $('#finalizarTrabajoModal').appendTo("body").modal('show');
        }
        //Guardamos la fecha capturable de la copade
    $scope.saveFecha = function () {
        if ($scope.fechaRecepcionCopade != '') {
            $('#finalizarTrabajoModal').modal('hide');
        } else {
            alertFactory.info('Debe ingresar una fecha');
        }
    }

    $scope.limpiaFecha = function () {
        $scope.fechaRecepcionCopade = '';
    }

    $('.clockpicker').clockpicker();

    $scope.downloadFile = function (downloadPath) {
        window.open(downloadPath, '_blank', 'Factura');
    }

    //Se realiza la carga de archivos
    //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function (file, xhr, formData) {
            formData.append('idTrabajo', $scope.idTrabajo);
            formData.append('idCotizacion', 0);
            formData.append('idCategoria', 3);
            formData.append('idNombreEspecial', 0); //adencaCopade
            formData.append('idDatosCopade', 1);
        },
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if (!checkErrorFile) {
                var allSuccess = file.every(checkAllSuccess);
                if (allSuccess) {
                    var nombreCopades = [];
                    file.forEach(function (archivo) {
                        nombreCopades.push(archivo.name);
                    });
                    ordenPorCobrarRepository.putGeneraDatosCopade(nombreCopades, $scope.fechaRecepcionCopade).then(function (result) {
                        if (result.data.length > 0) {
                            ordenPorCobrarRepository.putInsertaDatosCopade(result.data).then(function (resp) {
                                if (resp.data.length > 0) {
                                    ordenPorCobrarRepository.putRenombraCopade(nombreCopades, resp.data).then(function (respuesta) {
                                        if (respuesta.data > 0) {
                                            alertFactory.success('Copade cargada satisfactoriamente');
                                            $scope.limpiaFecha();
                                            $scope.cleanDatos();
                                            $scope.getCopades();
                                        }
                                    }, function (error) {
                                        alertFactory.error('No se pudo cargar la copade');
                                    });
                                } else {
                                    alertFactory.error('No se pudieron extraer los datos de la copade');
                                }            
                            }, function (error) {
                                alertFactory.error(error);            
                            }); 
                        } else {
                            alertFactory.error('No se pudo procesar la copade');
                        }                     
                    }, function (error) {
                        alertFactory.error(error);          
                    });
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles(true);
                        $('#subirAdenda').appendTo('body').modal('hide');
                    }, 1000);
                }
            }
        },
        'error': function (file, xhr) {
            if (!file.accepted) {
                $scope.dzMethods.removeFile(file);
            } else {
                $scope.dzMethods.removeAllFiles(true);
                alertFactory.info("No se pudieron subir los archivos");
            }
        },
    };

    //valida si todos son success
    function checkAllSuccess(file, index, array) {
        return file.status === 'success';
    }

    //valida si existe algún error
    function checkExistsError(file) {
        return file.status === 'error';
    }

    //Devuelve las copades pendientes por asignar
    $scope.getCopades = function () {
        var sumatoria = 0;
        $('.dataTableCopades').DataTable().destroy();
        ordenPorCobrarRepository.getCopades().then(function (result) {
            if (result.data.length > 0) {
                $scope.copades = result.data;
                 for(var i=0;i<result.data.length;i++){
                    sumatoria += parseFloat(result.data[i].subTotal);
                };
                $scope.sumatoriaCOPADE=sumatoria;
                waitDrawDocument("dataTableCopades");
            } else {
                alertFactory.info('No se encontró ninguna COPADE');
            }
        }, function (error) {
            alertFactory.error("Error al obtener las COPADES" + error);
        });
    }

    //Busqueda de las mejores coincidencias para los datos Copade
    $scope.buscaCoincidencia = function (idDatosCopade) {
        $('.dataTableCoincidencia').DataTable().destroy();
        $('.dataTableOrdenesPorCobrar').DataTable().destroy();
        $scope.ordenes = [];
        $scope.coincidencia = [];
        $scope.copades.forEach(function (p, i) {
            if (p.idDatosCopade == idDatosCopade) {
                $scope.folio = $scope.copades[i].ordenSurtimiento;
                $scope.monto = $scope.copades[i].subTotal;
                $scope.numeroCopade = $scope.copades[i].numeroCopade;
                $scope.numeroCopade == null ? $scope.numeroCopade = 'S/N COPADE' : $scope.copades[i].numeroCopade;
                $scope.fechacarga = $scope.copades[i].fechaCarga;
                $scope.fecharecepcion = $scope.copades[i].fechaRecepcionCopade;
                $scope.numeroestimacion = $scope.copades[i].numeroEstimacion;

                $scope.idDatosDeCopade = $scope.copades[i].idDatosCopade;
                ordenPorCobrarRepository.getMejorCoincidencia($scope.folio, $scope.monto).then(function (result) {
                    $scope.coincidencia = result.data;
                    $scope.trabajos=[];
                    $('#mejorCoincidencia').modal('show');
                    setTimeout(function () {
                        $('.dataTableCoincidencia').DataTable();
                    }, 1500);
                }, function (error) {
                    alertFactory.error("Error al obtener las COPADE");
                });
                ordenPorCobrarRepository.getOrdenesPorCobrar($scope.monto).then(function (result) {
                    $scope.ordenes = result.data;
                    setTimeout(function () {
                        $('.dataTableOrdenesPorCobrar').DataTable();
                    }, 1500);
                }, function (error) {
                    alertFactory.error("No se pudieron obtener las órdenes por cobrar");
                });

            }
        });
    }

    //Selecciona una orden en Radio y obtiene idTrabajo
    $scope.seleccionMejorCoincidencia = function (idTrabajo, montoOrdenSeleccionado, numeroTrabajo) {
        
        $scope.idDeTrabajo = idTrabajo;
        $scope.montoOrdenSeleccionado = montoOrdenSeleccionado;
        $scope.numeroDeTrabajo = numeroTrabajo;
    }

    //Asociamos un idtrabajo con DatosCopade
    $scope.asociarCopade = function () {
         
        ordenServicioRepository.getOrdenServicio($scope.numeroDeTrabajo).then(function (result) {
            if (result.data.length > 0) {

                if(validaMontoCapadeOrden($scope.montoOrdenSeleccionado)){
                    if ($scope.idDeTrabajo != '') {
                        $('.btnTerminarTrabajo').ready(function () {
                            swal({
                                    title: "¿Esta seguro en asociar esta copade con la orden de servicio selecionado?",
                                    text: "Se cambiará el estatus a 'Cobrado'",
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#65BD10",
                                    confirmButtonText: "Si",
                                    cancelButtonText: "No",
                                    closeOnConfirm: false,
                                    closeOnCancel: false
                                },
                                function (isConfirm) {
                                    if (isConfirm) {
                                        $scope.trabajoCobrado($scope.idDeTrabajo, $scope.idDatosDeCopade);
                                        ordenPorCobrarRepository.putMueveCopade($scope.idDeTrabajo, $scope.idDatosDeCopade).then(function (resp) {
                                            if (resp.data > 0) {
                                                alertFactory.success('La copade se copio correctamente');
                                            }
                                        }, function (error) {
                                            alertFactory.error('La copade no se pudo depositar en su carpeta');
                                        });
                                        $scope.cleanDatos();
                                        swal("Trabajo terminado!", "La copade se ha asociada", "success");
                                        location.href = '/ordenesporcobrar';
                                    } else {
                                        swal("Copade no asociada", "", "error");
                                        $scope.cleanDatos();
                                        $('#finalizarTrabajoModal').modal('hide');
                                    }
                                });
                        });
                    } else {
                        alertFactory.error("Debe seleccionar una orden de servicio");
                    }   
                }
                else{
                    alertFactory.error("El monto de la orden seleccionada rebasa el rango especificado de (+- $1.00 MXN), seleccione una orden que se adecúe con el monto de la COPADE");
                }

            }else{

                swal({
                    title: "Advertencia",
                    text: "No se ha creado la provisión de esta orden.",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#67BF11",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                });
            }
         }, function (error) {
            alertFactory.error("Error al verificar la orden");
        });     


        
    }

    //Limpiamos campos idTrabajo
    $scope.cleanDatos = function () {
        $scope.idDeTrabajo = '';
    }

     //Devuelve las copades pendientes por asignar
    $scope.getOrdenesPorCobrar = function () {
        var sumatoria= 0;
        $('.dataTableOrdenesVerificadas').DataTable().destroy();
        ordenPorCobrarRepository.getOrdenesVerificadas().then(function (result) {
            if (result.data.length > 0) {
                $scope.verificadas = result.data;
                 for(var i=0;i<result.data.length;i++){
                    sumatoria += parseFloat(result.data[i].montoOrden);
                };
                $scope.sumatoriaOrdenes=sumatoria;
                waitDrawDocument("dataTableOrdenesVerificadas");
            } else {
                alertFactory.info('No se encontró ninguna Orden Verificada');
            }
        }, function (error) {
            alertFactory.error("Error al obtener las Ordenes" + error);
        });
    }

    //valida (+-)1 del monto de la copa contrar la orden seleccionada
    var validaMontoCapadeOrden = function(montoOrdenSeleccionado){
        if($scope.monto != null && $scope.monto != '' && $scope.monto > 0){
            var resultado = montoOrdenSeleccionado >= $scope.monto ? (montoOrdenSeleccionado - $scope.monto) : ($scope.monto - montoOrdenSeleccionado);
            if(resultado >= 0 && resultado <= 10)
                return true;
            else
                return false;
        }
    }
});

   //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    {
                        extend: 'excel',
                        title: 'OrdenporCobrar'
                    },
                    {
                        extend: 'print',
                        customize: function (win) {
                            $(win.document.body).addClass('white-bg');
                            $(win.document.body).css('font-size', '10px');

                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                        }
                    }
                ]
            });
        }, 2500);
    }