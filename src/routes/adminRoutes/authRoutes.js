import express from 'express';
import { authenticateUser, authorizeRoles } from '../../middleware/authorization.js';
import {
  registerClient,
  clientLogin,
  getAllClients,
  updateClient,
  updateClientStatusService,
  deleteClientService
} from '../../controllers/authController.js';
import { validate, clientRegisterSchema, clientLoginSchema } from "../../validators/user/userValidation.js";

const router = express.Router();


router.post('/register', validate(clientRegisterSchema), registerClient);

router.post('/login', validate(clientLoginSchema), clientLogin);

router.get('/users', authenticateUser, authorizeRoles(['admin']), getAllClients);

router.put('/user/:id', authenticateUser, authorizeRoles(['admin']), updateClient);

router.patch('/user-status/:id', authenticateUser, authorizeRoles(['admin']), updateClientStatusService);

router.delete('/user/:id', authenticateUser, authorizeRoles(['admin']), deleteClientService);

export default router;
