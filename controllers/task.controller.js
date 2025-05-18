const { Task, User } = require("../models");

module.exports = {
  async getAllTasks(req, res) {
    try {
      // Filtrado opcional: por estado y user_id (responsable)
      const { status, user_id } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (user_id) filter.user_id = user_id;

      const tasks = await Task.findAll({
        where: filter,
        include: { model: User, attributes: ["id", "name", "email"] },
      });
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener tareas" });
    }
  },

  async getTaskById(req, res) {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: { model: User, attributes: ["id", "name", "email"] },
      });
      if (!task)
        return res.status(404).json({ message: "Tarea no encontrada" });
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener tarea" });
    }
  },

  async createTask(req, res) {
    try {
      const { title, description, status, due_date, user_id } = req.body;

      if (!title || !due_date || !user_id) {
        return res
          .status(400)
          .json({ message: "Campos requeridos: title, due_date, user_id" });
      }

      // Validación fecha límite > hoy
      if (new Date(due_date) <= new Date()) {
        return res
          .status(400)
          .json({ message: "La fecha límite debe ser mayor a hoy" });
      }

      // Verificar que user_id existe
      const user = await User.findByPk(user_id);
      if (!user)
        return res
          .status(400)
          .json({ message: "Usuario responsable no encontrado" });

      const newTask = await Task.create({
        title,
        description,
        status,
        due_date,
        user_id,
      });
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear tarea" });
    }
  },

  async updateTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task)
        return res.status(404).json({ message: "Tarea no encontrada" });

      const { title, description, status, due_date, user_id } = req.body;

      if (due_date && new Date(due_date) <= new Date()) {
        return res
          .status(400)
          .json({ message: "La fecha límite debe ser mayor a hoy" });
      }

      if (user_id) {
        const user = await User.findByPk(user_id);
        if (!user)
          return res
            .status(400)
            .json({ message: "Usuario responsable no encontrado" });
      }

      await task.update({ title, description, status, due_date, user_id });
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar tarea" });
    }
  },

  async deleteTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task)
        return res.status(404).json({ message: "Tarea no encontrada" });

      await task.destroy();
      res.json({ message: "Tarea eliminada" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar tarea" });
    }
  },
};
