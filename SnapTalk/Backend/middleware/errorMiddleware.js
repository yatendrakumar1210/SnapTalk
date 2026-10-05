const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack || err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    code: err.code || 'SERVER_ERROR'
  });
};

module.exports = errorHandler;
