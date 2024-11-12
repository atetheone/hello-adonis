export const MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  USER_LOGGED_IN: 'Logged in successfully',
  USER_LOGGED_OUT: 'Logged out successfully',
  USER_UNAUTHORIZED: 'Unauthorized access',
  USER_INVALID_CREDENTIALS: 'Invalid user credentials',
  USER_EMAIL_EXISTS: 'Email already exists',

  // Post messages
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_NOT_FOUND: 'Post not found',
  POST_UNAUTHORIZED: 'Not authorized to perform this action',
  // Comment messages
  COMMENT_CREATED: 'Comment added successfully',
  COMMENT_UPDATED: 'Comment updated successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  COMMENT_NOT_FOUND: 'Comment not found',
  COMMENT_UNAUTHORIZED: 'Not authorized to perform this action',
  SERVER_ERROR: 'Server error',
} as const

export type Messages = typeof MESSAGES
