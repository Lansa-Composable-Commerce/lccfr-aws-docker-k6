"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Button from "@/components/globalUI/Button";

// import serverDown from "../../../public/undraw_server-down.svg";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="page">
      <div className="grid place-items-center h-max">
        <div className="py-10">
          <Image
            src="https://res.cloudinary.com/dahqgdx87/image/upload/v1746581227/undraw_server-down.png"
            width={600}
            height={600}
            alt="server-down"
          />
        </div>

        <p className="lg:text-xl font-medium text-center mb-4">
          Something went wrong!
        </p>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Button
            className="w-full"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => router.back()
            }
            size="lg"
          >
            Go Back
          </Button>
          <p className=" font-medium">or</p>
          <Button
            className="w-full"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            size="lg"
            variant="secondary"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
