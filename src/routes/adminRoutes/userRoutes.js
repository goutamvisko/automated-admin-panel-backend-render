import express from 'express';
import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';
import {
  addClient,
  adminLogin,
  getAllClients,
  updateClient,
  updateClientStatusService,
  deleteClientService,
  resetAdminPassword,
  validateClient
} from '../../controllers/userController/userController.js';
// import { validate, clientRegisterSchema, clientLoginSchema } from "../../validators/user/userValidation.js";

const router = express.Router();


router.post('/register', addClient);

router.post('/login', adminLogin);

router.post('/validate',  validateClient);

router.get('/', authenticateUser, authorizeRoles('admin'), getAllClients);

router.put('/:id', authenticateUser, authorizeRoles('admin'), updateClient);

router.put( "/reset-password",authenticateUser, authorizeRoles('admin'), resetAdminPassword);

router.patch('/:id', authenticateUser, authorizeRoles('admin'), updateClientStatusService);

router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteClientService);

export default router;
