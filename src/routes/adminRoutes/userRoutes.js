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
  validateClient,
  regenerateApiKey,
  regenerateSecretKey
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

router.post('/:id/regenerate-api-key', authenticateUser, authorizeRoles('admin'), regenerateApiKey);

router.post('/:id/regenerate-secret-key', authenticateUser, authorizeRoles('admin'), regenerateSecretKey);

export default router;
