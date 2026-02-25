const logger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
  console.log(logMessage);
  next();
};

module.exports = logger;
