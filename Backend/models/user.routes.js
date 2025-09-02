// routes/user.routes.js
// Add this route for searching users by name
router.get("/search/:query", async (req, res) => {
  const query = req.params.query;
  const users = await User.find({
    $or: [
      { firstName: { $regex: query, $options: "i" } },
      { lastName: { $regex: query, $options: "i" } },
      { userName: { $regex: query, $options: "i" } }
    ]
  }).select("_id firstName lastName profileImage userName");
  res.status(200).json(users);
});
