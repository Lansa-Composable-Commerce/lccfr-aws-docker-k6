import React from "react";

interface MessageProps {
  message: string | undefined;
}

const ErrorMessage = ({ message }: MessageProps) => {
  return (
    <span className="text-negative-700 text-sm tracking-wide min-h-5">
      {message}
    </span>
  );
};

export default ErrorMessage;
