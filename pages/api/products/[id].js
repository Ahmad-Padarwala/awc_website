// api/category/[id].js

import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import fs from "fs";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter

  if (req.method === "GET") {
    try {
      const q = "SELECT * FROM `product_master` WHERE product_id = ?";

      const data = [id];
      const [rows] = await conn.query(q, data);

      res.status(200).json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Can not Get category... check connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "DELETE") {
    try {
      // Begin transaction
      await conn.query("BEGIN");

      const { id } = req.query;

      // 1. First, get product data
      const [product] = await conn.query(
        "SELECT product_image, product_brochure FROM  product_master WHERE product_id = ?",
        [id]
      );

      // 2. Check if product has images in product_images table
      const [images] = await conn.query(
        "SELECT prod_image_id, product_image FROM product_images WHERE product_id = ?",
        [id]
      );

      // 3. Delete images from the file system and product_images table
      for (const image of images) {
        const imagePath = path.join(
          __dirname,
          "../../../../../public/assets/upload/products/productImages",
          image.product_image
        );
        if (fs.existsSync(imagePath)) {
          await unlink(imagePath);
        } else {
          console.log(`File does not exist: ${imagePath}`);
        }

        await conn.query("DELETE FROM product_images WHERE prod_image_id = ?", [
          image.prod_image_id,
        ]);
      }

      // 4. Check if product has images in product_images table
      const [videos] = await conn.query(
        "SELECT prod_video_id, video_thumbnail FROM product_video WHERE product_id = ?",
        [id]
      );

      // 5. Delete images from the file system and product_images table
      for (const video of videos) {
        const videoPath = path.join(
          __dirname,
          "../../../../../public/assets/upload/products/productVedios",
          video.video_thumbnail
        );

        if (fs.existsSync(videoPath)) {
          await unlink(videoPath);
        } else {
          console.log(`File does not exist: ${videoPath}`);
        }

        await conn.query("DELETE FROM product_video WHERE prod_video_id = ?", [
          video.prod_video_id,
        ]);
      }

      // 6. Check if product has images in product_images table
      const [docs] = await conn.query(
        "SELECT prod_docs_id, pdf_link FROM product_docs WHERE product_id = ?",
        [id]
      );

      // 7. Delete images from the file system and product_images table
      for (const doc of docs) {
        const docPath = path.join(
          __dirname,
          "../../../../../public/assets/upload/products/productDocs",
          doc.pdf_link
        );
        if (fs.existsSync(docPath)) {
          await unlink(docPath);
        } else {
          console.log(`File does not exist: ${docPath}`);
        }
        await conn.query("DELETE FROM product_docs WHERE prod_docs_id = ?", [
          doc.prod_docs_id,
        ]);
      }

      // 8. Check if product has Certificate in product_certificate table
      const [certificates] = await conn.query(
        "SELECT prod_certi_id, certificate_link FROM product_certificate WHERE prod_id = ?",
        [id]
      );

      // 9. Delete Certificate from the file system and product_certificate table
      for (const certificate of certificates) {
        const certificatePath = path.join(
          __dirname,
          "../../../../../public/assets/upload/products/productCertificate",
          certificate.certificate_link
        );
        if (fs.existsSync(certificatePath)) {
          await unlink(certificatePath);
        } else {
          console.log(`File does not exist: ${certificatePath}`);
        }

        await conn.query(
          "DELETE FROM product_certificate WHERE prod_certi_id = ?",
          [certificate.prod_certi_id]
        );
      }

      // 10. Check if product has images in product_images table
      const [drawings] = await conn.query(
        "SELECT id, pdf_link FROM product_drawing WHERE product_id = ?",
        [id]
      );

      // 7. Delete images from the file system and product_images table
      for (const drawing of drawings) {
        const drawingPath = path.join(
          __dirname,
          "../../../../../public/assets/upload/products/productDrawing",
          drawing.pdf_link
        );
        if (fs.existsSync(drawingPath)) {
          await unlink(drawingPath);
        } else {
          console.log(`File does not exist: ${drawingPath}`);
        }

        await conn.query("DELETE FROM product_drawing WHERE id = ?", [
          drawing.id,
        ]);
      }

      // 11. Delete the product from the product_master table
      const q = "DELETE FROM product_master WHERE product_id = ?";

      const [rows] = await conn.query(q, [id]);

      let productImage = "";
      let productBrochure = "";
      // 12. Commit the transaction
      await conn.query("COMMIT");

      if (product.length != 0) {
        productImage = product[0].product_image;
        productBrochure = product[0].product_brochure;
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/products"
        );
        const newPath = path.join(projectDirectory, productImage);
        const newBrPath = path.join(projectDirectory, productBrochure);
        console.log(newPath);
        if (fs.existsSync(newPath)) {
          await unlink(newPath);
        } else {
          console.log(`File does not exist: ${newPath}`);
        }
        if (fs.existsSync(newBrPath)) {
          await unlink(newBrPath);
        } else {
          console.log(`File does not exist: ${newBrPath}`);
        }
      }

      // Process the data and send the response
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);

      // If an error occurs, rollback the transaction
      await conn.query("ROLLBACK");

      res
        .status(500)
        .json({ message: "Cannot Delete Category... Check Connection" });
    } finally {
      conn.releaseConnection();
    }
  }

  if (req.method == "PATCH") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // check file exist or not
        const {
          cate_id,
          product_title,
          product_short_desc,
          product_long_desc,
          meta_tag,
          meta_desc,
          meta_keyword,
          canonical_url,
          product_image,
          product_brochure,
        } = fields;

        let sql = "";
        let params = "";
        let result = "";

        const updatedDate = new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        // get product data
        const [product] = await conn.query(
          "SELECT product_image, product_brochure FROM product_master WHERE product_id = ?",
          [id]
        );

        if (!files.product_image && !files.product_brochure) {
          // No new images provided, updating other fields
          sql =
            "UPDATE `product_master` SET `cate_id`= ?, `product_title`= ?, `product_short_desc`= ?, `product_long_desc`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `updated_date`= ?  WHERE product_id = ?";

          params = [
            cate_id,
            product_title,
            product_short_desc,
            product_long_desc,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            updatedDate,
            id,
          ];
          result = await conn.query(sql, params);
        } else {
          // Check and update each image if provided
          const updateImages = async (
            imageField,
            imageFile,
            index,
            fieldName
          ) => {
            if (imageFile) {
              const oldImage = product[0][fieldName];
              if (oldImage) {
                // Delete old image
                const oldImagePath = path.join(
                  __dirname,
                  "../../../../../public/assets/upload/products",
                  oldImage
                );
                if (fs.existsSync(oldImagePath)) {
                  await unlink(oldImagePath);
                } else {
                  console.log(`File does not exist: ${oldImagePath}`);
                }
              }

              const oldPath = imageFile[0].filepath;
              const nFileName = `${Date.now()}_${index}.${
                imageFile[0].originalFilename
              }`;
              const newFileName = nFileName.replace(/\s/g, "");
              const projectDirectory = path.resolve(
                __dirname,
                "../../../../../public/assets/upload/products"
              );
              const newPath = path.join(projectDirectory, newFileName);

              fs.copyFile(oldPath, newPath, (moveErr) => {
                if (moveErr) {
                  console.log(moveErr);
                  return res
                    .status(500)
                    .json({ message: `File ${index} Upload failed.` });
                }
              });

              return newFileName;
            }
            return imageField;
          };

          // Update images if provided
          let updatedImage = product_image;
          let updatedBrochure = product_brochure;

          // Validate image file extension
          const allowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
          if (files.product_image) {
            const imageFileExtension = path
              .extname(files.product_image[0].originalFilename)
              .toLowerCase();

            if (!allowedImageExtensions.includes(imageFileExtension)) {
              return res
                .status(400)
                .json({ message: "Only image files are allowed." });
            }

            updatedImage = await updateImages(
              product_image,
              files.product_image,
              1,
              "product_image"
            );
          }

          // Validate PDF file extension
          const allowedPdfExtensions = [".pdf"];
          if (files.product_brochure) {
            const pdfFileExtension = path
              .extname(files.product_brochure[0].originalFilename)
              .toLowerCase();

            if (!allowedPdfExtensions.includes(pdfFileExtension)) {
              return res
                .status(400)
                .json({
                  message: "Only PDF files are allowed for product brochure.",
                });
            }

            updatedBrochure = await updateImages(
              product_brochure,
              files.product_brochure,
              2,
              "product_brochure"
            );
          }

          console.log("first", updatedBrochure);
          console.log("first", updatedImage);

          // SQL query for updating the database with new images
          sql =
            "UPDATE `product_master` SET `cate_id`= ?, `product_title`= ?, `product_short_desc`= ?, `product_long_desc`= ?, `meta_tag`= ?, `meta_desc`= ?, `meta_keyword`= ?, `canonical_url`= ?, `product_image`= ?, `product_brochure`= ?, `updated_date`= ?  WHERE product_id = ?";

          params = [
            cate_id,
            product_title,
            product_short_desc,
            product_long_desc,
            meta_tag,
            meta_desc,
            meta_keyword,
            canonical_url,
            updatedImage,
            updatedBrochure,
            updatedDate,
            id,
          ];
          result = await conn.query(sql, params);
        }

        res.status(200).json(result);
      });
    } catch (err) {
      res.status(500).json({ message: "Product Updation Failed" });
    } finally {
      conn.releaseConnection();
    }
  }
}
