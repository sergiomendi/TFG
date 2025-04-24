const { response } = require("express");

// Obtener escenas con paginación
const obtenerEscenas = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const hasta = req.query.hasta || "";
  let registropp = Number(process.env.DOCSPERPAGE);
  const id = req.params.id;
  const texto = req.query.texto;
  let textoBusqueda = "";

  if (texto) {
    textoBusqueda = `%${texto}%`; // Usar LIKE para búsquedas parciales en SQL
  }

  if (hasta === "todos") {
    registropp = 1000;
  }

  try {
    let data, total;

    if (id) {
      // Obtener una escena específica por ID
      [data] = await global.db.query("SELECT * FROM escena WHERE id = ?", [id]);
      if (data.length === 1) {
        data = data[0]; // Retornar directamente el objeto si es una única tupla
      }
    } else if (texto) {
      // Buscar escenas por texto
      [data] = await global.db.query(
        "SELECT * FROM escena WHERE titulo LIKE ? LIMIT ?, ?",
        [textoBusqueda, desde, registropp]
      );
      [[{ total }]] = await global.db.query(
        "SELECT COUNT(*) as total FROM escena WHERE titulo LIKE ?",
        [textoBusqueda]
      );
    } else {
      // Obtener todas las escenas con paginación
      [data] = await global.db.query("SELECT * FROM escena LIMIT ?, ?", [
        desde,
        registropp,
      ]);
      [[{ total }]] = await global.db.query(
        "SELECT COUNT(*) as total FROM escena"
      );
    }

    res.json({
      ok: true,
      msg: "obtenerEscenas",
      data,
      page: id ? undefined : { desde, registropp, total },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener escenas",
    });
  }
};

// Crear una nueva escena
const crearEscena = async (req, res = response) => {
  const { titulo, fechaAlta, descripcion } = req.body;

  try {
    // Insertar una nueva escena
    const [result] = await global.db.query(
      "INSERT INTO escena (titulo, fechaAlta, descripcion) VALUES (?, ?, ?)",
      [titulo, fechaAlta, descripcion]
    );

    res.json({
      ok: true,
      msg: "Escena creada",
      escena: {
        id: result.insertId,
        titulo,
        fechaAlta,
        descripcion,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error creando escena",
    });
  }
};

// Actualizar una escena existente
const actualizarEscena = async (req, res = response) => {
  const id = req.params.id;
  const { titulo, fechaAlta, descripcion } = req.body;

  try {
    // Actualizar una escena existente
    const [result] = await global.db.query(
      "UPDATE escena SET titulo = ?, fechaAlta = ?, descripcion = ? WHERE id = ?",
      [titulo, fechaAlta, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "La escena no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Escena actualizada",
      escena: {
        id,
        titulo,
        fechaAlta,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error actualizando escena",
    });
  }
};

// Eliminar una escena
const borrarEscena = async (req, res = response) => {
  const id = req.params.id;

  try {
    // Eliminar una escena
    const [result] = await global.db.query("DELETE FROM escena WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "La escena no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Escena eliminada",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error borrando escena",
    });
  }
};

module.exports = {
  obtenerEscenas,
  crearEscena,
  actualizarEscena,
  borrarEscena,
};
