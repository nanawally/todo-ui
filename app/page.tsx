import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className=" h-screen flex flex-col justify-center items-center text-[#453688]">
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
