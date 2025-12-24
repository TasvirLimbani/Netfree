"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function WatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id as string;
  const type = searchParams.get("type") || "movie";

  const src =
    type === "movie"
      ? `https://vidfast.pro/movie/${id}`
      : `https://vidfast.pro/tv/${id}`;

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <iframe
        src={src}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  );
}
