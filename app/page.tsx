import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className=" h-screen flex flex-col justify-center items-center text-amber-900">
        <Link href="/about">About</Link>
        <Link href="/product">Product page</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
