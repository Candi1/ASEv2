registrationModule.controller('detalleController', function($scope, $location, $modal, userFactory, cotizacionRepository, consultaCitasRepository, $rootScope, $routeParams, alertFactory, globalFactory, commonService, localStorageService, detalleRepository, aprobacionRepository) {
    //*****************************************************************************************************************************//
    // $rootScope.modulo <<-- Para activar en que opción del menú se encuentra
    //*****************************************************************************************************************************//
    //$rootScope.modulo = 'reporteHistorial';
    //Inicializa la pagina

    $scope.IdsCotizacionesPorOrden  = [];
    $scope.btn_editarCotizacion     = false;
    $scope.idUsuario        = 0;
    $scope.numeroOrden      = $routeParams.orden;
    $scope.idEstatusOrden   = 0;
    $scope.estatus          = $routeParams.estatus;
    $scope.textoNota        = null;
    $scope.notaTrabajo      = [];
    $scope.HistoricoOrden   = [];
    $scope.x                = 0;
    $scope.numCotz          = 0;
    $scope.TieneSaldo       = true;
    $scope.totalSumaCosto   = 0;
    $scope.totalSumaVenta   = 0;
    $scope.btnSwitch        = {};
    $scope.userData         = {};

    $scope.facturas_empty   = true;
    $scope.facturas_empty   = true;
    $scope.Facturas         = [];
    $scope.totalfacturas    = 0;
    $scope.errores_factura  = false;
    $scope.idOrden          = 0;

    $scope.init = function() {
        userFactory.ValidaSesion();
        $scope.userData = userFactory.getUserData();
        $scope.idUsuario = $scope.userData.idUsuario;
        $scope.btnSwitch.classCosto = 'btn btn-success';
        $scope.btnSwitch.showCostoVenta = true;
        $scope.btnSwitch.classVenta = 'btn btn-default'
        $scope.checkComprobanteRecepcion();
        $scope.HistoricoCotizaciones = [];
        $scope.getHistoricos();
        $scope.getOrdenDetalle($scope.userData.idUsuario, $scope.numeroOrden);
        $scope.getOrdenCliente($scope.userData.idUsuario, $scope.numeroOrden);
        $scope.getOrdenDocumentos($scope.userData.idUsuario, $scope.numeroOrden);
        $scope.getOrdenEvidencias($scope.userData.idUsuario, $scope.numeroOrden);
        $scope.setActiveButtons($scope.estatus);
        $scope.enviaNota();
        $scope.getSaldos($routeParams.orden);
        $('.horaAsignada').clockpicker();
        $scope.ShowFacturas();
    };

    $scope.getHistoricos = function() {
        detalleRepository.getHistoricoOrden($scope.numeroOrden).then(function(result) {
            if (result.data.length > 0) {
                $scope.HistoricoOrden = result.data;
            }
        }, function(error) {
            alertFactory.error('No se puede obtener el historico de la orden.');
        });

        detalleRepository.getIdCotizacionesPorOrden($scope.numeroOrden).then(function(result) {
            $scope.numCotz = result.data.length;
            if (result.data.length > 0) {
                $scope.IdsCotizacionesPorOrden = result.data;
            }
            $scope.getHistoricosCotz();
        }, function(error) {
            alertFactory.error('No se puede obtener las cotizaciones de la orden.');
        });
    }

    $scope.getHistoricosCotz = function() {
        for ($scope.x = 0; $scope.x < $scope.numCotz; $scope.x++) {
            detalleRepository.getHistoricoCotizacion($scope.IdsCotizacionesPorOrden[$scope.x].idCotizacion).then(function(result) {
                if (result.data.length > 0) {
                    var valueToPush = {};
                    valueToPush.consecutivo = result.data[0].consecutivo;
                    valueToPush.data = result.data;
                    $scope.HistoricoCotizaciones.push(valueToPush);
                }
            }, function(error) {
                alertFactory.error('No se pudo recuperar el historico de la cotización.');
            });
        }
    }

    $scope.getOrdenDetalle = function(idUsuario, orden) {
        consultaCitasRepository.getOrdenDetalle(idUsuario, orden).then(function(result) {
            $scope.idOrden = result.data[0].idOrden;
            if (result.data.length > 0) {
                $scope.detalleOrden = result.data[0];
                $scope.idEstatusOrden = $scope.detalleOrden.idEstatusOrden;
                $scope.idOrdenURL = $scope.detalleOrden.idOrden;
                var statusCotizacion = 0;
                if ($scope.estatus == 1 || $scope.estatus == 2 || $scope.estatus == 3) {
                    statusCotizacion = '1';
                } else if ($scope.estatus == 4) {
                    statusCotizacion = '1,2';
                } else if ($scope.estatus == 5 || $scope.estatus == 6 || $scope.estatus == 7) {
                    statusCotizacion = '3';
                }

                $scope.getMostrarCotizaciones($scope.numeroOrden, statusCotizacion, $scope.idUsuario)
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los detalles de la orden');
        });
    }

    $scope.getOrdenCliente = function(idUsuario, orden) {
        consultaCitasRepository.getOrdenCliente(idUsuario, orden).then(function(result) {
            if (result.data.length > 0) {
                $scope.detalleCliente = result.data[0];
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los detalles del cliente');
        });
    }

    $scope.getOrdenDocumentos = function(idUsuario, orden) {
        consultaCitasRepository.getOrdenDocumentos(idUsuario, orden).then(function(result) {
            if (result.data.length > 0) {
                $scope.detalleDocumentos = result.data[0];
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los documentos de la orden');
        });
    }

    $scope.getOrdenEvidencias = function(idUsuario, orden) {
        consultaCitasRepository.getOrdenEvidencias(idUsuario, orden).then(function(result) {
            if (result.data.length > 0) {
                $scope.detalleEvidencias = result.data;
            }
        }, function(error) {
            alertFactory.error('No se puede obtener los documentos de la orden');
        });
    }

    $scope.getMostrarCotizaciones = function(numeroOrden, estatus, idUsuario) {
        cotizacionRepository.getMostrarCotizaciones(numeroOrden, estatus, idUsuario).then(function(result) {
            if (result.data.success == true) {
                $scope.cotizaciones = result.data.data;
                $scope.getTotales();
            } else {
                alertFactory.error('No se puede obtener los documentos de la orden');
            }
        }, function(error) {
            alertFactory.error(result.msg);
        });
    }

    $scope.getTotales = function() {
        $scope.totalSumaCosto = 0;
        $scope.totalSumaVenta = 0;
        if ($scope.cotizaciones != null || $scope.cotizaciones != undefined) {
            $scope.cotizaciones.forEach(function(item) {
                item.detalle.forEach(function(itemDetail) {
                    $scope.totalSumaCosto = $scope.totalSumaCosto + itemDetail.costoTotal;
                    $scope.totalSumaVenta = $scope.totalSumaVenta + itemDetail.ventaTotal;
                });
            });
        }
    }

    $scope.nuevaCotizacion = function() {
        location.href = '/cotizacionnueva?orden=' + $routeParams.orden;
    }

    $scope.enviaNota = function() {
        $scope.notaTrabajo = [];
        var Nota = $scope.textoNota == '' ? null : $scope.textoNota;
        detalleRepository.insNota(Nota, $scope.numeroOrden, $scope.userData.idUsuario, $scope.idEstatusOrden).then(function(result) {
            if (result.data.length > 0) {
                $scope.notaTrabajo = result.data;
            }
        }, function(error) {
            alertFactory.error('No se pudieron obtener las notas');
        });
        $scope.textoNota = null;
    };

    $scope.comprobante = function() {
        location.href = '/comprobanteRecepcion?orden=' + $routeParams.orden;
    };

    $scope.initApproveButtons = function(item) {

        if (item.Aprueba == 1 && item.idEstatusPartida == 1) {
            item.btnDisabled = false;
            item.selOption = item.idEstatusPartida;
        } else {
            item.btnDisabled = true;
            item.selOption = item.idEstatusPartida;
        }

    };

    $scope.setActiveButtons = function(idstatus) {

        switch (Number(idstatus)) {
            case 1:
                $scope.hideAllButtons();
                $scope.showButtonsInProcess();
                break;
            case 2:
                $scope.hideAllButtons();
                $scope.showButtonsInProcess();
                $scope.btn_editarCotizacion = true;
                break;
            case 3:
                $scope.hideAllButtons();
                $scope.showButtonsInProcess();
                $scope.btn_editarCotizacion = true;
                $scope.btnMoradoIsEnable = false;
                break;
            case 4: //Botones habilitados para modulo aprobación
                $scope.hideAllButtons();
                //$scope.btnEditarIsEnable = false;
                $scope.btnGuardaCotizacionIsEnable = false;
                $scope.btn_editarCotizacion = true;
                break;
            default:
                $scope.hideAllButtons();
        }

    };

    $scope.btnSaveCotizacion = function() {

        var haveBalance = $scope.checkBalance();

        if (haveBalance == true) {
            $scope.UpdatePartidaStatus();
        } else {
            $('.modal-dialog').css('width', '1050px');
            modal_saldos($scope, $modal, $scope.saldos, '', '');
        }

    };

    $scope.checkBalance = function() {
        var sumOperacion = 0;

        $scope.cotizaciones[0].detalle.forEach(function(item) {
            if (item.btnStep != 0 && item.btnDisabled == false) {
                sumOperacion += item.ventaTotal;
            }
        });

        if (sumOperacion > ($scope.saldos.presupuesto - $scope.saldos.saldoReal)) {
            $scope.TieneSaldo = false;
            return false;
        } else {
            $scope.TieneSaldo = true;
            return true;
        }
    };

    $scope.UpdatePartidaStatus = function() {
        $scope.cotizaciones[0].detalle.forEach(function(item) {

            if (item.btnDisabled == false && item.selOption > 1) {

                var params = {
                    idUsuario: '',
                    idCotizacion: '',
                    idPartida: '',
                    idEstatusPartida: 0
                };
                params.idUsuario = $scope.idUsuario;
                params.idCotizacion = $scope.cotizaciones[0].idCotizacion;
                params.idPartida = item.idPartida;
                params.idEstatusPartida = item.idEstatusPartida;


                aprobacionRepository.getUpdateStatusPartida(params).then(function(result) {
                    if (result.data.length > 0) {}
                }, function(error) {
                    alertFactory.error('Aprobación getUpdateStatusPartida error.');
                });

            }

        });
        setTimeout(function() {
            $scope.UpdateCotizacionStatus($scope.cotizaciones[0].idCotizacion, $scope.idUsuario);
        }, 1000);
    };

    $scope.UpdateCotizacionStatus = function(idCotizacion, idUsuario) {
        aprobacionRepository.getUpdateStatusCotizacion(idCotizacion, idUsuario).then(function(result) {
            if (result.data.length > 0) {
                var valor = result.data[0].idEstatusCotizacion;

                switch (Number(valor)) {
                    case 2: //cliente
                        alertFactory.success('Faltan partidas por aprobar.');
                        $scope.init();
                        break;
                    case 3:
                        location.href = '/detalle?orden=' + $routeParams.orden + '&estatus=5';
                        break;
                    case 4:
                        location.href = '/cotizacionconsulta';
                        break;
                    default:
                        alertFactory.info('Debe seleccionar partidas para aprobar.');
                }

            } else {
                alertFactory.success('Finalizó sin respuesta.');
            }
        }, function(error) {
            alertFactory.error('Aprobación getUpdateStatusCotizacion error.');
        });
    };

    $scope.showButtonSwitch = function(usrRol) {
        switch (Number(usrRol)) {
            case 1: //cliente
                $scope.hideSwitchBtn = true;
                $scope.btnSwitch.showCostoVenta = true;
                $scope.btn_editarCotizacion = true;
                break;
            case 2: //admin
                $scope.hideSwitchBtn = false;
                $scope.btn_editarCotizacion = true;
                break;
            case 4: //proveedor
                $scope.hideSwitchBtn = true;
                $scope.btnSwitch.showCostoVenta = false;
                break;
            default:
                $scope.hideSwitchBtn = true;
        }
    };

    $scope.hideAllButtons = function() {
        $scope.btnEditarIsEnable = true;
        $scope.btnGuardaCotizacionIsEnable = true;
        $scope.btnNuevaCotizacionIsEnable = true;
        $scope.btnEditarCotizacionIsEnable = true;
        $scope.btnComprobanteRecepcionIsEnable = true;
        $scope.btnEditarCitaIsEnable = true;
        $scope.btnCancelarCitaIsEnable = true;
        $scope.btnNegroIsEnable = true;
        $scope.btnMoradoIsEnable = true;
    };

    $scope.showButtonsInProcess = function() {
        $scope.btnEditarCotizacionIsEnable = false;
        $scope.btnNuevaCotizacionIsEnable = false;
        $scope.btnComprobanteRecepcionIsEnable = false;
        $scope.btnEditarCitaIsEnable = false;
    };

    $scope.getSaldos = function(numeroOrden) {
        aprobacionRepository.getPresupuesto(numeroOrden).then(function(result) {
            if (result.data.length > 0) {
                $scope.saldos = result.data[0];
            }
        }, function(error) {
            alertFactory.error('sinsaldos');
        });
    };

    $scope.editarCotizacion = function(data) {
        var orden = $scope.numeroOrden;
        var idCotizacion = String(data.idCotizacion);
        location.href = '/cotizacionnueva?orden=' + orden + '&idCotizacion=' + idCotizacion;
    }

    //LQMA 07062017
    $scope.getReporteConformidad = function(idOrden) {
        detalleRepository.getReporteConformidad(idOrden).then(function(result) {
            if (result.data.length > 0) {
                var rptReporteConformidadData = []
                rptReporteConformidadData.encabezado = result.data[0][0];
                rptReporteConformidadData.partidas = result.data[1];
                rptReporteConformidadData.total = result.data[2][0];
                rptReporteConformidadData.firma = result.data[3];
                new Promise(function(resolve, reject) {
                    var rptReporteConformidad = {
                        "encabezado": [
                            rptReporteConformidadData.encabezado
                        ],
                        "partidas": rptReporteConformidadData.partidas,
                        "total": rptReporteConformidadData.total.total,
                        "firma": rptReporteConformidadData.firma
                    }
                    var jsonData = {
                        "template": {
                            "name": "reporteConformidad_rpt"
                        },
                        "data": rptReporteConformidad //
                    }
                    resolve(jsonData);
                }).then(function(jsonData) {
                    detalleRepository.getGuardaReporteConformidad(jsonData, idOrden).then(function(result) {

                    });
                });
            }
        }, function(error) {
            alertFactory.error('Error al obtener Reporte Conformidad');
        });
    }

    //********** [ Aqui Comienza Ordenes en Proceso ] *****************************************************************************//
    $scope.pnl_token_admin = false;

    $scope.ShowAutorizacionAdmin = function() {
        $scope.pnl_token_admin = true;
        $("html, body").animate({
            scrollTop: $(document).height()
        }, 1000);
        setTimeout(function() {
            $(".token_admin").focus();
        }, 1001);
    }

    $scope.HideAutorizacionAdmin = function() {
        $scope.pnl_token_admin = false;
    }

    $scope.OpenModalFactura = function(no, cf, ct) {
        $scope.idOrden = no;
        $scope.cotizacionFactura = cf;
        $scope.cotizacionTotal = ct;
        $scope.alert_respuesta = false;

        $(".alert-warning").hide();
        $("#myModal").modal();
        $(".archivos").show();
        $(".uploading").hide();
        $(".btn-cerrar").removeAttr("disabled");
        $(".btn-subir").removeAttr("disabled");

        document.getElementById("frm_subir_factura").reset();

        var inputs = document.querySelectorAll('.inputfile');
        Array.prototype.forEach.call(inputs, function(input) {
            var label = input.nextElementSibling;
            label.querySelector('span').innerHTML = 'Seleccionar archivo';
        });
    }

    $scope.HideModalFactura = function() {
        $("#myModal").modal('hide');
    }

    $scope.Cargar_Factura = function() {
        var fxml = $(".inputfile-1").val();
        var fpdf = $(".inputfile-2").val();

        if (fxml == '' && fpdf == '') {
            $(".alert-danger").fadeIn();
            $(".alert-danger span").text('Proporciona al menos uno de los archivos que se piden');
            setTimeout(function() {
                $(".alert-danger").fadeOut('fast');
            }, 3000);
        } else {
            $(".archivos").hide();
            $(".uploading").show();
            $(".btn-cerrar").attr("disabled", "disabled");
            $(".btn-subir").attr("disabled", "disabled");


            detalleRepository.postSubirFacturas($scope.numeroOrden).then(function(result) {
                var Respuesta = result.data;

                $(".alert-warning").show('fast');
                $(".errores_factura").html('');

                document.getElementById("frm_subir_factura").reset();
                $(".uploading").hide();
                if (Respuesta.res.return.codigo == 1) {
                    $scope.titulo_factura = 'Factura Cargada correctamente';
                } else {
                    $scope.titulo_factura = 'Factura no válida';
                }

                $.each(Respuesta.res.return, function(key, item) {
                    $(".errores_factura").append('<tr> <td width="20%"><strong>' + key + '</strong></td> <td>' + item + '</td> </tr>');
                });

                $(".btn-cerrar").removeAttr("disabled");
            }, function(error) {
                console.log(error);
            });
        }
    }

    $scope.subirEvidencias = function() {
        var evidencia_file = $(".inputfile-3").val();
        if( evidencia_file == '' ){
            alertFactory.warning("Selecciona un archivo.");
            swal();
        }
        else{
            detalleRepository.postSubirEvidencia().then(function(result) {
                var Respuesta = result;
                document.getElementById("frm_evidencia").reset();
                $(".lbl_evidencia").text('Seleccionar archivo');
                
                var _nombre = Respuesta.data.data[0].nombre;
                var _descri = '';
                var _ruta   = Respuesta.data.data[0].PathDB;
                var _orden  = Respuesta.data.data[0].Param.idOrden;

                console.log( Respuesta );
                console.log( "Nombre: " + _nombre );
                console.log( "Ruta: " + _ruta );
                console.log( "Ruta: " + _orden );

                consultaCitasRepository.agregarEvidencias( _nombre, _descri, _ruta, _orden ).then(function(result) {
                    console.log( '=====================' );
                    console.log( result );
                    $scope.getOrdenEvidencias($scope.userData.idUsuario, $scope.numeroOrden);
                    console.log( '=====================' );
                });
            }, function(error) {
                console.log(error);
            });
        }
        // $scope.respuesta = []
        // var form = document.forms.namedItem("myForm");
        // form.addEventListener('submit', function(ev) {
        //     var oData = new FormData(form);
        //     var oReq = new XMLHttpRequest();
        //     oReq.open('post', "api/trabajo/subirArchivoImg", true);
        //     oReq.onload = function(oEvent) {
        //         $scope.respuesta = JSON.parse(oReq.response)
        //         var ruta = $scope.respuesta.res[0].Path
        //         var rutaCorrecta = ruta.substring(11)
        //         var urlevidencia = $rootScope.docServer + '/orden/' + $scope.idOrdenURL + '/evidencia/' + $scope.respuesta.res[0].nombre;
        //         consultaCitasRepository.agregarEvidencias($scope.respuesta.res[0].nombre, '', urlevidencia, $scope.numeroOrden).then(function(result) {
        //             if (result.data[0].length > 0) {} else {
        //                 location.href = '/detalle?orden=' + $scope.numeroOrden + '&estatus=' + 1;
        //                 alertFactory.success('Se guardo con exito evidencia');
        //                 var ruta = ''
        //                 var rutaCorrecta = ''
        //                 $scope.respuesta = []
        //             }
        //         });
        //     }
        //     oReq.send(oData);
        //     ev.preventDefault();
        // }, false);
    }

    $scope.Cargar_Factura_Tmp = function() {
        var fxml = $(".inputfile-1").val();
        var fpdf = $(".inputfile-2").val();

        if (fxml == '' || fpdf == '') {
            $(".alert-info").fadeIn();
            $(".alert-info span").text('Debes proporcionar el XML y el PDF de la factura que vas a cargar.');
            setTimeout(function() {
                $(".alert-info").fadeOut('fast');
            }, 4000);
        } else {
            $(".archivos").hide();
            $(".uploading").show();
            $(".btn-cerrar").attr("disabled", "disabled");
            $(".btn-subir").attr("disabled", "disabled");

            detalleRepository.postSubirFacturas($scope.numeroOrden).then(function(result) {
                var Respuesta = result.data;
                $scope.alert_respuesta = true;
                $(".uploading").hide();
                $(".alert_respuesta").fadeIn();

                Respuesta.data.forEach(function(item, key) {
                    var ServerPath = item.Param.docServer + '/orden/' + item.PathDB;

                    detalleRepository.getGuardarFactura(ServerPath, item.Param.idOrden, item.Param.cotizacionFactura).then(function(result) {
                        // Resultado
                    });
                });

                setTimeout(function() {
                    $("#myModal").modal('hide');
                    $scope.init();
                }, 2000);
            }, function(error) {
                console.log(error);
            });
        }
    }

    $scope.ValidaTerminoTrabajo = function() {
        detalleRepository.validaCotizacionesRevisadas($scope.detalleOrden.idOrden).then(function(result) {
            if (result.data[0].RealizarOperacion) {
                detalleRepository.CambiaStatusOrden($scope.detalleOrden.idOrden, $scope.idUsuario).then(function(r_token) {
                    alertFactory.success('Se ha terminado el trabajo');
                    $("html, body").animate({
                        scrollTop: 0
                    }, 1000);
                    $scope.init();
                });
            } else {
                alertFactory.error('Aun quedan cotizaciones pendientes por revisar');
            }
        });
    }

    $scope.ValidaEntrega = function() {
        detalleRepository.validaCotizacionesRevisadas($scope.detalleOrden.idOrden).then(function(result) {
            if (result.data[0].RealizarOperacion) {
                if ($scope.token_termino == '' || $scope.token_termino === undefined) {
                    alertFactory.error('Introduce el Token de Verificación');
                } else {
                    detalleRepository.validaToken($scope.detalleOrden.idOrden, $scope.token_termino).then(function(r_token) {
                        if (r_token.data[0].Success) {
                            detalleRepository.CambiaStatusOrden($scope.detalleOrden.idOrden, $scope.idUsuario).then(function(c_token) {
                                alertFactory.success('Se ha pasado a estatus Entrega');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 1000);
                                $scope.init();
                                $scope.token_termino = '';

                                $scope.getReporteConformidad($scope.detalleOrden.idOrden);
                            });
                        } else {
                            alertFactory.error(r_token.data[0].Msg);
                            $scope.token_termino = '';
                        }
                    });
                }
            } else {
                alertFactory.error('Aun quedan cotizaciones pendientes por revisar');
            }
        });
    }

    $scope.ValidaPorCobrar = function() {
        detalleRepository.validaCotizacionesRevisadas($scope.detalleOrden.idOrden).then(function(result) {
            if (result.data[0].RealizarOperacion) {
                if ($scope.token_termino == '' || $scope.token_termino === undefined) {
                    alertFactory.error('Introduce el Token de Verificación');
                } else {
                    detalleRepository.validaToken($scope.detalleOrden.idOrden, $scope.token_termino).then(function(r_token) {
                        if (r_token.data[0].Success) {
                            detalleRepository.CambiaStatusOrden($scope.detalleOrden.idOrden, $scope.idUsuario).then(function(c_token) {
                                alertFactory.success('Se ha pasado a Orden por Cobrar');
                                $("html, body").animate({
                                    scrollTop: 0
                                }, 1000);
                                $scope.init();
                                $scope.token_termino = '';

                                $scope.getReporteConformidad($scope.detalleOrden.idOrden);
                            });
                        } else {
                            alertFactory.error(r_token.data[0].Msg);
                            $scope.token_termino = '';
                        }
                    });
                }
            } else {
                alertFactory.error('Aun quedan cotizaciones pendientes por revisar');
            }
        });
    }

    $scope.RechazarTrabajo = function() {
        swal({
                title: "¿Estas seguro?",
                text: "Al rechazar el trabajo éste se cambiara a estatus 'Proceso'",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD083F",
                confirmButtonText: "Rechazar trabajo",
                cancelButtonText: "Cerrar",
                cancelButtonColor: "#DD083F",
                closeOnConfirm: false
            },
            function() {
                detalleRepository.rechazaTrabajo($scope.detalleOrden.idOrden, $scope.idUsuario).then(function(Rechazado) {
                    $("html, body").animate({
                        scrollTop: 0
                    }, 1000);
                    $scope.init();
                    swal("", "Se ha rechazado el trabajo", "success");
                });
            });
    }

    $scope.OpenModalShowFactura = function() {
        $("#ModalShowFactura").modal();
    }

    $scope.ShowFacturas = function() {
        detalleRepository.getFacturas($scope.numeroOrden).then(function(respuesta) {
            $scope.Facturas = respuesta.data;
            if ($scope.Facturas.success) {
                $scope.facturas_empty = false;
                $scope.Facturas.data.forEach(function(item, key) {
                    item.facturas.forEach(function(element, k) {
                        $scope.totalfacturas++;
                    });
                });
            } else {
                $scope.facturas_empty = true;
            }
        });
    }
    //********** [ Aqui Termina Ordenes en Proceso ] ******************************************************************************//

    $scope.checkComprobanteRecepcion = function() {
        detalleRepository.getExistsComprobanteRecepcion($scope.numeroOrden, 1).then(function(result) {
            var resultado = result.data[0];
            if (resultado[0].ID != 0) {
                $scope.validaCertificado = 1;
            } else {
                $scope.validaCertificado = 0;
            }
        }, function(error) {
            alertFactory.error('No se puede obtener el historico de la orden.');
        });
    }

    $scope.archivoEvidencia = function(dato) {
        if (dato == 1)
            var url = $rootScope.docServer + '/orden/' + $scope.idOrdenURL + '/comprobanteRecepcion/ComprobanteRecepcion.pdf';
        window.open(url);
    }

    $scope.OpenTrabajo = function() {
        var url = $rootScope.docServer + '/orden/' + $scope.idOrdenURL + '/hojaTrabajo/Recibo_Comprobante.pdf';
        window.open(url);
    }

    $scope.acciones = function() {
        if (($scope.comentaAccion != undefined && $scope.comentaAccion != "") && ($scope.fechaAccion != undefined && $scope.fechaAccion != "")) {
            detalleRepository.postAcciones($scope.comentaAccion, $scope.fechaAccion, $scope.userData.idUsuario, $scope.idOrdenURL).then(function(result) {
                if (result.data.length > 0) {
                    alertFactory.success('Se inserto correctamente la Acción');
                    $scope.getOrdenDetalle($scope.userData.idUsuario, $scope.numeroOrden);
                    $scope.comentaAccion = "";
                    $scope.fechaAccion = "";
                }
            }, function(error) {
                alertFactory.error('No se puede guardar accion, intente mas tarde o comuniquese con el administrador');
            });
        } else {
            alertFactory.info('Porfavor llene todos los campos');
        }
    }
    $scope.recordatorio = function() {
        if (($scope.comentaRecordatorio != undefined && $scope.comentaRecordatorio != "") &&
            ($scope.fechaRecordatorio != undefined && $scope.fechaRecordatorio != "") &&
            ($scope.horaRecordatorio != undefined && $scope.horaRecordatorio != "")) {

            $scope.fechaCompleta = $scope.fechaRecordatorio + ' ' + $scope.horaRecordatorio;
            detalleRepository.postRecordatorio($scope.comentaRecordatorio, $scope.fechaCompleta, $scope.userData.idUsuario, $scope.idOrdenURL).then(function(result) {
                if (result.data.length > 0) {
                    alertFactory.success('Se inserto correctamente el Recordatorio');
                    $scope.comentaRecordatorio = "";
                    $scope.fechaRecordatorio = "";
                    $scope.horaRecordatorio = "";
                    $scope.fechaCompleta = "";
                }
            }, function(error) {
                alertFactory.error('No se puede guardar recordatorio, intente mas tarde o comuniquese con el administrador');
            });
        } else {
            alertFactory.info('Porfavor llene todos los campos');
        }
    };

    $scope.editarCita = function() {
        location.href = '/nuevacita?economico=' + $scope.detalleOrden.numeroEconomico;
    };

    $scope.estatusAprobacion = function() {
        detalleRepository.CambiaStatusOrden($scope.detalleOrden.idOrden, $scope.idUsuario).then(function(result) {
            $scope.init();
        });
    };
});
