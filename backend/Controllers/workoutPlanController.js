const WorkoutPlan = require("../models/WorkoutPlan");

// Create Workout Plan
exports.createPlan = async (req, res) => {
  try {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User:', req.user);
    
    const planData = {
      ...req.body,
      createdBy: req.user._id,
      trainer: req.user._id, // Assuming the creator is the trainer
    };

    console.log('Plan data:', JSON.stringify(planData, null, 2));
    const plan = await WorkoutPlan.create(planData);
    
    res.status(201).json({
      success: true,
      message: "Workout plan created successfully",
      data: plan,
    });
  } catch (err) {
    console.error("Create workout plan error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to create workout plan",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
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

// Toggle Status
exports.toggleStatus = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    plan.status = plan.status === "active" ? "inactive" : "active";
    await plan.save();

    res.json({
      success: true,
      message: `Workout plan ${plan.status === "active" ? "activated" : "deactivated"} successfully`,
      data: plan,
    });
  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to toggle status",
    });
  }
};

// Add Review
exports.addReview = async (req, res) => {
  try {
    const { planId } = req.params;
    const { rating, title, comment } = req.body;

    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    await plan.addReview(req.user._id, rating, title, comment);

    res.json({
      success: true,
      message: "Review added successfully",
      data: plan,
    });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to add review",
    });
  }
};

// Join Workout Plan
exports.joinPlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    if (!plan.canJoin(req.user)) {
      return res.status(400).json({
        success: false,
        message: "Cannot join this workout plan",
      });
    }

    await plan.addMember();

    res.json({
      success: true,
      message: "Successfully joined workout plan",
      data: plan,
    });
  } catch (err) {
    console.error("Join plan error:", err);
    res.status(400).json({
      success: false,
      message: err.message || "Failed to join workout plan",
    });
  }
};

// Leave Workout Plan
exports.leavePlan = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    await plan.removeMember();

    res.json({
      success: true,
      message: "Successfully left workout plan",
      data: plan,
    });
  } catch (err) {
    console.error("Leave plan error:", err);
    res.status(400).json({
      success: false,
      message: "Failed to leave workout plan",
    });
  }
};

// Get Featured Plans
exports.getFeaturedPlans = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const plans = await WorkoutPlan.getFeatured(Number(limit));

    res.json({
      success: true,
      data: plans,
    });
  } catch (err) {
    console.error("Get featured plans error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve featured plans",
    });
  }
};

// Get Plans on Sale
exports.getPlansOnSale = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const plans = await WorkoutPlan.getOnSale(Number(limit));

    res.json({
      success: true,
      data: plans,
    });
  } catch (err) {
    console.error("Get plans on sale error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve plans on sale",
    });
  }
};

// Search Plans
exports.searchPlans = async (req, res) => {
  try {
    const {
      q: query,
      category,
      level,
      minPrice,
      maxPrice,
      rating,
      available,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const options = {
      category,
      level,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      rating: rating ? Number(rating) : undefined,
      available: available === "true",
      sortBy,
      sortOrder,
      page: Number(page),
      limit: Number(limit),
    };

    const plans = await WorkoutPlan.search(query, options);
    const total = await WorkoutPlan.countDocuments({
      status: "active",
      visibility: "public",
      ...(query ? { $text: { $search: query } } : {}),
      ...(category ? { category } : {}),
      ...(level ? { level } : {}),
      ...(minPrice || maxPrice ? {
        price: {
          ...(minPrice ? { $gte: Number(minPrice) } : {}),
          ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
        }
      } : {}),
      ...(rating ? { averageRating: { $gte: Number(rating) } } : {}),
      ...(available === "true" ? { $expr: { $lt: ["$activeMembers", "$maxMembers"] } } : {}),
    });

    res.json({
      success: true,
      data: plans,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    console.error("Search plans error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search plans",
    });
  }
};

// Get Plan by Slug
exports.getPlanBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const plan = await WorkoutPlan.findOne({ slug })
      .populate("trainer", "firstName lastName profileImage")
      .populate("reviews.user", "firstName lastName profileImage");

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (err) {
    console.error("Get plan by slug error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workout plan",
    });
  }
};

// Get Plan Analytics
exports.getPlanAnalytics = async (req, res) => {
  try {
    const { planId } = req.params;

    const plan = await WorkoutPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Workout plan not found",
      });
    }

    const analytics = {
      activeMembers: plan.activeMembers,
      maxMembers: plan.maxMembers,
      averageRating: plan.averageRating,
      reviewCount: plan.reviewCount,
      completionRate: plan.completionRate,
      isAvailable: plan.isAvailable,
      isOnSale: plan.isCurrentlyOnSale,
      discountPercentage: plan.discountPercentage,
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    console.error("Get plan analytics error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve plan analytics",
    });
  }
};
