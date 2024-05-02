import {User} from "../models/usershema.js";

export function getUserByEmail(req) {
  return User.findOne({ email: req.body.email });
}

export function getUserById(userId) {
  return User.findById(userId).select("_id name email");
}
