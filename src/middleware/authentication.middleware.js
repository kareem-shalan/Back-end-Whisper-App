import { asyncHandler } from "../utils/response.js"
import { decodedToken, tokenType } from "../utils/security/token.security.js"

export const authenticationMiddleware = ({ tokenType: type = tokenType.access } = {}) => {
    return asyncHandler(async (req, res, next) => {
      req.user = await decodedToken({
        next,
        authorization: req.headers.authorization,
        tokenType: type,
      });
      return next();
    });
  };
  