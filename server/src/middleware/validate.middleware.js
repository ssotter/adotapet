export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }
  };
}
