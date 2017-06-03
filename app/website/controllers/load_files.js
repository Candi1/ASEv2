var type_images     = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG", "gif", "GIF"];
var type_pdfs       = ["pdf", "PDF"];
var type_docs       = ["pdf", "PDF", "doc", "DOC", "docx", "DOCX"];
var type_xml        = ["xml", "XML"];
var type_excel      = ["xls", "XLS", "xlsx", "XLSX"];
var opt_dest_fields;
var Respuesta        = [];

var Load_Files = function(){
    // Clase Upload
    // Desarrollado por Ing. Alejandro Grijalva Antonio
}

Load_Files.prototype.upload = function( destino, req, res, miCallback ) { // Type Options: * / img / xml / pdf / docs / xls
    var index = 0;    
    var multer = require('multer');
    Respuesta        = [];
    var storage = multer.diskStorage({
        destination: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();

            if( opt_dest_fields === undefined ){
                callback( null, destino );
                // Respuesta.push( { fieldname: fieldname, success:true, msg: "Se cargo correctamente"} );
                Respuesta.push({ 
                    fieldname: fieldname, 
                    success:true, 
                    msg: "Se cargo correctamente",
                    nombre: file.originalname, 
                    Path: destino + '/' + file.originalname
                });
            }
            else{
                if( opt_dest_fields[ fieldname ] === undefined || opt_dest_fields[ fieldname ] == '' ){
                    callback( null, destino );
                    // Respuesta.push( { fieldname: fieldname, success:true, msg: "Se cargo correctamente"} );
                    Respuesta.push({ 
                        fieldname: fieldname, 
                        success:true, 
                        msg: "Se cargo correctamente",
                        nombre: file.originalname, 
                        Path: destino + '/' + file.originalname
                    });
                }
                else{
                    var lista_tipos = [];
                    switch( opt_dest_fields[ fieldname ].Type ){
                        case 'img' : lista_tipos = type_images; break;
                        case 'xml' : lista_tipos = type_xml; break;
                        case 'pdf' : lista_tipos = type_pdfs; break;
                        case 'docs': lista_tipos = type_docs; break;
                        case 'xls' : lista_tipos = type_excel; break;
                    }
                    
                    if( opt_dest_fields[ fieldname ].Type == '*' || opt_dest_fields[ fieldname ].Type == undefined || opt_dest_fields[ fieldname ].Type == '' ){
                        callback( null, opt_dest_fields[ fieldname ].Path );
                        // Respuesta.push( { fieldname: fieldname, success:true, msg: "Se cargo correctamente"} );
                        var nombre = ( opt_dest_fields[ fieldname ].Name == undefined || opt_dest_fields[ fieldname ].Name == '' ) ? file.originalname : opt_dest_fields[ fieldname ].Name + '.' + extencion;
                        Respuesta.push({ 
                            fieldname: fieldname, 
                            success:true, 
                            msg: "Se cargo correctamente",
                            nombre: nombre, 
                            Path: opt_dest_fields[ fieldname ].Path + '/' + nombre
                        });
                    }
                    else{
                        if( lista_tipos.indexOf( extencion )  != -1 ){
                            callback( null, opt_dest_fields[ fieldname ].Path );
                            // Respuesta.push( { fieldname: fieldname, success:true, msg: "Se cargo correctamente"} );
                            var nombre = ( opt_dest_fields[ fieldname ].Name == undefined || opt_dest_fields[ fieldname ].Name == '' ) ? file.originalname : opt_dest_fields[ fieldname ].Name + '.' + extencion;
                            Respuesta.push({ 
                                fieldname: fieldname, 
                                success:true, 
                                msg: "Se cargo correctamente",
                                nombre: nombre, 
                                Path: opt_dest_fields[ fieldname ].Path + '/' + nombre
                            });
                        }                        
                        else{
                            Respuesta.push({ 
                                fieldname: fieldname, 
                                success:false, 
                                msg: file.originalname + " :: no es el tipo de archivo permitido para esta operación"
                            });
                        }
                    }
                }
            }

            index++;
        },
        filename: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();
            var nameFile  = '';

            if( opt_dest_fields === undefined ){
                nameFile = file.originalname;
            }
            else{
                if( opt_dest_fields[ fieldname ] === undefined || opt_dest_fields[ fieldname ] == '' ){
                    nameFile = file.originalname;
                }
                else{
                    if( opt_dest_fields[ fieldname ].Name == undefined || opt_dest_fields[ fieldname ].Name == '' ){
                        nameFile = file.originalname;
                    }
                    else{
                        nameFile = opt_dest_fields[ fieldname ].Name + '.' + extencion;
                    }
                }
            }  

            callback( null, nameFile );
        }
    });

    // var upload = multer( { storage: storage } ).single('myFile2');
    var upload = multer( { storage: storage } ).any();
    var flag   = true;

    upload( req, res, function( err ){
        flag   = false;
        if( err ){
            miCallback( err );
            return res.end("Error uploading file.");
        }

        miCallback( Respuesta );
    });

    setTimeout( function() {
        if( flag ){
            miCallback( Respuesta );
        }
    },5000);
};

Load_Files.prototype.img = function( destino, req, res, miCallback ) { // Type Options: * / img / xml / pdf / docs / xls
    var index = 0;    
    var multer = require('multer');
    Respuesta        = [];
    var storage = multer.diskStorage({
        destination: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();

            if( type_images.indexOf( extencion )  != -1 ){
                callback( null, destino );
                Respuesta.push({ 
                    fieldname: fieldname, 
                    success:true, 
                    msg: "Se cargo correctamente",
                    nombre: file.originalname, 
                    Path: destino + '/' + file.originalname
                });
            }
            else{
                Respuesta.push({ 
                    fieldname: fieldname, 
                    success:false, 
                    msg: file.originalname + " :: no es el tipo de archivo permitido para esta operación"
                });
            }

            index++;
        },
        filename: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();

            if( type_images.indexOf( extencion )  != -1 ){
                callback( null, file.originalname );
            }
        }
    });

    var upload = multer( { storage: storage } ).any();
    var flagImg   = true;

    upload( req, res, function( err ){
        flagImg   = false;
        if( err ){
            miCallback( err );
            return res.end("Error uploading file.");
        }

        miCallback( Respuesta );
    });

    setTimeout( function() {
        console.log( Respuesta );
        if( flagImg ){
            miCallback( Respuesta );
        }
    },5000);
};

Load_Files.prototype.read_xml = function( req, res, miCallback ) { // Type Options: * / img / xml / pdf / docs / xls
    var destino   = 'app/website/tmp';
    var index     = 0;
    var pathname  = '';
    var multer    = require('multer');
    Respuesta     = [];

    var storage = multer.diskStorage({
        destination: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();
            pathname  = destino + '/' + file.originalname;

            if( type_xml.indexOf( extencion )  != -1 ){
                callback( null, destino );
                Respuesta.push({ 
                    fieldname: fieldname, 
                    success:true, 
                    msg: "Se cargo correctamente",
                    nombre: file.originalname, 
                    Path: pathname
                });
            }
            else{
                Respuesta.push({ 
                    fieldname: fieldname, 
                    success:false, 
                    msg: file.originalname + " :: no es el tipo de archivo permitido para esta operación"
                });
            }

            index++;
        },
        filename: function( req, file, callback ){
            var files     = req.files;
            var fieldname = files[ index ].fieldname;
            var extencion = file.originalname.split('.').pop();

            if( type_xml.indexOf( extencion )  != -1 ){
                callback( null, file.originalname );
            }
        }
    });

    var upload = multer( { storage: storage } ).any();
    var flagImg   = true;

    upload( req, res, function( err ){
        flagImg   = false;
        if( err ){
            miCallback( err );
            return res.end("Error uploading file.");
        }

        var fs = require('fs');

        fs.readFile( pathname , 'utf-8', (err, data) => {
            if(err) {
                miCallback( err );
            } else {
                var parseString = require('xml2js').parseString;
                var xml = data;
                parseString(xml, function (err, result) {
                    if( err ){
                        miCallback( err );
                    }
                    else{
                        miCallback( result );                        
                    }
                });
            }
        });
    });

    setTimeout( function() {
        if( flagImg ){
            miCallback( Respuesta );
        }
    },5000);
};

Load_Files.prototype.options = function( options ) {
    opt_dest_fields = options;
};

module.exports = Load_Files;



/* 
Load_Files.options(); => Proporciones de forma detallada el comportamiento de cada field
    Options = "nameField": {
        "Name": "", // => El nombre con el que se guardara el archivo, si este va vacio se guardara con el nombre original
        "Path": "", // => El directorio donde se guardara el archivo de este field
        "Type": ""  // => Determina el tipo de archivo a cargar
                             *    => Todos los archivos
                            img   => Imagenes con formatos jpg, png, gif
                            xml   => Archivos xml
                            pdf   => Archivos PDF
                            docs  => Archivos de Word y PDF
                            xls   => Archivos de Excel
    } 

upload( callback, Path_General, req, res );
    callback     => Lo que ocurrira cuando se carguen todos los archivos
    Path_General => El directorio que se usara en caso de que no se especifiquen por field

Si no se especifica los options, todos los archivos que se carguen tomara la ruta del Path_General y los nombres de los archivos sera el nombre original



Ejemplo:

var Load_Files = require('../controllers/load_files');

Modulo.prototype.post_subirArchivo = function(req, res, next){

    var self = this;

    var Subir = new Load_Files();
    Subir.options({ 
                    "myFile1": {"Name":"factura001","Path": "C:/ASE_Temp/factura/xml", "Type": "xml"},
                    "myFile2": {"Name":"","Path": "C:/ASE_Temp/factura/pdf", "Type": "*"}
                });

    Subir.upload( function( respuesta ){
        self.view.expositor(res, {
            error: false,
            result: {success: true, respuesta: respuesta }
        });
    },"C:/ASE_Temp", req, res 

}
*/
