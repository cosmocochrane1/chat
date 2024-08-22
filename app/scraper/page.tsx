"use client";

import { useEffect, useState } from "react";

export default function ScrapePage() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    // Trigger the scraper by fetching data from our route
    fetch("/api/scraper")
      .then((response) => response.json())
      .then((result) => {
        setData(result.title);
      })
      .catch((error) => {
        console.error("Error fetching scraper data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Web Scraper Demo</h1>
      {data ? <p>Scraped Title: {data}</p> : <p>Loading...</p>}
    </div>
  );
}
