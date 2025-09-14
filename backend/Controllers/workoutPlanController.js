// backend/controllers/workoutPlanController.js
const WorkoutPlan = require("../models/WorkoutPlan");

// Create
exports.createPlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Read all (with search/filter/sort/pagination)
exports.getPlans = async (req, res) => {
  try {
    const {
      search = "",
      level,
      status,
      minPrice,
      maxPrice,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      $and: [
        search
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { trainer: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
              ],
            }
          : {},
        level ? { level } : {},
        status ? { status } : {},
        minPrice ? { price: { $gte: Number(minPrice) } } : {},
        maxPrice ? { price: { ...(minPrice ? { $gte: Number(minPrice) } : {}), $lte: Number(maxPrice) } } : {},
      ],
    };

    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const total = await WorkoutPlan.countDocuments(query);
    const plans = await WorkoutPlan.find(query)
      .sort(sortObj)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      data: plans,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one
exports.getPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Workout plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// Update
exports.updatePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: "Workout plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete
exports.deletePlan = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Workout plan not found" });
    res.json({ message: "Workout plan deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// Optional: toggle status
exports.toggleStatus = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Workout plan not found" });
    plan.status = plan.status === "Active" ? "Inactive" : "Active";
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};
