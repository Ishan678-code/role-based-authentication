const express = require("express");
const authmiddleware = require("../middleware/auth-middleware");
const adminmiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {uploadImageController, fetchImageController, deleteImageController} = require("../controllers/image-controller");

const router = express.Router();

//upload the image

router.post(
  "/upload",
  authmiddleware,
  adminmiddleware,
  uploadMiddleware.single("image"),
  uploadImageController,
  
);

router.get("/image",authmiddleware,fetchImageController);

router.delete("/image/:id",authmiddleware,adminmiddleware,deleteImageController)
//get the image

module.exports = router;
