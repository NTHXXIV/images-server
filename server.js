const express = require("express");
const admin = require("firebase-admin");

const serviceAccount = require("./nth-images-firebase-adminsdk-uhbk5-a7eb9cce26.json");

const app = express();
const port = 4000;

let allImages = [
  { photo: "https://example.com/photo1.jpg", text: "Image 1", number: 1 },
  { photo: "https://example.com/photo2.jpg", text: "Image 2", number: 2 },
];

// Middleware to parse JSON request bodies
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://nth-images.appspot.com",
});

// GET request to search for images
app.get("/images", (req, res) => {
  const { query } = req.query;

  // Code to search for images based on the provided query
  // You can use a database query or any other search mechanism

  // Example response with search results
  const searchResults = [
    { photo: "https://example.com/photo1.jpg", text: "Image 1", number: 1 },
    { photo: "https://example.com/photo2.jpg", text: "Image 2", number: 2 },
  ];

  res.json(searchResults);
});

async function uploadImageToFirestore(imagePath, imageName) {
  try {
    const bucket = admin.storage().bucket();
    await bucket.upload(imagePath, {
      destination: `images/${imageName}`,
      metadata: {
        contentType: "image/jpeg", // Update with the appropriate content type for your image
      },
    });

    const imageUrl = `images/${imageName}`;

    const db = admin.firestore();
    const imagesCollection = db.collection("images");
    await imagesCollection.add({ photo: imageUrl });

    console.log("Image uploaded successfully:", imageName);
  } catch (error) {
    console.error("Error uploading image:", error);
  }
}

async function fetchAllImages() {
  let images = []; // Declare an empty array to store the fetched images

  try {
    const bucket = admin.storage().bucket();
    const [files] = await bucket.getFiles();

    for (const file of files) {
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2025",
      });

      images.push({ photo: signedUrl });
    }

    allImages = images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error; // Rethrow the error to be handled at the caller level
  }
}

// GET request to filter images
app.get("/images/filter", (req, res) => {
  const { text, number } = req.query;

  // Code to filter images based on the provided parameters
  // You can use a database query or any other filtering mechanism

  // Example response with all images

  let results = allImages;
  console.debug(allImages);
  // Filter by text if provided
  if (text) {
    results = results.filter((image) =>
      image.text.toLowerCase().includes(text.toLowerCase())
    );
  }

  // Filter by number if provided
  if (number) {
    results = results.filter((image) => image.number === parseInt(number));
  }

  res.json(results);
});

// Start the server
app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);

  // // Upload image on server startup
  // const imagePath = "path/to/image.jpg";
  // const imageName = "image.jpg";
  // await uploadImageToFirestore(imagePath, imageName);

  // Fetch all images on server startup
  await fetchAllImages();
});
