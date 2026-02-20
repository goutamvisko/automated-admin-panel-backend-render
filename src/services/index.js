import BaseService from "../common/baseService.js";
import User from "../models/user/userModel.js";
import Auth from "../models/auth/authModel.js";
import Plan from "../models/payment/palnModel.js";

export const services = {
  user: new BaseService(User),
  auth: new BaseService(Auth),
  plan: new BaseService(Plan),
};

export default services;