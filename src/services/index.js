import BaseService from "../common/baseService.js";
import User from "../models/user/userModel.js";
import Auth from "../models/module/authModel.js";


export const services = {
  user: new BaseService(User),
  auth: new BaseService(Auth),
};

export default services;