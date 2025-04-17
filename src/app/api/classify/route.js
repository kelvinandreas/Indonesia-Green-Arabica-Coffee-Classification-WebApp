import { Client } from "@gradio/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const client = await Client.connect(
      "kelvinandreas/Green-Arabica-Coffee-Beans-Classifier",
      { hf_token: process.env.HUGGING_FACE_TOKEN } // Need hf_token if using private model, otherwise can be omitted
    );

    const result = await client.predict("/predict", {
      image: imageFile,
    });

    var data = { ...result.data[0] };
    const response = {
      class: data.class,
      confidence: data.confidence,
      confidenceDistribution: data.distribution,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error classifying coffee image:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: "Failed to classify coffee image. Please try again." },
      { status: 500 }
    );
  }
}
