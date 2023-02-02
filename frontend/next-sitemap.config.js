module.exports = {
  siteUrl: process.env.SITE_URL || `http://localhost:${process.env.PORT || 3000}`,
  generateRobotsTxt: true, // optional
};
