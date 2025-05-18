const { User, Task } = require("../models");

module.exports = {
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({ include: Task });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, { include: Task });
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  },

  async createUser(req, res) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res
          .status(400)
          .json({ message: "Campos requeridos: name, email" });
      }
      const newUser = await User.create({ name, email });
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "El email ya está registrado" });
      }
      res.status(500).json({ message: "Error al crear usuario" });
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const { name, email } = req.body;
      await user.update({ name, email });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      await user.destroy();
      res.json({ message: "Usuario eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  },
};
