const withAuth = (req, res, next) => {
    if (!req.session.logged_in) {
      res.redirect('dashboard');
    } else {
      next();
    };
  };
  
  module.exports = withAuth;
  