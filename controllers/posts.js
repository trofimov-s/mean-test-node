const Post = require("../models/post");

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const page = +req.query.page;
  const postQuery = Post.find();

  if (pageSize && page) {
    postQuery.skip(pageSize * (page - 1)).limit(pageSize);
  }

  postQuery
    .then((posts) => {
      return Post.count().then((count) => {
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts,
          total: count,
        });
      });
    })
    .catch(() => {
      res.status(500).json({ message: "Could not find posts." });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .then((post) => {
      const { _id, title, content, imagePath } = post;

      if (!post) {
        res.status(404).json({ message: "Post not found." });
      } else {
        res.status(200).json({ id: _id, title, content, imagePath });
      }
    })
    .catch(() => res.status(500).json({ message: "Could not find a post." }));
};

exports.postPost = (req, res, next) => {
  const { title, content } = req.body;
  const url = req.protocol + "://" + req.get("host");

  const post = new Post({
    title,
    content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });

  post
    .save()
    .then((post) =>
      res.status(201).json({
        message: "Post createed successfully",
        post: {
          id: post._id,
          title,
          content,
          imagePath: post.imagePath,
        },
      })
    )
    .catch(() => res.status(500).json({ message: "Creating a post failed." }));
};

exports.patchPost = (req, res, next) => {
  let imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }

  const id = req.body.id;
  const { title, content } = req.body;
  const post = new Post({ _id: id, title, content, imagePath });

  Post.updateOne({ _id: id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.modifiedCount > 0 || result.matchedCount > 0) {
        res
          .status(200)
          .json({ message: "Updated succcessfully!", post: result });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Updating post failed." });
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Post.deleteOne({ _id: id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Post deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized" });
      }
    })
    .catch(() => res.status(500).json({ message: "Could not delete a post." }));
}
