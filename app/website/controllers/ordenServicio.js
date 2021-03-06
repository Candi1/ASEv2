var OrdenServicioView = require('../views/ejemploVista'),
    OrdenServicioModel = require('../models/dataAccess2');
var dirname = 'E:/ASEv2Documentos/public/orden/';

var OrdenServicio = function(conf) {
    this.conf = conf || {};

    this.view = new OrdenServicioView();
    this.model = new OrdenServicioModel({
        parameters: this.conf.parameters
    });

    this.response = function() {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//Obtiene las ordenes pendientes por cobrar
OrdenServicio.prototype.get_getTotalOrdenes = function(req, res, next) {
    var self = this;
    var params = [];


    this.model.query('SEL_ORDENES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Verifica si existe la orden de servicio
OrdenServicio.prototype.get_getOrdenExistente = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_EXISTE_ORDEN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Verifica si existe la orden de servicio
OrdenServicio.prototype.get_numerosOrdenes = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idContratoOperacion',
        value: req.query.idContratoOperacion,
        type: self.model.types.INT
    }];

    this.model.query('SEL_NUM_ORDEN_OPERACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}


// Obtiene las acciones existentes por Orden
OrdenServicio.prototype.get_getOrdenAcciones = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_DETALLE_ORDEN_ACCIONES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

// Obtiene los detalles de cliente por Orden
OrdenServicio.prototype.get_getOrdenCliente = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_DETALLE_ORDEN_CLIENTE_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

// Obtiene los documentos por orden
OrdenServicio.prototype.get_getOrdenDocumentos = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_DETALLE_ORDEN_DOCUMENTACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

// Obtiene las evidencias por Orden
OrdenServicio.prototype.get_getOrdenEvidencias = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_DETALLE_ORDEN_EVIDENCIA_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

// Obtien los detalles de una orden
OrdenServicio.prototype.get_getOrdenDetalle = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.query.numeroOrden,
        type: self.model.types.STRING
    }];

    this.model.query('SEL_DETALLE_ORDEN_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.get_getTalleres = function(req, res, next) {
    var self = this;
    var params = [];
    //LQMA 14062017 se cambio SEL_TALLER_PRUEBA_SP por SEL_TALLERES_SP
    this.model.query('SEL_TALLERES_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.get_getPartidasTaller = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idTaller',
        value: req.query.idTaller,
        type: self.model.types.INT
    }, {
        name: 'especialidad',
        value: req.query.especialidad,
        type: self.model.types.STRING
    },{
        name: 'idContratoOperacion',
        value: req.query.idContratoOperacion,
        type: self.model.types.INT
    }];

    this.model.query('SEL_PARTIDAS_TALLER_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//crea nuevo comprobante de recepción
OrdenServicio.prototype.post_agregarModuloComprobante = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'idCatalogoModuloCOmprobante',
        value: req.body.idCatalogoModuloCOmprobante,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.body.numeroOrden,
        type: self.model.types.STRING
    },{
        name: 'idUsuario',
        value: req.body.idUsuario,
        type: self.model.types.INT
    }];

    this.model.post('INS_COMPROBANTE_RECEPCION_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//crea detalles del comprobante de recepción
OrdenServicio.prototype.post_agregarDetalleModuloComprobante = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
        name: 'accion',
        value: req.body.accion,
        type: self.model.types.INT
    }, {
        name: 'idCatalogoDetalleModuloComprobante',
        value: req.body.idCatalogoDetalleModuloComprobante,
        type: self.model.types.INT
    }, {
        name: 'idModuloComprobante',
        value: req.body.idModuloComprobante,
        type: self.model.types.INT
    }, {
        name: 'descripcion',
        value: req.body.descripcion,
        type: self.model.types.STRING
    }];

    this.model.post('INS_COMPROBANTE_RECEPCION_DETALLE_SP', params, function(error, result) {
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.get_getdatosComprobante = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;
    // try{

    // if( req.query.idTipoUnidad == null || req.query.idTipoUnidad == '' ){
    //     object.result = {success: false, msg: 'No se ha proporcionado el Número de Orden.'};
    //     self.view.expositor(res, object);
    // }
    // else if( req.query.estatus == null || req.query.estatus == '' ){
    //     object.result = {success: false, msg: 'No se ha proporcionado el Estatus.'};
    //     self.view.expositor(res, object);
    // }
    // else{
    var params = [
        { name: 'idTipoUnidad', value: req.query.idTipoUnidad, type: self.model.types.INT }

    ];

    self.model.query('SEL_MODULOS_COMPROBANTE_RECEPCION_SP', params, function(error, result) {
        var modulosComprobante = result;
        var tamanio = modulosComprobante.length;
        var contador = 0;
        var i = 0;

        if (modulosComprobante.length != 0) {
            modulosComprobante.forEach(function(item, key) {
                var params = [
                    { name: 'idCatalogoModuloComprobante', value: item.idCatalogoModuloComprobante, type: self.model.types.INT }
                ];

                self.model.query('SEL_DETALLE_MODULOS_COMPROBANTE_RECEPCION_SP', params, function(err, datos) {
                    modulosComprobante[key].detalle = datos;

                    if (key >= (tamanio - 1)) {
                        self.view.expositor(res, {
                            error: error,
                            result: {
                                success: true,
                                msg: 'Se encontraron ' + modulosComprobante.length + ' registros.',
                                data: modulosComprobante
                            }
                        });
                    }
                });
            });
        } else {
            object.result = { success: false, msg: 'No se encontraron resultados' };
            self.view.expositor(res, object);
        }
    });

    //crea nuevo comprobante de recepción



}


OrdenServicio.prototype.post_cancelarOrden = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'numeroOrden',
        value: req.body.numeroOrden,
        type: self.model.types.STRING
    }, {
        name: 'idEstatus',
        value: req.body.idEstatus,
        type: self.model.types.INT
    }, {
        name: 'idUsuario',
        value: req.body.idUsuario,
        type: self.model.types.INT
    }];

    this.model.post('UPD_ESTATUS_ORDEN_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.post_agregarEvidencias = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'nombreEvidencia',
        value: req.body.nombreEvidencia,
        type: self.model.types.STRING
    }, {
        name: 'descripcionEvidencia',
        value: req.body.descripcionEvidencia,
        type: self.model.types.STRING
    }, {
        name: 'rutaEvidencia',
        value: req.body.rutaEvidencia,
        type: self.model.types.STRING
    }, {
        name: 'idOrden',
        value: req.body.idOrden,
        type: self.model.types.STRING
    }];

    this.model.post('INS_EVIDENCIAS_ORDEN_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.post_agregarAcciones= function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'nombreAccion',
        value: req.body.nombreAccion,
        type: self.model.types.STRING
    }, {
        name: 'fechaAccion',
        value: req.body.fechaAccion,
        type: self.model.types.STRING
    }, {
        name: 'idUsuario',
        value: req.body.idUsuario,
        type: self.model.types.INT
    }, {
        name: 'numeroOrden',
        value: req.body.numeroOrden,
        type: self.model.types.STRING
    }, {
        name: 'recordatorio',
        value: req.body.recordatorio,
        type: self.model.types.INT
    }];

    this.model.post('INS_ACCION_ORDEN_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.get_getRecepcionInfo = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idOrden',
        value: req.query.idOrden,
        type: self.model.types.INT
    }];

    this.model.query('SEL_DATOS_COMPROBANTE_RECEPCION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.post_newpdf = function(req, res, next) {

    var http = require('http'),
        fs = require('fs');
    var filename = 'ComprobanteRecepcion';
    var idOrden = req.body.idOrden;
    var filePath = dirname + idOrden + '/comprobanteRecepcion/' + filename + '.pdf';
    var fileresponse = '/orden/' + idOrden + '/comprobanteRecepcion/' + filename + '.pdf';

    if(idOrden != undefined || idOrden != null){
        if (!fs.existsSync(dirname + idOrden))
            fs.mkdirSync(dirname + idOrden);
        if (!fs.existsSync(dirname + idOrden + '/evidencia'))
            fs.mkdirSync(dirname + idOrden + '/evidencia');
        if (!fs.existsSync(dirname + idOrden + '/hojaTrabajo'))
            fs.mkdirSync(dirname + idOrden + '/hojaTrabajo');
        if (!fs.existsSync(dirname + idOrden + '/factura'))
            fs.mkdirSync(dirname + idOrden + '/factura');
        if (!fs.existsSync(dirname + idOrden + '/comprobanteRecepcion'))
            fs.mkdirSync(dirname + idOrden + '/comprobanteRecepcion')
    }

    var options = {
        "method": "POST",
        "hostname": "189.204.141.193",
        "port": "5488",
        "path": "/api/report",
        "headers": {
            "content-type": "application/json"
        }
    };

    var request = http.request(options, function(response) {
        var chunks = [];

        response.on("data", function(chunk) {
            chunks.push(chunk);
        });

        response.on("end", function() {
            var body = Buffer.concat(chunks);

            fs.writeFile(filePath, body, function(err) {
                if (err) return console.log(err);
                //console.log('Archivo creado');
            });

        });
    });

    request.write(JSON.stringify(req.body.values));
    request.end();

    var self = this;

    self.view.expositor(res, {
        error: null,
        //result: filename
        result: fileresponse
    });
};

// Obtien los detalles de una orden
OrdenServicio.prototype.get_getCitizacionDetalle = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idCotizacion',
        value: req.query.idCotizacion,
        type: self.model.types.INT
    }, {
        name: 'usuario',
        value: req.query.usuario,
        type: self.model.types.INT
    }];

    this.model.query('SEL_PARTIDAS_APROBACION_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.post_estatusRecepcion = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'idUsuario',
        value: req.body.idUsuario,
        type: self.model.types.INT
    },{
        name: 'idOrden',
        value: req.body.idOrden,
        type: self.model.types.INT
    }];

    this.model.post('UPD_ESTATUS_RECEPCION_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.get_getaprobacionprovision = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idContratoOperacion',
        value: req.query.idContratoOperacion,
        type: self.model.types.INT
        }];

    this.model.query('SEL_APROBACION_DE_PROVISION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.get_validacionAprobacion = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idOrden',
        value: req.query.idOrden,
        type: self.model.types.INT
        }];

    this.model.query('SEL_VALIDA_UTILIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.post_utilidad = function(req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    var self = this;

    var params = [{
        name: 'idOrden',
        value: req.body.idOrden,
        type: self.model.types.INT
    },{
        name: 'idUsuario',
        value: req.body.idUsuario,
        type: self.model.types.INT
    },{
        name: 'margenAprobacion',
        value: req.body.margenAprobacion,
        type: self.model.types.DECIMAL
    }];

    this.model.post('INS_UTILIDAD_SP', params, function(error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

OrdenServicio.prototype.get_getAprobacionUtilidad = function (req, res, next) {
    var self = this;
    var params = [];

    this.model.query('SEL_APROBACION_DE_UTILIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

OrdenServicio.prototype.get_getPartidasUnidad = function(req, res, next) {
    var self = this;
    var params = [{
        name: 'idTipoUnidad',
        value: req.query.idTipoUnidad,
        type: self.model.types.INT
    }, {
        name: 'idContratoOperacion',
        value: req.query.idContratoOperacion,
        type: self.model.types.INT
    }];

    this.model.query('SEL_PARTIDAS_TIPO_UNIDAD_SP', params, function(error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
module.exports = OrdenServicio;
