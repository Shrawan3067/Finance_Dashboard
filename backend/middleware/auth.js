// Role-based authorization without JWT tokens
export const protect = (req, res, next) => {
  // No authentication required - just pass through
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    // Get role from query parameter (for testing purposes)
    const userRole = req.query.role || 'viewer';
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({ 
        message: `Role ${userRole} is not authorized to access this resource` 
      });
    }
    
    // Set user role for downstream middleware
    req.user = { role: userRole };
    next();
  };
};