import UserSettings from "../models/UserSettings.js";

export const getSettings = async (req, res) => {
  try {
    const settings = await UserSettings.findOne({ user_id: req.user.id });

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updated = await UserSettings.findOneAndUpdate(
      { user_id: req.user.id },
      req.body,
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Settings updated",
      settings: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
