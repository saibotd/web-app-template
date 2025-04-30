export function auth(req, res, { redirect = "", role = null } = {}) {
  if (!req.session.user) return res.redirect(redirect || "/login");
  if (role && req.session.user.role !== role) return res.sendStatus(401);
}
