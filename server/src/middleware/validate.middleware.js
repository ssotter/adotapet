export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (err) {
      const issues = err.errors ?? err.issues ?? [{ message: err.message }];
      return res.status(400).json({ error: issues });
    }
  };
}
