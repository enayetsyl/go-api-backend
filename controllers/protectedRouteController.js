export function protectedRoute(req, res) {
  res.status(200).json({ message: "Access granted" });
}
