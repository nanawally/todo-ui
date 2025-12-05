"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/app/_hooks/useRequireAuth";

export default function AboutPage() {
  const checkingAuth = useRequireAuth("http://localhost:8080/about");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    if (checkingAuth !== false) return;
    
    const fetchAbout = async () => {
      try {
        const res = await fetch("http://localhost:8080/about", {
          credentials: "include",
        });

        const text = await res.text();
        setData(text);
      } catch (err) {
        console.error("Error fetching about data: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, [checkingAuth]);
  
   if (checkingAuth === null) return null
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className=" text-teal-300">THIS IS THE ABOUT PAGE</h1>
    </div>
  );
}
