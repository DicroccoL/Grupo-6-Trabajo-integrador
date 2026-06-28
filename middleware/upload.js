//importa dos modulos ,multer para manejar los archivos  que suben los usuarios y path para usar rutas de archivos
const multer = require("multer");
const path = require("path");

//le dice donde guardar los archivos gestionados por multer
const upload = multer({
  dest: path.join(__dirname, "../img")
});

module.exports = upload;
