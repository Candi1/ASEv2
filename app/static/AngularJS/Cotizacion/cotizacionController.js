// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 28/03/2016
// -- Description: Cotizacion Controller
// -- Modificó: Mario Mejía
// -- Fecha: 
// -- =============================================
registrationModule.controller('cotizacionController', function ($scope, $rootScope, alertFactory, localStorageService, cotizacionRepository, cotizacionMailRepository, exampleRepo, uploadRepository, citaRepository) {
    $scope.arrayItem = [];
    $scope.arrayCambios = [];
    var valor = '';
    var id = 0;
    var idItem = 0;
    var existItem = null;
    var idCotizacion = 0;
    var obs = '';
    var ext = '';
    var type = '';
    var idTrabajo = 0;
    var idTaller = 0;
    var idUnidad = 0;
    var tipoEvidencia = 2; //Cotización
    $scope.editar = 0;
    $scope.total = 0;
    $scope.importe = 0;
    $scope.message = 'Buscando...';
    $scope.numEconomico = '';
    $scope.modeloMarca = '';
    $scope.trabajo = '';
    $scope.idCita = '';
    $scope.idTaller = '';
    $scope.userData = localStorageService.get('userData');
    $scope.filesName = [];
    var names = [];
    var formArchivos = '';
    var contentForm = '';
    var btnSubmit = '';
    var elements = '';

    var getExample = function () {
        exampleRepo.getEjemplo().then(function (exampleData) {
            if (exampleData.data.length > 0) {
                alertFactory.success("Éxito");
            }
        });
    }

    var getPieza = function () {
        exampleRepo.buscarPieza(1, 'espejo').then(function (pieza) {
            if (pieza.data.length > 0) {
                alertFactory.success("exito");
            }
        });
    }
    $scope.init = function () {
        //configuraciones de dropzone
        Dropzone.autoDiscover = false;
        $scope.dzOptionsCotizacion = uploadRepository.getDzOptions("image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT", 20);
        // Collapse ibox function
        $('.collapse-link').click(function () {
            var ibox = $(this).closest('div.ibox');
            var button = $(this).find('i');
            var content = ibox.find('div.ibox-content');
            content.slideToggle(200);
            button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
            ibox.toggleClass('').toggleClass('border-bottom');
            setTimeout(function () {
                ibox.resize();
                ibox.find('[id^=map-]').resize();
            }, 50);
        });
        exist = false;

        //Nueva cotización
        if (localStorageService.get('tipoCotizacion') != null) {
            $scope.citaDatos = localStorageService.get('cita');
            $scope.tipoCotizacion = parseInt(localStorageService.get('tipoCotizacion'));
            $scope.estado = 1;
            $scope.editar = 0;
            datosCita();
            $scope.idTaller = $scope.citaDatos.idTaller;
            localStorageService.remove('tipoCotizacion');
        } else if (localStorageService.get('cita') != null) { //Objeto de la pagina de tallerCita 
            $scope.citaDatos = localStorageService.get('cita');
            $scope.estado = 1;
            $scope.editar = 0;
            datosCita();
            $scope.idTaller = $scope.citaDatos.idTaller;
            busquedaServicioDetalle($scope.citaDatos.idCita);
        }

        //Se valida si la cotización es para editar
        if (localStorageService.get('objEditCotizacion') != null) {
            $scope.editCotizacion = localStorageService.get('objEditCotizacion'); //objeto de la pagina autorizacion
            datosUnidad($scope.editCotizacion.idCotizacion, null);
            $scope.editar = 1;
            $scope.estado = 2;
            $scope.idTaller = $scope.editCotizacion.idTaller;
            $scope.editarCotizacion($scope.editCotizacion.idCotizacion,
                $scope.editCotizacion.idTaller, $scope.userData.idUsuario);
            $scope.idCotizacion = $scope.editCotizacion.idCotizacion;
            $scope.idTrabajo = $scope.editCotizacion.idTrabajo;
        }
        //Objeto de la pagina de orden servicio
        if (localStorageService.get('orden') != null) {
            $scope.orden = localStorageService.get('orden');
            $scope.estado = 3;
            $scope.idTaller = $scope.orden.idTaller;
            $scope.idTrabajo = $scope.orden.idTrabajo;
            datosUnidad(null, $scope.orden.idTrabajo);
        }

        $scope.get_tipoCotizaciones();
    }

    //Busqueda de item (servicio/pieza/refacción)
    $scope.buscarPieza = function (pieza) {
        if (pieza == '' || pieza == null) {
            alertFactory.info("Ingrese un dato para búsqueda");
        } else {
            $('.dataTableItem').DataTable().destroy();
            /* $('.dataTableCotizacion').DataTable().destroy();*/
            $scope.promise = cotizacionRepository.buscarPieza($scope.idTaller, pieza).then(function (result) {
                $scope.listaPiezas = result.data;
                if (result.data.length > 0) {
                    setTimeout(function () {
                        $('.dataTableItem').DataTable({
                            dom: '<"html5buttons"B>lTfgitp',
                            buttons: [
                                {
                                    extend: 'copy'
                                    },
                                {
                                    extend: 'csv'
                                    },
                                {
                                    extend: 'excel',
                                    title: 'ExampleFile'
                                    },
                                {
                                    extend: 'pdf',
                                    title: 'ExampleFile'
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
                    }, 2000);
                    alertFactory.success('Datos encontrados');
                } else {
                    alertFactory.info('No existe pieza con esa descripción');
                    $scope.listaPiezas = '';
                }
            }, function (error) {
                alertFactory.error('Error');
            });
        }
        pieza = '';
    }

    //Se agregan los items para el calculo de la cotización
    $scope.cotizacion = function (pieza) {
        $scope.pieza = pieza;
        $scope.precioActual = pieza.precio;
        $('#editaPrecio').appendTo('body').modal('show');

    };

    //Valida si el item ya existe en la cotización
    var existsItem = function (pieza) {
        $scope.arrayItem.forEach(function (item) {
            if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento)
                exist = true;
        });
        return exist;
    };

    //Calcula el total de la cotización
    var calculaTotal = function () {
        var total = 0;
        $scope.arrayItem.forEach(function (item) {
            total = total + (item.cantidad * parseFloat(item.precio)) + ((item.cantidad) * (parseFloat(item.precio) * parseFloat(item.valorIva / 100)));
        })
        return total;
    };

    //Calcula el total de la cotización en modo editar
    var calculaTotalEditar = function () {
        var total = 0;
        $scope.arrayItem.forEach(function (item) {
            total = total + (item.cantidad * parseFloat(item.precio)) + ((item.cantidad) * (parseFloat(item.precio) * parseFloat(item.valorIva / 100)))
        })
        return total;
    };

    //Calcula el importe de la cotización
    var calcularImporte = function () {
        var importe = 0;
        $scope.arrayItem.forEach(function (item) {
            item.importe = (item.cantidad * (parseFloat(item.precio) * parseFloat(item.valorIva / 100))) + parseFloat(item.precio)
        })
    }

    //Calcula el Subtotal
    var calcularSubtotal = function () {
        var sub = 0;
        $scope.arrayItem.forEach(function (item) {
            sub = sub + (item.cantidad * parseFloat(item.precio));
        })
        return sub;
    }

    //Calcula el IVA
    var calcularIva = function () {
        var iva = 0;
        $scope.arrayItem.forEach(function (item) {
            iva = iva + ((item.cantidad) * (parseFloat(item.precio) * parseFloat(item.valorIva / 100)));
        })
        return iva;
    }

    //Eliminar la pieza de la cotización
    $scope.quitarPieza = function (pieza) {
        $scope.arrayItem.forEach(function (item, i) {
            if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento) {
                if ($scope.arrayItem[i].cantidad > 1) {
                    $scope.arrayItem[i].cantidad = item.cantidad - 1;
                    $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precio)
                    $scope.total = calculaTotal();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                } else {
                    $scope.arrayItem.splice(i, 1);
                    $scope.total = calculaTotal();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                    $scope.importe = 0;
                    if ($scope.editar == 1) {
                        $scope.arrayCambios.forEach(function (item, i) {
                            if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento)
                                $scope.arrayCambios[i].idEstatus = 13; //Estatus Eliminado 
                        })
                    }

                }
            }
        })

    };

    //Envia la cotización para autorización Cotización Nueva
    var btnEnviaCotizacionLoading = $('#btnEnviaCotizacion').ladda();
    btnEnviaCotizacionLoading.click(function () {
        btnEnviaCotizacionLoading.ladda('start');
        if ($scope.arrayItem.length == 0) {
            alertFactory.info('Debe seleccionar items para la cotización');
        } else {
            if ($scope.objCita == null) {
                idUnidad = $scope.citaDatos.idUnidad;
            } else {
                idUnidad = $scope.objCita.idUnidad;
            }
        }

        if ($scope.selectedTipo == undefined || $scope.selectedTipo == null) {
            alertFactory.info('Debe seleccionar un tipo de cotización');
        } else if ($scope.selectedTaller == null) {
            alertFactory.info('Debe seleccionar un taller');
        } else {
            cotizacionRepository.insertCotizacionMaestro($scope.citaDatos.idCita,
                    $scope.userData.idUsuario,
                    $scope.observaciones,
                    idUnidad,
                    $scope.tipoCotizacion,
                    $scope.selectedTaller)
                .then(function (resultado) {
                    alertFactory.success('Guardando Cotización Maestro');
                    $scope.idCotizacion = resultado.data[0].idCotizacion;
                    $scope.idTrabajo = resultado.data[0].idTrabajo;
                    $scope.arrayItem.forEach(function (item, i) {
                        cotizacionRepository.insertCotizacionDetalle($scope.idCotizacion,
                                item.idTipoElemento,
                                item.idItem,
                                item.precio,
                                item.cantidad,
                                item.idEstatus,
                                item.idNivelAutorizacion)
                            .then(function (result) {
                                alertFactory.success('Guardando Cotización Detalle');
                                if (($scope.arrayItem.length - i) === 1) {
                                    alertFactory.success('Cotización creada');
                                    cotizacionMailRepository.postMail($scope.idCotizacion, $scope.citaDatos.idTaller, 1, '');
                                    if ($scope.dzMethods.getAllFiles().length == 0) {
                                        setTimeout(function () {
                                            location.href = "/cotizacionconsulta";
                                        }, 1000);
                                    } else {
                                        $scope.dzMethods.processQueue();
                                    }
                                    btnEnviaCotizacionLoading.ladda('stop');
                                }
                            }, function (error) {
                                alertFactory.error('Error');
                                btnEnviaCotizacionLoading.ladda('stop');
                            });
                    });
                }, function (error) {
                    alertFactory.error('Error');
                    btnEnviaCotizacionLoading.ladda('stop');
                });
        }

    });

    //Termina de guardar la información de los archivos
    $scope.FinishSave = function () {
        alertFactory.success('Guardando Archivos');
        location.href = '/cotizacionconsulta';
    }

    //Carga los datos de la cotizacion a editar
    $scope.editarCotizacion = function (idCotizacion, idTaller, idUsuario) {
        cotizacionRepository.editarCotizacion($scope.editCotizacion.idCotizacion,
                $scope.editCotizacion.idTaller, idUsuario)
            .then(function (result) {
                $scope.preArticulos = [];

                if (result.data.length > 0) {
                    preArticulos = Enumerable.From(result.data).Distinct(function (x) {
                        return x.idItem
                    }).ToArray();

                    $scope.arrayItem = preArticulos;

                    $scope.arrayCambios = $scope.arrayItem.slice();
                    $scope.observaciones = result.data[0].observaciones;
                    $scope.total = calculaTotalEditar();
                    $scope.sub = calcularSubtotal();
                    $scope.iva = calcularIva();
                    alertFactory.success('Datos Cargados');
                } else {
                    alertFactory.info('No hay datos para editar');
                }

            }, function (error) {
                alertFactory.error('Error');
            });
    }

    //Actualización de la cotización
    var btnCotizacionUpdLoading = $('#btnUpdateCotizacion').ladda();
    //observaciones
    $('.ladda-button').ladda('bind', {
        timeout: 2000
    });
    // Bind progress buttons and simulate loading progress
    Ladda.bind('.progress-demo .ladda-button', {
        callback: function (instance) {
            var progress = 0;
            var interval = setInterval(function () {
                progress = Math.min(progress + Math.random() * 0.1, 1);
                instance.setProgress(progress);

                if (progress === 1) {
                    instance.stop();
                    clearInterval(interval);
                }
            }, 200);
        }
    });
    btnCotizacionUpdLoading.click(function () {
        btnCotizacionUpdLoading.ladda('start');
        eliminarElementos();
        $scope.arrayCambios.forEach(function (item, i) {
            cotizacionRepository.updateCotizacion($scope.editCotizacion.idCotizacion,
                    item.idTipoElemento,
                    item.idItem,
                    item.precio,
                    item.cantidad,
                    $scope.observaciones,
                    item.idEstatus,
                    0)
                .then(function (result) {
                    if (result.data[0].idCotizacion > 0)
                        alertFactory.success('Cotización Actualizada ');
                }, function (error) {
                    alertFactory.error('Error');
                    btnCotizacionUpdLoading.ladda('stop');
                    alertFactory.error('Error');

                });
        }, function (error) {
            alertFactory.error('Error');
            btnCotizacionUpdLoading.ladda('stop');
        });
        $scope.arrayItem.forEach(function (item, i) {
            cotizacionRepository.updateCotizacion($scope.editCotizacion.idCotizacion,
                    item.idTipoElemento,
                    item.idItem,
                    item.precio,
                    item.cantidad,
                    $scope.observaciones,
                    item.idEstatus,
                    1)
                .then(function (result) {
                    if (($scope.arrayItem.length - i) === 1) {
                        alertFactory.success('Cotización Actualizada');
                        cotizacionMailRepository.postMail($scope.editCotizacion.idCotizacion, $scope.editCotizacion.idTaller, 1, '');
                        if ($scope.dzMethods.getAllFiles().length == 0) {
                            setTimeout(function () {
                                location.href = "/cotizacionconsulta";
                            }, 1000);
                        } else {
                            $scope.dzMethods.processQueue();
                        }
                        btnCotizacionUpdLoading.ladda('stop');
                    }
                }, function (error) {
                    alertFactory.error('Error');
                    btnCotizacionUpdLoading.ladda('stop');
                });
        }, function (error) {
            alertFactory.error('Error');
            btnCotizacionUpdLoading.ladda('stop');
        });
    });

    //Se obtienen datos de la unidad a editar
    var datosFicha = function () {
        if (localStorageService.get('objFicha') != null) {
            $scope.objFicha = localStorageService.get('objFicha');
            $scope.numEconomico = $scope.objFicha.numEconomico;
            $scope.modeloMarca = $scope.objFicha.marca + '  ' + $scope.objFicha.modelo;
            $scope.trabajo = $scope.objFicha.trabajo;
        }
    }

    //Se obtienen datos de la cita para generar la cotización
    var datosCita = function () {
        if (localStorageService.get('cita') != null) {
            $scope.numEconomico = $scope.citaDatos.numEconomico;
            $scope.modeloMarca = $scope.citaDatos.modeloMarca;
            $scope.trabajo = $scope.citaDatos.trabajo;
        }
    }

    //Cargar datos de la cotizacion desde la cita
    var busquedaServicioDetalle = function (idCita) {
        cotizacionRepository.busquedaServicioDetalle(idCita)
            .then(function (result) {
                $scope.arrayItem = result.data;
                $scope.arrayCambios = $scope.arrayItem.slice();
                //$scope.importe = calcularImporte();
                $scope.total = calculaTotalEditar();
                $scope.sub = calcularSubtotal();
                $scope.iva = calcularIva();
            }, function (error) {
                alertFactory.error('Error');
            });
    }

    //realiza una nueva cotización para un trabajo existente
    var btnNuevaCotizacionLoading = $('#btnNuevaCotizacion').ladda();
    btnNuevaCotizacionLoading.click(function () {
        btnNuevaCotizacionLoading.ladda('start');
        if ($scope.arrayItem.length == 0) {
            alertFactory.info('Debe seleccionar items para la cotización');
        }
        cotizacionRepository.insertCotizacionMaestro($scope.orden.idCita,
                $scope.orden.idUsuario,
                $scope.observaciones,
                $scope.orden.idUnidad,
                $scope.tipoCotizacion)
            .then(function (resultado) {
                alertFactory.success('Guardando Cotización Maestro');
                $scope.idCotizacion = resultado.data[0].idCotizacion;
                $scope.idTrabajo = resultado.data[0].idTrabajo;
                $scope.arrayItem.forEach(function (item, i) {
                    cotizacionRepository.insertCotizacionDetalle($scope.idCotizacion,
                            item.idTipoElemento,
                            item.idItem,
                            item.precio,
                            item.cantidad,
                            item.idEstatus,
                            item.idNivelAutorizacion)
                        .then(function (result) {
                            alertFactory.success('Guardando Cotización Detalle');
                            if (($scope.arrayItem.length - i) === 1) {
                                alertFactory.success('Cotización creada');
                                cotizacionMailRepository.postMail($scope.idCotizacion, $scope.orden.idTaller, 1, '');
                                if ($scope.dzMethods.getAllFiles().length == 0) {
                                    setTimeout(function () {
                                        location.href = "/cotizacionconsulta";
                                    }, 1000);
                                } else {
                                    $scope.dzMethods.processQueue();
                                }
                                btnNuevaCotizacionLoading.ladda('stop');
                            }
                        }, function (error) {
                            alertFactory.error('Error');
                            btnNuevaCotizacionLoading.ladda('stop');
                        });
                });
            }, function (error) {
                alertFactory.error('Error');

            });
    });

    //Se obtienen los datos de la unidad a cotizar
    var datosUnidad = function (idCotizacion, idTrabajo) {
        cotizacionRepository.datosUnidad(idCotizacion, idTrabajo)
            .then(function (result) {
                $scope.numEconomico = result.data[0].numEconomico;
                $scope.modeloMarca = result.data[0].marca + ' ' + result.data[0].modeloMarca + ' ' + result.data[0].modelo;
                $scope.trabajo = result.data[0].trabajo;
            }, function (error) {
                alertFactory.error('Error al obtener datos unidad');
            });
    }

    //Eliminar items que fueron quitados de la cotización
    var eliminarElementos = function () {
        $scope.arrayCambios.forEach(function (item, i) {
            if (item.idEstatus == 8) {
                $scope.arrayCambios.splice(i, 1);
            }
        })
    }

    //Se obtiene la extensión del archivo
    var obtenerExtArchivo = function (file) {
        var file = file;
        var res = file.substring(file.length - 4, file.length)
        return res;
    }

    //Obtener el tipo de archivo
    var obtenerTipoArchivo = function (ext) {
        if (ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
            ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' ||
            ext == '.ppt' || ext == '.PPT' || ext == '.xml' || ext == '.XML') {
            type = 1;
        } else if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP') {
            type = 2;
        } else if (ext == '.mp4') {
            type = 3;
        }
        return type;
    }

    //obtener los nombres de los archivos
    var obtenerFiles = function (file) {
        names = file.value.split(',');
        names.forEach(function (item) {
            $scope.filesName.push({
                nombre: item
            });
        });
        return $scope.filesName;
    }

    $scope.precioEditado = function (pieza) {

        if ($scope.arrayItem.length != 0) {
            if (existsItem(pieza) == true) {
                $scope.arrayItem.forEach(function (item, i) {
                    if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento) {
                        /*$scope.arrayItem[i].cantidad = item.cantidad + 1;*/
                        $scope.arrayItem[i].precio = $scope.precioActual;
                        $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precio)
                            //$scope.importe = $scope.arrayItem[i].importe;
                        $scope.sub = calcularSubtotal();
                        $scope.iva = calcularIva();
                        $scope.total = calculaTotal();
                    }
                });
                exist = false;
            } else {
                //Se agrega el item seleccionado al array
                $scope.arrayItem.push({
                    numeroPartida: pieza.numeroPartida,
                    idItem: pieza.idItem,
                    numeroParte: pieza.numeroParte,
                    item: pieza.item,
                    precio: $scope.precioActual,
                    cantidad: 1,
                    importe: $scope.precioActual * 1,
                    idTipoElemento: pieza.idTipoElemento,
                    valorIva: pieza.valorIva,
                    idEstatus: 8,
                    idNivelAutorizacion: pieza.idNivelAutorizacion
                });
                $scope.sub = calcularSubtotal();
                $scope.iva = calcularIva();
                $scope.total = calculaTotal();
                exist = false;
            }
        } else {
            //Se agrega el item seleccionado al array
            $scope.arrayItem.push({
                numeroPartida: pieza.numeroPartida,
                idItem: pieza.idItem,
                numeroParte: pieza.numeroParte,
                item: pieza.item,
                precio: $scope.precioActual,
                cantidad: 1,
                importe: $scope.precioActual * 1,
                idTipoElemento: pieza.idTipoElemento,
                valorIva: pieza.valorIva,
                idEstatus: 8,
                idNivelAutorizacion: pieza.idNivelAutorizacion
            });
            $scope.sub = calcularSubtotal();
            $scope.iva = calcularIva();
            $scope.total = calculaTotal();
            exist = false;
        }
    }

    $scope.cotizar = function (pieza) {
        if ($scope.arrayItem.length != 0) {
            if (existsItem(pieza) == true) {
                $scope.arrayItem.forEach(function (item, i) {
                    if (item.idItem == pieza.idItem && item.idTipoElemento == pieza.idTipoElemento) {
                        $scope.arrayItem[i].cantidad = item.cantidad + 1;
                        //  $scope.arrayItem[i].precio = $scope.precioActual;
                        if ($scope.userData.idTipoUsuario == 4) {
                            $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precioCliente)
                        } else {
                            $scope.arrayItem[i].importe = ($scope.arrayItem[i].cantidad) * ($scope.arrayItem[i].precio)
                        }
                        $scope.sub = calcularSubtotal();
                        $scope.iva = calcularIva();
                        $scope.total = calculaTotal();
                    }
                });
                exist = false;
            } else {
                //Se agrega el item seleccionado al array
                if ($scope.userData.idTipoUsuario == 4) {
                    $scope.arrayItem.push({
                        numeroPartida: pieza.numeroPartida,
                        idItem: pieza.idItem,
                        numeroParte: pieza.numeroParte,
                        item: pieza.item,
                        precio: pieza.precioCliente,
                        cantidad: 1,
                        importe: pieza.precioCliente * 1,
                        idTipoElemento: pieza.idTipoElemento,
                        valorIva: pieza.valorIva,
                        idEstatus: 8,
                        idNivelAutorizacion: pieza.idNivelAutorizacion
                    });
                } else {
                    $scope.arrayItem.push({
                        numeroPartida: pieza.numeroPartida,
                        idItem: pieza.idItem,
                        numeroParte: pieza.numeroParte,
                        item: pieza.item,
                        precio: pieza.precio,
                        cantidad: 1,
                        importe: pieza.precio * 1,
                        idTipoElemento: pieza.idTipoElemento,
                        valorIva: pieza.valorIva,
                        idEstatus: 8,
                        idNivelAutorizacion: pieza.idNivelAutorizacion
                    });
                }
                $scope.sub = calcularSubtotal();
                $scope.iva = calcularIva();
                $scope.total = calculaTotal();
                exist = false;
            }
        } else {
            //Se agrega el item seleccionado al array
            if ($scope.userData.idTipoUsuario == 4) {
                $scope.arrayItem.push({
                    numeroPartida: pieza.numeroPartida,
                    idItem: pieza.idItem,
                    numeroParte: pieza.numeroParte,
                    item: pieza.item,
                    precio: pieza.precioCliente,
                    cantidad: 1,
                    importe: pieza.precioCliente * 1,
                    idTipoElemento: pieza.idTipoElemento,
                    valorIva: pieza.valorIva,
                    idEstatus: 8,
                    idNivelAutorizacion: pieza.idNivelAutorizacion
                });
            } else {
                $scope.arrayItem.push({
                    numeroPartida: pieza.numeroPartida,
                    idItem: pieza.idItem,
                    numeroParte: pieza.numeroParte,
                    item: pieza.item,
                    precio: pieza.precio,
                    cantidad: 1,
                    importe: pieza.precio * 1,
                    idTipoElemento: pieza.idTipoElemento,
                    valorIva: pieza.valorIva,
                    idEstatus: 8,
                    idNivelAutorizacion: pieza.idNivelAutorizacion
                });
            }
            $scope.sub = calcularSubtotal();
            $scope.iva = calcularIva();
            $scope.total = calculaTotal();
            exist = false;
        }
    };

    //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function (file, xhr, formData) {
            formData.append('idTrabajo', $scope.idTrabajo);
            formData.append('idCotizacion', $scope.idCotizacion);
            formData.append('idCategoria', 1);
            formData.append('idNombreEspecial', 0);
        },
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if (!checkErrorFile) {
                var allSuccess = file.every(checkAllSuccess);
                if (allSuccess) {
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles(true);
                        location.href = '/cotizacionconsulta';
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

    $scope.dzMethods = {};

    //valida si todos son success
    function checkAllSuccess(file, index, array) {
        return file.status === 'success';
    }

    //valida si existe algún error
    function checkExistsError(file) {
        return file.status === 'error';
    }

    $scope.get_tipoCotizaciones = function () {
        cotizacionRepository.obtieneTipoCotizaciones().then(function (result) {
            if (result.data.length > 0) {
                $scope.tipoCotizaciones = result.data;
            }
        }, function (error) {
            alertFactory.error('No se puedieron obtener los tipos de cotizaciones');
        });
    }

    //obtiene los talleres con su especialidad
    $scope.lookUpTaller = function (datoTaller) {
        if (datoTaller !== '' && datoTaller !== undefined) {
            $('.dataTableTaller').DataTable().destroy();
            $scope.promise = cotizacionRepository.obtieneTallerCotizaciones(datoTaller, 2, $scope.citaDatos.idCita).then(function (taller) {
                $scope.talleres = taller.data;
                //  $scope.arrayCambios = $scope.talleres.slice();
                if (taller.data.length > 0) {
                    waitDrawDocument("dataTableTaller");
                    alertFactory.success('Datos encontrados');
                } else {
                    alertFactory.info('No se encontraron datos');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        } else {
            alertFactory.info('Llene el campo de búsqueda');
        }
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    {
                        extend: 'excel',
                        title: 'Citas'
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

    //Obtiene el taller seleccionado
    $scope.getTaller = function (idTaller) {
        $scope.selectedTaller = idTaller;
    }
});