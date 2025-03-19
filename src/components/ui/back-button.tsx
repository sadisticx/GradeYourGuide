import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  className?: string;
}

const BackButton = ({ label = "Back", className = "" }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant="outline"
      className={`flex items-center gap-2 ${className}`}
      onClick={handleBack}
    >
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default BackButton;
