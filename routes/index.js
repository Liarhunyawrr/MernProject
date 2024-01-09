var express = require("express");
var router = express.Router();
const usermodel = require("./users");
const passport = require("passport");
const postmodel = require("./post");
const upload = require("./multer");
const upload2 = require("./dp");

const localStrategy = require("passport-local");
passport.use(new localStrategy(usermodel.authenticate()));

router.get("/", function (req, res, next) {
  res.render("demo", { error: req.flash("error") });
});
router.get("/accountsettings", isLoggedIn, async function (req, res, next) {
  const user = await usermodel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("accountsetting", { user });
});
router.get("/login", function (req, res, next) {
  res.render("index", { error: req.flash("error") });
});
router.get("/signup", function (req, res, next) {
  res.render("signup");
});
router.get("/yourposts", isLoggedIn, async function (req, res, next) {
  const user = await usermodel
    .findOne({ username: req.session.passport.user })
    .populate("posts");

  res.render("yourposts", { user });
});
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await usermodel
    .findOne({ username: req.session.passport.user })
    .populate("posts");
  res.render("profile", { user });
});
router.get("/feed", isLoggedIn, async function (req, res, next) {
  try {
    const allUsers = await usermodel.find({}).populate("posts");

    res.render("feed", { user: req.user, users: allUsers });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/upload",
  isLoggedIn,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(404).send("No files were uploaded");
    }

    if (!req.body.posttext) {
      const alertMessage =
        '<div class="alert alert-danger" role="alert">Post text is required</div>';
      return res.status(400).render("profile", { alertMessage });
    }

    const user = await usermodel.findOne({
      username: req.session.passport.user,
    });

    const postdata = await postmodel.create({
      posttext: req.body.posttext,
      image: req.file.filename,
      user: user._id,
    });

    user.posts.push(postdata._id);

    await user.save();
    res.redirect("/yourposts");
  }
);

router.post(
  "/upload2",
  isLoggedIn,
  upload2.single("dp"),
  async function (req, res, next) {
    const user = await usermodel.findOne({
      username: req.session.passport.user,
    });

    user.dp = req.file.filename;
    await user.save();

    res.redirect("/profile");
  }
);

router.post("/register", function (req, res) {
  const userdata = new usermodel({
    username: req.body.username,
    fullname: req.body.fullname,
    email: req.body.email,
  });
  usermodel.register(userdata, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function () {}
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
