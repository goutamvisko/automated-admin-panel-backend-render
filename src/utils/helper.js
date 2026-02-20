

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const getMidnightExpiry = () => {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight;
};

export const getSecondsUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
};



export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


export function generateApiKey() {
  const apiKey = 'api_' + crypto.randomBytes(32).toString('hex');
  const hashedApiKey = crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');

  return {
    apiKey,           
    hashedApiKey      
  };
}

export async function generateSecretKey() {
  const secretKey = crypto.randomBytes(64).toString('hex');
  const hashedSecretKey = await bcrypt.hash(secretKey, 12);

  return {
    secretKey,         
    hashedSecretKey     
  };
}

// export const findRoleById = async (id) => {
//   const role = await Role.findByPk(id);
//   return role ? role.name : null; 
// };

// export const findRolebyName = async (name) => {
//     let withouutSpaceRole = name.replace(/\s+/g, '');
//     const role = await Role.findOne({
//         where:{name:withouutSpaceRole}
//     })
//     return role
// }


