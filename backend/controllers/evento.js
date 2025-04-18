const { response } = require("express");

// Obtener eventos con paginación
const obtenerEventos = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE) || 10;

  try {
    // Consulta para obtener eventos con paginación
    const [eventos] = await global.db.query("SELECT * FROM evento LIMIT ?, ?", [
      desde,
      registropp,
    ]);

    // Consulta para obtener el total de registros
    const [[{ total }]] = await global.db.query(
      "SELECT COUNT(*) as total FROM evento"
    );

    res.json({
      ok: true,
      msg: "obtenerEventos",
      eventos,
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
      msg: "Error al obtener eventos",
    });
  }
};

// Crear un nuevo evento
const crearEvento = async (req, res = response) => {
  const { fecha, tipo, id_experiencia } = req.body;

  try {
    // Insertar un nuevo evento
    const [result] = await global.db.query(
      "INSERT INTO evento (fecha, tipo, id_experiencia) VALUES (?, ?, ?)",
      [fecha, tipo, id_experiencia]
    );

    res.json({
      ok: true,
      msg: "Evento creado",
      evento: {
        id: result.insertId,
        fecha,
        tipo,
        id_experiencia,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando evento",
    });
  }
};

// Actualizar un evento existente
const actualizarEvento = async (req, res = response) => {
  const id = req.params.id;
  const { fecha, tipo, id_experiencia } = req.body;

  try {
    // Actualizar un evento existente
    const [result] = await global.db.query(
      "UPDATE evento SET fecha = ?, tipo = ?, id_experiencia = ? WHERE id = ?",
      [fecha, tipo, id_experiencia, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Evento actualizado",
      evento: {
        id,
        fecha,
        tipo,
        id_experiencia,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando evento",
    });
  }
};

// Eliminar un evento
const borrarEvento = async (req, res = response) => {
  const id = req.params.id;

  try {
    // Eliminar un evento
    const [result] = await global.db.query("DELETE FROM evento WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El evento no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Evento eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando evento",
    });
  }
};

module.exports = {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  borrarEvento,
};
