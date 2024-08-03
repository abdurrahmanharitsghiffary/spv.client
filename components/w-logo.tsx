import React from "react";

export default function WebsiteLogo() {
  return (
    <div
      className="relative w-[90px] h-[50px] rounded-small flex justify-center items-center"
      style={{
        // backgroundImage: `url("https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGR5ZHFnZ202MmhqdnBlbW1saXUxa2F3dHI2cTNjNG91ZjFwMGNreiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yfghyBDIZvWchz6A2I/giphy.gif")`,
        backgroundSize: "cover",
      }}
    >
      <span className="font-bold shadow-medium text-xl font-sans text-center text-default-foreground">
        Space Verse
      </span>
    </div>
  );
}
