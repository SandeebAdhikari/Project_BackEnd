import { getAllStaffFromDB, getStaffByIdFromDB } from "../models/staffModel.js";

export async function getAllStaff(req, res) {
  try {
    const staff = await getAllStaffFromDB();
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
}

export async function getStaffById(req, res) {
  try {
    const id = req.params.id;
    const staff = await getStaffByIdFromDB(id);

    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff by id:", err);
    res.status(500).json({ error: "Failed to fetch staff by id" });
  }
}
