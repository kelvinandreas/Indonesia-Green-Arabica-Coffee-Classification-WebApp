/**
 * Classifies a coffee bean image
 * @param {File} imageFile - The image file to classify
 * @returns {Promise<Object>} Classification results
 */
export async function classifyCoffeeImage(imageFile) {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch("/api/classify", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to classify coffee image");
    }

    return await response.json();
  } catch (error) {
    console.error("Error classifying coffee image:", error);
    throw new Error("Failed to classify coffee image. Please try again.");
  }
}
