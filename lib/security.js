/**
 * Security utilities for API endpoints
 */

// Rate limiting store (in-memory - use Redis in production)
const rateLimitStore = new Map()

/**
 * Simple rate limiter
 * @param {string} identifier - IP address or user ID
 * @param {number} maxRequests - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True if allowed, false if rate limited
 */
export function rateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  const now = Date.now()
  const key = identifier

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  const record = rateLimitStore.get(key)

  // Reset if window expired
  if (now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return false
  }

  // Increment count
  record.count++
  return true
}

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Validate user ID format
 * @param {string} userId - User ID
 * @returns {boolean} - True if valid
 */
export function isValidUserId(userId) {
  if (!userId || typeof userId !== 'string') return false

  // Allow alphanumeric, hyphens, underscores (CUID format)
  const validFormat = /^[a-zA-Z0-9_-]+$/
  return validFormat.test(userId) && userId.length >= 3 && userId.length <= 50
}

/**
 * Validate course code format
 * @param {string} code - Course code (e.g., CS1050)
 * @returns {boolean} - True if valid
 */
export function isValidCourseCode(code) {
  if (!code || typeof code !== 'string') return false

  // Format: 2-4 letters + 4 digits
  const validFormat = /^[A-Z]{2,4}\d{4}$/
  return validFormat.test(code.toUpperCase())
}

/**
 * Safely log errors without exposing sensitive data
 * @param {Error} error - Error object
 * @param {Object} context - Additional context (sanitized)
 */
export function secureLog(error, context = {}) {
  const safeContext = {
    ...context,
    // Remove sensitive fields
    password: undefined,
    token: undefined,
    apiKey: undefined,
    databaseUrl: undefined,
  }

  console.error({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    context: safeContext,
    timestamp: new Date().toISOString()
  })
}

/**
 * API error handler with safe error messages
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default user-facing message
 * @returns {Object} - Safe error response
 */
export function getSafeErrorResponse(error, defaultMessage = 'An error occurred') {
  // In development, show actual error
  if (process.env.NODE_ENV === 'development') {
    return {
      error: defaultMessage,
      message: error.message,
      stack: error.stack
    }
  }

  // In production, hide error details
  return {
    error: defaultMessage,
    message: 'Please try again or contact support if the problem persists'
  }
}

/**
 * CORS headers configuration
 */
export const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development'
    ? 'http://localhost:3002'
    : process.env.NEXTAUTH_URL || 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
}

/**
 * Apply CORS headers to response
 * @param {Response} res - Next.js response object
 */
export function applyCORS(res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })
}

/**
 * Middleware: Rate limiting
 */
export function withRateLimit(handler, maxRequests = 100, windowMs = 60000) {
  return async (req, res) => {
    const identifier = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'

    if (!rateLimit(identifier, maxRequests, windowMs)) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please slow down and try again later',
        retryAfter: Math.ceil(windowMs / 1000) + ' seconds'
      })
    }

    return handler(req, res)
  }
}

/**
 * Middleware: Input sanitization
 */
export function withSanitization(handler) {
  return async (req, res) => {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeInput(req.body[key])
        }
      })
    }

    // Sanitize query params
    if (req.query && typeof req.query === 'object') {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeInput(req.query[key])
        }
      })
    }

    return handler(req, res)
  }
}

/**
 * Middleware: CORS
 */
export function withCORS(handler) {
  return async (req, res) => {
    applyCORS(res)

    // Handle OPTIONS preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    return handler(req, res)
  }
}

/**
 * Compose multiple middleware
 * Usage: withSecurity(handler) applies all security middleware
 */
export function withSecurity(handler, options = {}) {
  const {
    rateLimit: rateLimitEnabled = true,
    sanitization: sanitizationEnabled = true,
    cors: corsEnabled = true,
    maxRequests = 100,
    windowMs = 60000
  } = options

  let securedHandler = handler

  if (sanitizationEnabled) {
    securedHandler = withSanitization(securedHandler)
  }

  if (rateLimitEnabled) {
    securedHandler = withRateLimit(securedHandler, maxRequests, windowMs)
  }

  if (corsEnabled) {
    securedHandler = withCORS(securedHandler)
  }

  return securedHandler
}

export default {
  rateLimit,
  sanitizeInput,
  isValidUserId,
  isValidCourseCode,
  secureLog,
  getSafeErrorResponse,
  applyCORS,
  withRateLimit,
  withSanitization,
  withCORS,
  withSecurity
}
