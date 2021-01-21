const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const lectureController = require('../controllers/lectureController');
const attendanceController = require('../controllers/attendanceController');
const hallController = require('../controllers/hallController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.post('/user/create',
  userController.validateRegister,
  catchErrors(userController.register),
  // authController.login
);

router.post('/lecture/create',
  catchErrors(lectureController.createLecture),
);

router.post('/lecture/:courseNumber/add-teacher',
  catchErrors(lectureController.addTeacherToLecture),
);

router.post('/lecture/:courseNumber/add-students',
  catchErrors(lectureController.addStudentsToLecture),
);

router.post('/lecture/:courseNumber/delete-student',
  catchErrors(lectureController.deleteStudentFromLecture),
);

router.post('/newEntry',
  catchErrors(attendanceController.storeEntry),
);
router.get('/halls',
  catchErrors(hallController.getAll),
);
router.post('/halls/create',
  catchErrors(hallController.storeHall),
);
router.post('/halls/:id/update',
  catchErrors(hallController.updateHall),
);
router.post('/halls/:id/delete',
  catchErrors(hallController.deleteHall),
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

module.exports = router;
