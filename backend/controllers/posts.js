const Post = require('../models/post')

exports.createPost = (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}`
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId
  })
  post.save()
    .then(result => {
      res.status(201).json({
        message: 'Post added successfully',
        post: result
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "something went wrong!",
        error
      })
    })
}

exports.updatePost = (req, res, next) => {
  let post, imagePath = req.body.imagePath
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`
    imagePath = `${url}/images/${req.file.filename}`
  }
  post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    creator: req.userData.userId
  })

  Post.updateOne({
      _id: req.params.id,
      creator: req.userData.userId
    }, post)
    .then(result => {
      if (result.n > 0)
        res.status(200).json({
          message: 'Post updated successfully',
          post: result
        })
      else
        res.status(401).json({
          message: "Not authorized!",
          error
        })
    })
    .catch(error => {
      res.status(500).json({
        message: "something went wrong!",
        error
      })
    })
}

exports.getPosts = (req, res, next) => {

  /**
   * For scalability:
   *  - create post with `createdOn`
   *  - paginate using following code
   *  MyModel.find( { createdOn: { $lte: request.createdOnBefore } } )
   *    .limit( 10 )
   *    .sort( '-createdOn' )
   */

  const pageSize = +req.query.pagesize,
    currentPage = +req.query.page,
    postQuery = Post.find()

  let fetchedPosts
  if (pageSize, currentPage) {
    // check for alternative in the last lecture
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  postQuery
    .then(posts => {
      fetchedPosts = posts
      return Post.count()
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: fetchedPosts,
        maxPosts: count
      })
    })
    .catch(error => {
      res.status(500).json({
        message: "something went wrong!",
        error
      })
    })
}

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json({
          message: 'Posts fetched successfully',
          post
        })
      } else {
        res.status(404).json({
          message: 'Post not found!'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "something went wrong!",
        error
      })
    })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    })
    .then(result => {
      if (result.n > 0)
        res.status(200).json({
          message: 'Post deleted!'
        })
      else
        res.status(401).json({
          message: "Not authorized!",
          error
        })
    })
    .catch(error => {
      res.status(500).json({
        message: "something went wrong!",
        error
      })
    })
}
