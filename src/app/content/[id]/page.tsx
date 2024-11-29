"use client";

import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loading from "@/app/loading";

interface CardImage {
  cardImageUrl: string;
}

interface ContentDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    title?: string;
  };
}

export default function ContentDetail({
  params,
  searchParams,
}: ContentDetailProps) {
  const contentId = params.id; 
  const contentTitle = searchParams.title || "Default Title"; 
  const [images, setImages] = useState<CardImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCardNewsImages = async () => {
      try {
        if (!contentId) {
          throw new Error("Content ID is missing.");
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("AccessToken is missing.");
        }

        const response = await axios.get(`/card-news/${contentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("Response:", response.data);

        if (response.data.isSuccess) {
          setImages(response.data.results.cardImageUrlList);
        }
      } catch (err: any) {
        console.error("Error fetching card news images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardNewsImages();
  }, [contentId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center w-full bg-white">
      <Header title={contentTitle} showBackButton={true} />

      <div className="flex flex-col w-[343px] items-start gap-4 mt-4">
        {images.map((image, index) => (
          <div key={index} className="w-full h-[200px]">
            <img
              src={image.cardImageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
