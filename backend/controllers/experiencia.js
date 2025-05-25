const { response } = require("express");
// Obtener experiencias por idPaciente
const obtenerExperienciasPorIdPaciente = async (req, res = response) => {
  const id_paciente = req.params.id_paciente;

  if (!id_paciente) {
    return res.status(400).json({
      ok: false,
      msg: "El id_paciente es requerido",
    });
  }

  try {
    // Obtener experiencias filtradas por id_paciente
    const [data] = await global.db.query(
      `SELECT esc.titulo as nombreEscena, duracion, exp.fechaAlta, estresInicial, estresFinal, id_escena, id_paciente 
      FROM experiencia exp
      JOIN escena esc ON exp.id_escena = esc.id
      WHERE id_paciente = ?`,
      [id_paciente]
    );

    res.json({
      ok: true,
      msg: "obtenerExperienciasPorIdPaciente",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener experiencias por id_paciente",
    });
  }
};
// Obtener experiencias con paginación
const obtenerExperiencias = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE) || 10;
  const id = req.query.id || null;

  try {
    let experiencias, total;

    if (id) {
      // Obtener una experiencia específica por ID
      [experiencias] = await global.db.query(
        "SELECT * FROM experiencia WHERE id = ?",
        [id]
      );
      total = experiencias.length;
    } else {
      // Obtener todas las experiencias con paginación
      [experiencias] = await global.db.query(
        "SELECT * FROM experiencia LIMIT ?, ?",
        [desde, registropp]
      );
      [[{ total }]] = await global.db.query(
        "SELECT COUNT(*) as total FROM experiencia"
      );
    }

    res.json({
      ok: true,
      msg: "obtenerExperiencias",
      experiencias,
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
      msg: "Error al obtener experiencias",
    });
  }
};

// Crear una nueva experiencia
const crearExperiencia = async (req, res = response) => {
  const {
    duracion,
    fechaAlta,
    estresInicial,
    estresFinal,
    id_escena,
    id_paciente,
  } = req.body;

  try {
    // Insertar una nueva experiencia
    const [data] = await global.db.query(
      "INSERT INTO experiencia (duracion, fechaAlta, estresInicial, estresFinal, id_escena, id_paciente) VALUES (?, ?, ?, ?, ?, ?)",
      [duracion, fechaAlta, estresInicial, estresFinal, id_escena, id_paciente]
    );

    res.json({
      ok: true,
      msg: "Experiencia creada",
      data: {
        id: data.insertId,
        duracion,
        fechaAlta,
        estresInicial,
        estresFinal,
        id_escena,
        id_paciente,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando experiencia",
    });
  }
};
const actualizarExperiencia = async (req, res = response) => {
  const id = req.params.id;
  const campos = req.body;

  try {
    // Si se proporciona fechaFin, calcula la duración en minutos
    if (campos.fechaFin) {
      // Obtener la fechaAlta actual de la experiencia
      const [result] = await global.db.query(
        "SELECT fechaAlta FROM experiencia WHERE id = ?",
        [id]
      );

      if (result.length === 0) {
        return res.status(404).json({
          ok: false,
          msg: "La experiencia no existe",
        });
      }

      const fechaAlta = result[0].fechaAlta;

      // Verifica que fechaFin sea mayor que fechaAlta
      if (campos.fechaFin <= fechaAlta) {
        return res.status(400).json({
          ok: false,
          msg: "La fechaFin debe ser mayor que fechaAlta",
        });
      }

      // Calcula la duración en minutos
      campos.duracion = Math.floor((campos.fechaFin - fechaAlta) / 60);
      console.log("Duración calculada:", campos.duracion);
    }

    // Construir la consulta dinámicamente
    const camposActualizados = Object.keys(campos)
      .map((campo) => `${campo} = ?`)
      .join(", ");
    const valores = Object.values(campos);

    if (!camposActualizados) {
      return res.status(400).json({
        ok: false,
        msg: "No se proporcionaron campos para actualizar",
      });
    }

    // Actualizar la experiencia
    const [updateResult] = await global.db.query(
      `UPDATE experiencia SET ${camposActualizados} WHERE id = ?`,
      [...valores, id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "La experiencia no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Experiencia actualizada",
      experiencia: {
        id,
        ...campos,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando experiencia",
    });
  }
};

// Eliminar una experiencia
const borrarExperiencia = async (req, res = response) => {
  const id = req.params.id;

  try {
    // Eliminar una experiencia
    const [result] = await global.db.query(
      "DELETE FROM experiencia WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "La experiencia no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Experiencia eliminada",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando experiencia",
    });
  }
};

module.exports = {
  obtenerExperienciasPorIdPaciente,
  obtenerExperiencias,
  crearExperiencia,
  actualizarExperiencia,
  borrarExperiencia,
};
