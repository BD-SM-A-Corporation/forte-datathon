"use client";

interface ForteLogoProps {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export default function ForteLogo({
  size = "md",
  onClick,
}: ForteLogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  const height = isSm ? 28 : isLg ? 46 : 38;

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "opacity 0.15s ease, transform 0.1s ease",
      }}
      title={onClick ? "На главную" : "Forte"}
    >
      {/* Full Official Logo */}
      <img
        src="/Logo/full_Logo.svg"
        alt="Forte"
        style={{
          height,
          width: "auto",
          display: "block",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
