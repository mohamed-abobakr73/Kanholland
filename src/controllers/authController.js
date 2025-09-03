import { loginUser } from "../services/authService.js";

export async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    return res.json(result);
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ errors: err.errors });
    }
    return res.status(401).json({ message: err.message || "Login failed" });
  }
}
