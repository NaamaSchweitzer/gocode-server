export const serverResponse = (res, status = 200, message = "") =>
  res.status(status).json(message).end();

// 201 - created
// 404 - not fiund
// 400 - invalid req
// 200 - empty