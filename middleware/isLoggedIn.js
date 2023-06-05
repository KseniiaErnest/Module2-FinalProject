const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/user/login');
  }
  next();
}

module.exports = isLoggedIn;