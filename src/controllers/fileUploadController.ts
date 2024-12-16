const fileUpload = (req: any, res: any) => {
  console.log("LOG: file-upload: req body:");
  console.log(req.body);
  const files: any = req.files;
  if (!files) {
    console.log("ERROR: file-upload: no files came with req..");
    return res.status(400).send({ message: "no files received" });
  }

  console.log("LOG: file-upload: success: received files:");
  console.log(files);
  // console.log(req.files);

  return res.sendStatus(200);
};

export default fileUpload;
