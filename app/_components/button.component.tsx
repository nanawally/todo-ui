"use client"

interface ButtonProps {
  name: string;
  onClick?: () => void
}

// transition - animates over time
// translate - manipulate position of element (button "pops out")

export function Button({ name, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className=" bg-sky-400 text-blue-950 text-lg font-bold w-30 py-2 rounded-2xl shadow-lg shadow-black flex justify-center items-center hover:cursor-pointer hover:bg-blue-200 hover:-translate-0.5 transition md:text-base lg:text-2xl xl:text-3xl ">
      <h1>{name}</h1>
    </button>
  );
}
