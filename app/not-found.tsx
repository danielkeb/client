"use client";

import Header from "@/components/landing-page/Header";
import PageNotFoundImage from "@/public/img/404-page-image.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PageNotFound() {
  const router = useRouter();

  return (
    <div className="h-screen">
      <Header />

      <main className="min-h flex flex-col items-center justify-center gap-12 py-24">
        <div className="flex justify-center">
          <Image
            src={PageNotFoundImage}
            alt="Page not found illustration"
            style={{ width: "60%", height: "auto" }}
          />
        </div>

        <div className="prose space-y-4 text-center lg:prose-lg">
          <h1>404 - Page not found</h1>
          <p>Oops! The page you are looking for could not be found.</p>
        </div>

        <div className="inline-flex gap-6">
          <div onClick={() => router.refresh()}>
            <button className="btn btn-outline">Try Again</button>
          </div>
          <Link href="/">
            <button className="btn btn-primary">Go to home page</button>
          </Link>
        </div>
      </main>
    </div>
  );
}
