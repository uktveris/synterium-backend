import { Router } from "express";
import multer from "multer";
import { verifyJwt } from "../middleware/jwtVerifier";
import fileUpload, { fileTestC } from "../controllers/fileUploadController";
import fetchFiles from "../controllers/fileRetrieveController";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/file-upload", verifyJwt, upload.array("files"), fileUpload);
router.get("/", verifyJwt, fetchFiles);
router.get("/files-test", verifyJwt, fileTestC);

export default router;
