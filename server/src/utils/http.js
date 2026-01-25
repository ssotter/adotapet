export function ok(res, data, status = 200) {
  return res.status(status).json({ data });
}

export function fail(res, message, status = 400, code = "BAD_REQUEST") {
  return res.status(status).json({ error: { message, code } });
}
