const XLSX = require('xlsx');

//Genera y descarga un archivo Excel (.xlsx) a partir de un array de objetos (rows)
 
function exportExcel(res, rows, sheetName, filename) {

  // Convierte el array de objetos a una hoja de Excel
  const ws = XLSX.utils.json_to_sheet(rows);

  // Crea un nuevo libro de Excel
  const wb = XLSX.utils.book_new();

  // Agrega la hoja al libro con el nombre indicado
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Convierte el libro a formato buffer (archivo descargable)
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

  // Configura la respuesta para forzar la descarga del archivo
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${filename}"`
  );

  // Define el tipo de archivo Excel
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  // Envía el archivo al cliente
  return res.send(buf);
}

// Exporta la función para poder usarla en otros archivos
module.exports = { exportExcel };