import jwt from "jsonwebtoken";
import { getUserById } from "./userRoute.js";

const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers) {
    console.log("true block");
    try {
      console.log(req.headers)
      token = await req.headers["x-auth-token"];
      if (!token) {
        return res.status(400).send({ message: "Invalid Authorization" });
      }
      const decode = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decode);
      req.user = await getUserById(decode.id);
      next();
    } catch (err) {
      console.log(err)
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

export {isAuthenticated} ;
