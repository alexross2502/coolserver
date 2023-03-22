import { Admin } from "../models/Admin";
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "dev-jwt",
};

module.exports = (passport: { use: (arg0: any) => void }) => {
  passport.use(
    new JwtStrategy(
      options,
      async (
        payload: { login: any },
        done: (arg0: any, arg1: boolean | Admin) => void
      ) => {
        try {
          const user = await Admin.findOne({
            where: { email: payload.login },
          });

          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (e) {
          console.log(e);
        }
      }
    )
  );
};
