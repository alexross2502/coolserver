export default function (roles) {
  return function (req, res, next) {
    try {
      let hasRole = roles.includes(req.user.role);
      if (!hasRole) {
        throw new Error("error");
      }
      next();
    } catch (e) {
      return res.status(401).json({ message: "Unauthorized" }).end();
    }
  };
}
