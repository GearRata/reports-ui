"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Props = {
  taskImages?: string[];
  solutionImages?: string[];
  sectionTitleTask?: string;
  sectionTitleSolution?: string;
  className?: string;
};

export default function ImagesViewer({
  taskImages = [],
  solutionImages = [],
  sectionTitleTask = "รูปภาพที่แนบมา (งาน)",
  sectionTitleSolution = "รูปภาพที่แนบมา (วิธีแก้ไข)",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const openViewer = (arr: string[], i: number) => {
    if (!arr?.length) return;
    setImages(arr);
    setIndex(i);
    setOpen(true);
  };

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  const safeTask = useMemo(() => dedupe(valid(taskImages)), [taskImages]);
  const safeSolution = useMemo(
    () => dedupe(valid(solutionImages)),
    [solutionImages]
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {safeTask.length > 0 && (
        <Section
          title={sectionTitleTask}
          images={safeTask}
          onOpen={(i) => openViewer(safeTask, i)}
        />
      )}

      {safeSolution.length > 0 && (
        <Section
          title={sectionTitleSolution}
          images={safeSolution}
          onOpen={(i) => openViewer(safeSolution, i)}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent aria-describedby={undefined} className="p-0 border-0 bg-transparent max-w-[95vw]">
          {/* 👇 หัวข้อ/คำอธิบายแบบซ่อน แต่ screen reader มองเห็น */}
          <DialogHeader className="sr-only">
            <DialogTitle>Image preview</DialogTitle>
            <DialogDescription id="image-viewer-desc">
              Use Left/Right arrows to navigate. Press Escape to close.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            {images.length > 0 && (
              <img
                src={images[index]}
                alt={`Preview ${index + 1}`}
                className="max-h-[80vh] w-auto mx-auto rounded-lg object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/60 text-white"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/60 text-white"
                >
                  ›
                </button>
              </>
            )}

            {images.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/60 text-white px-2 py-1 rounded">
                {index + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({
  title,
  images,
  onOpen,
}: {
  title: string;
  images: string[];
  onOpen: (index: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="font-bold text-[16px]">{title}</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((url, idx) => (
          <button
            type="button"
            key={`${url}-${idx}`}
            className="relative aspect-square"
            onClick={() => onOpen(idx)}
            aria-label={`Open image ${idx + 1}`}
          >
            <img
              src={url}
              alt={`image ${idx + 1}`}
              className="w-full h-full object-cover rounded-md border"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

const valid = (arr: string[]) =>
  (arr || []).filter((s) => typeof s === "string" && s.trim().length > 0);
const dedupe = (arr: string[]) => Array.from(new Set(arr));
