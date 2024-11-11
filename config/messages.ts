export const MESSAGES = {
  AUTH: {
    SUCCESS: {
      REGISTERED: 'User registered successfully',
      LOGGED_IN: 'Logged in successfully',
      LOGGED_OUT: 'Logged out successfully',
    },
    ERROR: {
      UNAUTHORIZED: 'Unauthorized access',
      INVALID_CREDENTIALS: 'Invalid credentials',
    },
  },
  POSTS: {
    SUCCESS: {
      CREATED: 'Post created successfully',
      UPDATED: 'Post updated successfully',
      DELETED: 'Post deleted successfully',
    },
    ERROR: {
      NOT_FOUND: 'Post not found',
      UNAUTHORIZED: 'Not authorized to perform this action',
    },
  },
  COMMENTS: {
    SUCCESS: {
      CREATED: 'Comment added successfully',
      UPDATED: 'Comment updated successfully',
      DELETED: 'Comment deleted successfully',
    },
    ERROR: {
      NOT_FOUND: 'Comment not found',
    },
  },
} as const

export type Messages = typeof MESSAGES
