import BaseService from "../common/baseService.js";
import User from "../models/user/userModel.js";

export const services = {
  user: new BaseService(User),
};

export default services;