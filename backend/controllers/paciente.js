const { response } = require("express");

// Obtener pacientes con paginación
const obtenerPacientes = async (req, res = response) => {
  const desde = Number(req.query.desde) || 0;
  const registropp = Number(process.env.DOCSPERPAGE) || 10;
  const id = req.query.id || null;

  try {
    let pacientes, total;

    if (id) {
      // Obtener un paciente específico por ID
      [pacientes] = await global.db.query(
        "SELECT * FROM paciente WHERE id = ?",
        [id]
      );
      total = pacientes.length;
    } else {
      // Obtener todos los pacientes con paginación
      [pacientes] = await global.db.query("SELECT * FROM paciente LIMIT ?, ?", [
        desde,
        registropp,
      ]);
      [[{ total }]] = await global.db.query(
        "SELECT COUNT(*) as total FROM paciente"
      );
    }

    res.json({
      ok: true,
      msg: "obtenerPacientes",
      pacientes,
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
      msg: "Error al obtener pacientes",
    });
  }
};

// Crear un nuevo paciente
const crearPaciente = async (req, res = response) => {
  const { nombre, comentarios, fechaAlta } = req.body;

  try {
    // Insertar un nuevo paciente
    const [result] = await global.db.query(
      "INSERT INTO paciente (nombre, comentarios, fechaAlta) VALUES (?, ?, ?)",
      [nombre, comentarios, fechaAlta]
    );

    res.json({
      ok: true,
      msg: "Paciente creado",
      paciente: {
        id: result.insertId,
        nombre,
        comentarios,
        fechaAlta,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error creando paciente",
    });
  }
};

// Actualizar un paciente existente
const actualizarPaciente = async (req, res = response) => {
  const id = req.params.id;
  const { nombre, comentarios, fechaAlta } = req.body;

  try {
    // Actualizar un paciente existente
    const [result] = await global.db.query(
      "UPDATE paciente SET nombre = ?, comentarios = ?, fechaAlta = ? WHERE id = ?",
      [nombre, comentarios, fechaAlta, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El paciente no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Paciente actualizado",
      paciente: {
        id,
        nombre,
        comentarios,
        fechaAlta,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando paciente",
    });
  }
};

// Eliminar un paciente
const borrarPaciente = async (req, res = response) => {
  const id = req.params.id;

  try {
    // Eliminar un paciente
    const [result] = await global.db.query(
      "DELETE FROM paciente WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        ok: false,
        msg: "El paciente no existe",
      });
    }

    res.json({
      ok: true,
      msg: "Paciente eliminado",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error borrando paciente",
    });
  }
};

module.exports = {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  borrarPaciente,
};
