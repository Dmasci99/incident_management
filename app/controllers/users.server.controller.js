/*
File name: users.server.controller.js
Author: Alex Andriishyn
Website: http://incident-management.azurewebsites.net/
File description: users controller
*/

var mongoose = require('mongoose'),
    passport = require('passport'),
    User = require('../models/user.server.model.js');

// Render the login page
exports.renderLogin = function(req, res, next) {
  // User not logged in, show the login page
  if(!req.user) {
    res.render('login', {
      title: 'Login',
      messages: req.flash('error') || req.flash('info'),
      user: req.user? req.user : ''
    });
    // User already logged in, redirect to users angular app
  } else {
    return res.redirect('/userslist');
  }
};

// Login POST
exports.login = passport.authenticate('local', {
  successRedirect: '/incident',
  failureRedirect: '/login',
  failureFlash: true
});

// logout
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Render the register page
exports.renderRegister = function(req, res, next) {
  if(!req.user) {
    res.render('register', {
      title: 'Register',
      messages: req.flash('error'),
      user: req.user? req.user : ''
    });
    // if user is already logged in, redirect to the main app page
  } else {
    return res.redirect('/');
  }
};

// Register a new user
exports.register = passport.authenticate('local-signup', {
  successRedirect: '/incident',
  failureRedirect: '/register',
  failureFlash: true
});

// Users dashboard
exports.renderUsers = function(req, res, next) {
  // Admin gets all users
  if(req.user.role == 2) {
    User.find(function(err, users) {
      if(err) {
        console.log(err);
        res.end(err);
      } else {
        res.render('users/index', {
          title: 'Users List',
          messages: req.flash('error'),
          editUserID: -1,
          user: req.user,
          users: users
        });
      }
    });
    // Client gets only his own profile
  } else {
    res.render('users/profile', {
      title: req.user.username + '\'s Profile',
      messages: req.flash('error'),
      editUser: req.user, // User being edited
      user: req.user // Active user
    });
  }
};

// Render update user page for admins
exports.renderUpdateUser = function(req, res, next) {

  // Get all Users
  User.findById(req.params.userId, function(err, userProfile) {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.render('users/profile', {
          title: 'Edit user',
          messages: req.flash('error'),
          editUser: userProfile, // User being edited
          user: req.user, // Active user
          usernameTaken: ''
      });
    }
  });
};

// Update user
exports.updateUser = function(req, res, next) {
  var user = new User(req.body);
  user.updated = Date.now();

  User.findOne({'username': user.username},
  function(err, user) {
      if(err) {
          return done(err);
      }
      // Username already exists
      if(user) {
        /**console.log("Found user");
          return done(null, false, {
              message: 'This username is already taken'
          });*/
          User.findById(req.params.userId, function(err, userProfile) {
            if(err) {
              console.log(err);
              res.end(err);
            } else {
              res.render('users/profile', {
                  title: 'Edit user',
                  messages: req.flash('error'),
                  editUser: userProfile, // User being edited
                  user: req.user, // Active user
                  usernameTaken: 'That username is taken'
              });
            }
          });

      }else {
        // Update DB
        User.update({ _id: user._id }, user, function(err) {
          if(err) {
            console.log(err);
            res.end(err);
          } else {
            res.redirect('/users');
          }
        });

      }
  });
};

// Delete user
exports.deleteUser = function(req, res, next) {
  var id = req.params.userId;
  User.remove({ _id: id }, function(err) {
    if(err) {
      console.log(err);
      res.end(err);
    } else {
      res.redirect('/users');
    }
  });
}
