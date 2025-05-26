const { response } = require("express");
const fs = require("fs");
const path = require("path");

// Obtener archivos por id_escena
const obtenerArchivosPorIdEscena = async (req, res = response) => {
  const id_escena = req.params.id;
  try {
    // Consulta para obtener archivos por id_escena
    const [data] = await global.db.query(
      "SELECT * FROM archivo WHERE id_escena = ?",
      [id_escena]
    );

    // Procesar los retos y leer los archivos desde la carpeta 'uploads'
    const archivosConContenido = data.map((archivo) => {
      const filePath = path.join(__dirname, "../uploads", archivo.url);

      // Parsear retos si existen
      let retos = null;
      if (archivo.retos) {
        try {
          retos = JSON.parse(archivo.retos);
        } catch (e) {
          retos = archivo.retos; // Si no es JSON válido, dejar el valor original
        }
      }

      let fileContent = null;
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        fileContent = fileBuffer.toString("base64");
      }

      return {
        ...archivo,
        retos,
        fileContent,
      };
    });

    res.json({
      ok: true,
      msg: "obtenerArchivosPorIdEscena",
      data: archivosConContenido,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener archivos por id_escena",
    });
  }
};

// Obtener archivos con paginación
const obtenerArchivos = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE) || 10;

  try {
    // Consulta para obtener archivos con paginación
    const [archivos] = await global.db.query(
      "SELECT * FROM archivo LIMIT ?, ?",
      [desde, registropp]
    );

    // Consulta para obtener el total de registros
    const [[{ total }]] = await global.db.query(
      "SELECT COUNT(*) as total FROM archivo"
    );

    res.json({
      ok: true,
      msg: "obtenerArchivos",
      archivos,
      page: {
        desde,
        registropp,
        total,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener archivos",
    });
  }
};

// Crear un nuevo archivo
const crearArchivo = async (req, res = response) => {
  const { titulo, tipo, url, id_escena } = req.body;

  try {
    // Insertar un nuevo archivo
    const [result] = await global.db.query(
      "INSERT INTO archivo (titulo, tipo, url, id_escena) VALUES (?, ?, ?, ?)",
      [titulo, tipo, url, id_escena]
    );

    res.json({
      ok: true,
      msg: "Archivo creado",
      archivo: {
        id: result.insertId,
        titulo,
        tipo,
        url,
        id_escena,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando archivo",
    });
  }
};

// Actualizar un archivo existente
const actualizarArchivo = async (req, res = response) => {
  const id = req.params.id;
  const { titulo, tipo, url, id_escena } = req.body;

  try {
    // Actualizar un archivo existente
    const [result] = await global.db.query(
      "UPDATE archivo SET titulo = ?, tipo = ?, url = ?, id_escena = ? WHERE id = ?",
      [titulo, tipo, url, id_escena, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El archivo no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Archivo actualizado",
      archivo: {
        id,
        titulo,
        tipo,
        url,
        id_escena,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando archivo",
    });
  }
};

// Eliminar un archivo
const borrarArchivo = async (req, res = response) => {
  const id = req.params.id;

  try {
    // Eliminar un archivo
    const [result] = await global.db.query("DELETE FROM archivo WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El archivo no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Archivo eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando archivo",
    });
  }
};

module.exports = {
  obtenerArchivosPorIdEscena,
  obtenerArchivos,
  crearArchivo,
  actualizarArchivo,
  borrarArchivo,
};
