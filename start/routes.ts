/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const GreetingsController = () => import('#controllers/greetings_controller')
const AuthController = () => import('#controllers/auth_controller')
const PostsController = () => import('#controllers/posts_controller')
const UsersController = () => import('#controllers/users_controller')
const CommentsController = () => import('#controllers/comments_controller')

/************************************** HOME ROUTES */
router.get('/', () => {
  return {
    hello: 'world',
  }
})

router.get('/about', () => {
  return 'This is the about page.'
})

router.get('/hello/:name', [GreetingsController, 'sayHello'])

/************************************** AUTH ROUTES */
router.group(() => {
  router.post('register', [AuthController, 'register']).as('auth.register')
  router.post('login', [AuthController, 'login']).as('auth.login')
  router.delete('logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
  router.get('me', [AuthController, 'me']).as('auth.me').use(middleware.auth())
})

/******************* USERS ROUTES */
router.get('users', [UsersController, 'index']) // retrieve all users
// router.get('users', '#controllers/users_controller.index')

router.get('users/:id', [UsersController, 'show'])

/************************************** POSTS ROUTES */
router
  .group(() => {
    router.get('/', [PostsController, 'index'])
    router.post('/', [PostsController, 'store'])
    router.get('/:postId', [PostsController, 'show']).where('postId', {
      match: /^[0-9]+$/,
      cast: (value) => Number(value),
    })
    router.put('/:postId', [PostsController, 'update'])
    router.delete('/:postId', [PostsController, 'destroy'])
  })
  .prefix('/posts')
  .use(middleware.auth())

/********************* COMMENTS ROUTES */
router
  .group(() => {
    // Get all comments for a post
    router.get('/', [CommentsController, 'index'])

    // Get a single comment for a post
    router.get('/:commentId', [CommentsController, 'show'])

    // Create a new comment for a post
    router.post('/comments', [CommentsController, 'store'])

    // Update a comment for a post
    router.put('/:commentId', [CommentsController, 'update'])

    // Delete a comment for a post
    router.delete('/:commentId', [CommentsController, 'destroy'])
  })
  .prefix('/posts/:postId/comments')
  .use(middleware.auth())
