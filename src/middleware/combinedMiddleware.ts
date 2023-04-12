import roleMiddleware from "./roleMiddleware";
import tokenDecoding from "./tokenDecoding";

export const combinedMiddleware = (roles: string[]) => {
  return (req, res, next) => {
    tokenDecoding(req, res, () => {
      roleMiddleware(roles)(req, res, () => {
        next();
      });
    });
  };
};
