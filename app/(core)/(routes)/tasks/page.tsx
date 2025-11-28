"use client";

import { Task } from "@/app/_types/Task";
import { apiFetch } from "@/app/_utility/api";
import { useState } from "react";

export default function Page() {
  const [apiData, setApiData] = useState<Task[] | null>(null);

  const load = async () => {
    const data = await apiFetch<Task[]>("http://localhost:8090/v2/tasks/", {
      credentials: "include",
      // headers: {
      // Authorization: `Bearer ${token}`,
      //},
    });

    console.log("Fetched data:", data);

    if (!data) return;

    setApiData(data);
  };

  return (
    <>
      <button onClick={load} className=" text-blue-200">Load Data</button>
      <div className=" bg-amber-200">HELLO</div>
      <p className=" text-amber-50">{JSON.stringify(apiData)}</p>
    </>
  );
}
