const User = require("../models/user");
const { hashPassword, sanitizeUser } = require("../utils/auth");

// GET /api/users (admin)
exports.getUsers = async (req, res) => {
  try {
    const { search = "", role, page = 1, limit = 20 } = req.query;
    const q = {};

    if (search) {
      q.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { username: new RegExp(search, "i") },
      ];
    }
    if (role) q.role = role;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, count] = await Promise.all([
      User.find(q).select("-password").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
      User.countDocuments(q),
    ]);

    res.json({ items, total: count, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id (admin or self)
exports.getUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/users/:id (admin or self)
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Prevent role changes by non-admins
    if (req.user.role !== "admin") delete updates.role;

    const updated = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true, runValidators: true,
    }).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
