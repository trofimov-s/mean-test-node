const { Router } = require("express");
const router = new Router();
const isAuth = require("../middleware/isAuth");
const PostsController = require("../controllers/posts");
const extractFile = require('../middleware/file');

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPost);

router.post(
  "",
  isAuth,
  extractFile,
  PostsController.postPost
);

router.patch(
  "/:id",
  isAuth,
  extractFile,
  PostsController.patchPost
);

router.delete("/:id", isAuth, PostsController.deletePost);

module.exports = router;
