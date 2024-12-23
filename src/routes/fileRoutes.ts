import { Router } from "express";
import multer from "multer";
import { verifyJwt } from "../middleware/jwtVerifier";
import fileUpload from "../controllers/fileUploadController";
import fetchFiles from "../controllers/fileRetrieveController";
import downloadFile from "../controllers/fileDownloadController";

const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/file-upload", verifyJwt, upload.array("files"), fileUpload);
router.get("/file-download", verifyJwt, downloadFile);
router.get("/", verifyJwt, fetchFiles);

export default router;
