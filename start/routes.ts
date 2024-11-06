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
router.post('register', [AuthController, 'register']).as('auth.register')
router.post('login', [AuthController, 'login']).as('auth.login')
router.delete('logout', [AuthController, 'logout']).as('auth.logout').use(middleware.auth())
router.get('me', [AuthController, 'me']).as('auth.me')

/******************* USERS ROUTES */
router.get('users', [UsersController, 'index']).use(middleware.auth()) // retrieve all users
// router.get('users', '#controllers/users_controller.index')

router.get('users/:id', [UsersController, 'show']).use(middleware.auth())

/************************************** POSTS ROUTES */
router.post('posts', [PostsController, 'store']).use(middleware.auth())
router.put('posts/:id', [PostsController, 'update']).use(middleware.auth())
router.get('/posts', [PostsController, 'index']).use(middleware.auth())
router
  .get('/posts/:id', [PostsController, 'show'])
  .where('id', {
    match: /^[0-9]+$/, // match only numbers
    cast: (value) => Number(value), // cast the value to a number
  })
  .use(middleware.auth())

router.delete('/posts/:postId', [PostsController, 'destroy']).use(middleware.auth())

/********************* COMMENTS ROUTES */
// Get all comments for a post
router.get('/posts/:postId/comments/', [CommentsController, 'index']).use(middleware.auth())

// Get a single comment for a post
router
  .get('/posts/:postId/comments/:commentId', [CommentsController, 'show'])
  .use(middleware.auth())

// Create a new comment for a post
router
  .post('/posts/:postId/comments/', ({ params }) => {
    console.log(`Post id: ${params.id}`)
  })
  .use(middleware.auth())

// Update a comment for a post
router
  .put('/posts/:postId/comments/:commentId', ({ params }) => {
    console.log(`Post id: ${params.id}`)
    console.log(`Comment id: ${params.commentId}`)
  })
  .use(middleware.auth())

// Delete a comment for a post
router
  .delete('/posts/:postId/comments/:commentId', ({ params }) => {
    console.log(`Post id: ${params.id}`)
    console.log(`Comment id: ${params.commentId}`)
  })
  .use(middleware.auth())
