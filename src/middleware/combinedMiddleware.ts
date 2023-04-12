import roleMiddleware from "./roleMiddleware";
import tokenDecodingMiddleware from "./tokenDecodingMiddleware";

export const combinedMiddleware = (roles: string[]) => {
  return (req, res, next) => {
    tokenDecodingMiddleware(req, res, () => {
      roleMiddleware(roles)(req, res, () => {
        next();
      });
    });
  };
};
