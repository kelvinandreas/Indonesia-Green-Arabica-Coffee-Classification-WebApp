"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { categories } from "@/app/constants";
import { classifyCoffeeImage } from "@/app/services";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    let animationFrame;
    let direction = 1;

    if (isLoading) {
      const animate = () => {
        setScanPosition((prev) => {
          if (prev >= 98) direction = -1;
          if (prev <= 2) direction = 1;
          return prev + direction;
        });
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading]);

  const getNeedleRotation = (value, maxValue) => {
    const percentage = value / maxValue;
    return -90 + percentage * 180;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.includes("image/")) {
      alert("Please upload an image file");
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const classifyCoffee = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setResult(null);
    setScanPosition(0);

    try {
      const classificationResult = await classifyCoffeeImage(selectedImage);
      console.log(
        "🚀 ~ classifyCoffee ~ classificationResult:",
        classificationResult
      );
      setResult(classificationResult);
    } catch (err) {
      alert("Sorry, an error occurred while processing your image.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden relative">
      {/* Header */}
      <header className="pt-10 pb-6 px-6 sm:px-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-3">
            <Image
              src="/coffee-bean.svg"
              alt="Coffee Bean Logo"
              width={60}
              height={60}
              className="animate-bounce"
            />
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-primary-800 inline-block font-bold">
              Indonesia Green Arabica Coffee
            </h1>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-primary-800 mt-2 ml-11">
            AI Classification System
          </h2>
          <div className="flex items-center mt-4 ml-11">
            <p className="text-primary-800 max-w-2xl">
              Upload an image of your green coffee beans and our AI will
              classify their quality.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-8 ml-11 max-w-2xl">
            <div className="flex items-center justify-center border border-black p-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-light-200 flex items-center justify-center mr-2">
                <Image
                  src="/ai.svg"
                  alt="AI"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <span className="text-sm text-primary-800">AI-Powered</span>
            </div>
            <div className="flex items-center justify-center border border-black p-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-light-200 flex items-center justify-center mr-2">
                <Image
                  src="/lightning.svg"
                  alt="Lightning"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <span className="text-sm text-primary-800">Fast Analysis</span>
            </div>
            <div className="flex items-center justify-center border border-black p-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-light-200 flex items-center justify-center mr-2">
                <Image
                  src="/categories.svg"
                  alt="Categories"
                  width={60}
                  height={60}
                  className=""
                />
              </div>
              <span className="text-sm text-primary-800">4 Categories</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-10 pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-xl p-6 border border-light-200 shadow-sm relative overflow-hidden">
            <h3 className="text-xl text-primary-800 mb-4 flex items-center font-bold">
              Upload Coffee Bean Image
            </h3>
            {/* Image upload area */}
            <div
              className={`mt-4 border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-primary-500 bg-light-50"
                  : "border-light-400 hover:border-primary-500 hover:bg-light-50/50"
              } relative overflow-hidden`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input").click()}
            >
              {!imagePreview ? (
                <>
                  <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-light-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-primary-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-primary-800 font-medium">
                    Drag & drop your image here
                  </p>
                  <p className="text-primary-800 text-sm mt-1">
                    or click to browse
                  </p>
                </>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full">
                    {imagePreview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={imagePreview}
                        alt="Coffee Bean Preview"
                        className={`max-h-full max-w-full object-contain mx-auto ${
                          isLoading ? "opacity-80" : ""
                        }`}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                    )}
                  </div>

                  {isLoading && (
                    <>
                      <div className="absolute inset-0 bg-white opacity-60 z-10"></div>
                      <div
                        className="absolute left-0 right-0 h-1 bg-primary-900 z-20"
                        style={{ top: `${scanPosition}%` }}
                      ></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary-500 z-20"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary-500 z-20"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary-500 z-20"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary-500 z-20"></div>
                    </>
                  )}
                </div>
              )}
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="mt-4 bg-gray-100 rounded-lg p-3">
              <h4 className="text-sm text-primary-800 mb-2 flex items-center">
                <Image
                  src="/check.svg"
                  alt="Check"
                  width={15}
                  height={15}
                  className="mr-1"
                />
                Tips for best results:
              </h4>
              <ul className="text-xs text-primary-800 space-y-1 pl-6 list-disc">
                <li>Use clear, well-lit images</li>
                <li>Place beans on a contrasting background</li>
                <li>Ensure beans are visible in frame</li>
                <li>Optimal formats: JPG, PNG (max 10MB)</li>
              </ul>
            </div>

            <button
              onClick={result ? resetForm : classifyCoffee}
              disabled={isLoading}
              className={`mt-6 w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 bg-primary-900 text-white hover:bg-primary-600`}
            >
              {isLoading ? (
                <span>Analyzing</span>
              ) : result ? (
                <span>Clear Image</span>
              ) : (
                <span>Classify Coffee</span>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl p-6 border border-light-200 shadow-sm flex flex-col min-h-[550px] relative overflow-hidden">
            <h3 className="text-xl text-primary-800 mb-6 flex items-center font-bold">
              Classification Results
            </h3>

            {!result && !isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 mb-4 rounded-full bg-light-100 flex items-center justify-center">
                  <Image
                    src="/info.svg"
                    alt="Info"
                    width={50}
                    height={50}
                    className="mr-1"
                  />
                </div>
                <p className="text-primary-800 mb-8">
                  Upload an image and click &quot;Classify Coffee&quot; to see
                  the results
                </p>

                <div className="w-full mt-auto">
                  <h4 className="text-sm text-primary-800 mb-3 text-center font-semibold">
                    Available Classifications
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center space-x-2 bg-light-50 rounded-lg p-2 border border-light-200 relative group cursor-help"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-sm text-primary-800">
                          {category.name}
                        </span>
                        <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white border border-light-300 shadow-md rounded-md p-3 w-48 text-xs text-primary-800 z-10 bottom-full left-1/2 -translate-x-1/2 mb-2">
                          {category.description}
                          <div className="absolute w-3 h-3 bg-white border-b border-r border-light-300 transform rotate-45 -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Spinner */}
            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-primary-800 font-medium mb-2">
                  Processing your image
                </p>
                <p className="text-primary-800 text-center">
                  Our AI is analyzing the coffee beans...
                </p>
              </div>
            )}

            {/* Classification Result */}
            {result && (
              <div className="flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center mb-3 bg-light-100 rounded-full w-16 h-16">
                    <Image
                      src="/check.svg"
                      alt="Check"
                      width={50}
                      height={50}
                      className=""
                    />
                  </div>
                  <h4 className="text-2xl text-primary-800 font-semibold">
                    {result.class}
                  </h4>
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-light-100 rounded-full">
                    <span className="text-primary-800 text-xl font-semibold">
                      {result.confidence}% confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {categories.map((category) => {
                    const value =
                      result.confidenceDistribution[category.name] || 0;
                    const needleRotation = getNeedleRotation(
                      value,
                      category.maxValue
                    );
                    const isActive = result.classification === category.name;

                    return (
                      <div
                        key={category.id}
                        className={`bg-white rounded-xl p-3 border ${
                          isActive ? "border-light-400" : "border-light-200"
                        }`}
                      >
                        <h5
                          className={`text-sm font-semibold ${
                            isActive ? "text-primary-800" : "text-primary-800"
                          } mb-2 text-center`}
                        >
                          {category.name}
                        </h5>

                        <div className="h-20 relative">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t-2 border-l-2 border-r-2 rounded-t-full border-light-200"></div>

                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 flex justify-between px-3">
                            <div className="h-2 w-0.5 bg-light-400"></div>
                            <div className="h-2 w-0.5 bg-light-400"></div>
                            <div className="h-2 w-0.5 bg-light-400"></div>
                          </div>

                          <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-14 origin-bottom"
                            style={{
                              backgroundColor: category.color,
                              transform: `rotate(${needleRotation}deg)`,
                              opacity: isActive ? 1 : 0.7,
                            }}
                          ></div>

                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-light-100 border border-light-400"></div>

                          <div
                            className={`absolute bottom-4 left-1/2 -translate-x-1/2 font-bold text-xs ${
                              isActive ? "opacity-100" : "opacity-70"
                            }`}
                            style={{ color: category.color }}
                          >
                            {value}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* How it works section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 pb-20">
        <h2 className="text-2xl text-primary-800 font-bold mb-8 flex items-center justify-center">
          <Image
            src="/docs.svg"
            alt="Docs"
            width={30}
            height={30}
            className="mr-2"
          />
          How Our Coffee Classification Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-light-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-light-100 flex items-center justify-center">
              <Image
                src="/camera.svg"
                alt="Camera"
                width={30}
                height={30}
                className=""
              />
            </div>
            <h3 className="text-lg text-primary-800 mb-2 font-semibold">
              Image Capture
            </h3>
            <p className="text-sm text-primary-800">
              Upload a high-quality image of your green arabica coffee beans
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-light-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-light-100 flex items-center justify-center">
              <Image
                src="/ai.svg"
                alt="AI"
                width={30}
                height={30}
                className=""
              />
            </div>
            <h3 className="text-lg text-primary-800 mb-2 font-semibold">
              AI Analysis
            </h3>
            <p className="text-sm text-primary-800">
              Our hybrid deep learning model analyzes the image using both local
              and global features
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-light-200 flex flex-col items-center text-center">
            <div className="w-12 h-12 mb-4 rounded-full bg-light-100 flex items-center justify-center">
              <Image
                src="/categories.svg"
                alt="Categories"
                width={30}
                height={30}
                className=""
              />
            </div>
            <h3 className="text-lg text-primary-800 mb-2 font-semibold">
              Classification
            </h3>
            <p className="text-sm text-primary-800">
              Receive accurate results categorizing your beans into four quality
              types
            </p>
          </div>
        </div>

        {/* <div className="flex justify-center space-x-4 mt-8">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-primary-900 text-white rounded-lg hover:bg-primary-600 transition-all duration-300"
          >
            See Our Paper
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-4 bg-primary-900 text-white rounded-lg hover:bg-primary-600 transition-all duration-300"
          >
            See Our Code
          </a>
        </div> */}
      </section>

      {/* Footer */}
      <footer className="bg-light-100 py-3">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 text-center">
          <p className="text-sm text-primary-800">
            Copyright &copy; 2025 - Sekeripsi Team
          </p>
        </div>
      </footer>
    </div>
  );
}
