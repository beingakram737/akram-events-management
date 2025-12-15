// File: server/routes/auth.js

import express from 'express';
// ✅ NEW IMPORT: forgotPassword aur resetPassword controllers ko import karein
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.js'; 

const router = express.Router();

router.post('/signup', register);
router.post('/login', login);

// ===================================================================
// ✅ NEW ROUTES FOR PASSWORD RESET
// ===================================================================
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;