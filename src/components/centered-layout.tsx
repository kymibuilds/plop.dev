import React from "react";

export function CenteredLayout({ children }: { children: React.ReactNode }) {
  // 1fr [track] content [track] 1fr
  const gridCols = "1fr 1.5rem minmax(auto, 400px) 1.5rem 1fr";
  // 1fr [track] content [track] 1fr
  const gridRows = "1fr 1.5rem auto 1.5rem 1fr";

  return (
    <div
      className="min-h-screen w-full grid bg-background text-foreground"
      style={{
        gridTemplateColumns: gridCols,
        gridTemplateRows: gridRows,
      }}
    >
      {/* ================= Row 1 ================= */}
      <div /> {/* 1: Left */}
      <div className="border-x border-border" /> {/* 2: Left Track Vertical Extension */}
      <div /> {/* 3: Center */}
      <div className="border-x border-border" /> {/* 4: Right Track Vertical Extension */}
      <div /> {/* 5: Right */}

      {/* ================= Row 2 (Top Tracks) ================= */}
      {/* 1: Left Extension (Horizontal) - No Stripes */}
      <div className="border-y border-border" /> 
      
      {/* 2: Top Left Corner */}
      <div className="border border-border" />
      
      {/* 3: Top Center Track - Has Stripes */}
      <div className="border-y border-border bg-diagonal-stripes" />
      
      {/* 4: Top Right Corner */}
      <div className="border border-border" />
      
      {/* 5: Right Extension (Horizontal) - No Stripes */}
      <div className="border-y border-border" />

      {/* ================= Row 3 (Main Content) ================= */}
      {/* 1: Left Extension Space (Empty) */}
      <div />
      
      {/* 2: Left Vertical Track - Has Stripes */}
      <div className="border-x border-border bg-diagonal-stripes" />
      
      {/* 3: Content Area */}
      <div className="flex flex-col items-center justify-center p-8 bg-card/50 backdrop-blur-sm z-10">
        {children}
      </div>

      {/* 4: Right Vertical Track - Has Stripes */}
      <div className="border-x border-border bg-diagonal-stripes" />
      
      {/* 5: Right Extension Space (Empty) */}
      <div />

      {/* ================= Row 4 (Bottom Tracks) ================= */}
      {/* 1: Left Extension - No Stripes */}
      <div className="border-y border-border" />
      
      {/* 2: Bottom Left Corner */}
      <div className="border border-border" />
      
      {/* 3: Bottom Center Track - Has Stripes */}
      <div className="border-y border-border bg-diagonal-stripes" />
      
      {/* 4: Bottom Right Corner */}
      <div className="border border-border" />
      
      {/* 5: Right Extension - No Stripes */}
      <div className="border-y border-border" />

      {/* ================= Row 5 ================= */}
      <div /> {/* 1 */}
      <div className="border-x border-border" /> {/* 2: Bottom Left Vertical Extension */}
      <div /> {/* 3 */}
      <div className="border-x border-border" /> {/* 4: Bottom Right Vertical Extension */}
      <div /> {/* 5 */}
    </div>
  );
}
