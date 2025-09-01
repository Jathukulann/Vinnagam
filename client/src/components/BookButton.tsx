"use client";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookButtonProps {
  propertyId: number;
  price: number;
  variant?: "default" | "large";
  className?: string;
}

const BookButton = ({ 
  propertyId, 
  price,
  variant = "default", 
  className = "" 
}: BookButtonProps) => {
  const router = useRouter();

  const handleBookClick = () => {
    router.push(`/book/${propertyId}`);
  };

  const baseClasses = "bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-semibold";
  const sizeClasses = variant === "large" ? "px-8 py-4 text-lg" : "px-6 py-3";

  return (
    <button
      onClick={handleBookClick}
      className={`${baseClasses} ${sizeClasses} ${className}`}
    >
      <Calendar className={variant === "large" ? "w-6 h-6" : "w-5 h-5"} />
      Book Now - ${price}/month
    </button>
  );
};

export default BookButton;