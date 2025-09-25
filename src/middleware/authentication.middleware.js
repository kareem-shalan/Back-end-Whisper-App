import { asyncHandler } from "../utils/response.js"
import { decodedToken, tokenType } from "../utils/security/token.security.js"

export const authenticationMiddleware = ({ tokenType: type = tokenType.access } = {}) => {
  return asyncHandler(async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      next,
      authorization: req.headers.authorization,
      tokenType: type,
    });
    req.user = user;
    req.decoded = decoded;
    return next();  

  });
};

export const authorization = ({ accessRoles = [] } = {}) => {
  return asyncHandler(async (req, res, next) => {
    console.log({ accessRoles, currentRole: req.user.role, match: accessRoles.includes(req.user.role) });
    if (!accessRoles.includes(req.user.role)) {
      return next(new Error("You are not authorized to access this resource", { cause: 403 }))
    }
    return next();
  });
};
