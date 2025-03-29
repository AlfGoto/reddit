"use client";

import { Sub } from "@/types/reddit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { DialogHeader } from "./ui/dialog";
import { removeSub } from "@/lib/supabase/removeSub";
import Image from "next/image";
import { useState } from "react";

export function SubHeader({ sub }: { sub: Sub }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="flex gap-4 align-center">
      <Image
        src={sub.img.split("?")[0]}
        alt={`r/${sub.sub} icon`}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full"
        unoptimized
      />
      <h1 className="font-bold text-card-foreground text-center text-[24px] leading-10">
        r/{sub.sub}
      </h1>

      {/* Trigger for Dialog */}
      <button
        className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full"
        aria-label={`Unfollow r/${sub.sub}`}
        onClick={handleOpen} // Open dialog
      >
        <X className="h-5 w-5" />
      </button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        {" "}
        {/* Controlled open state */}
        <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-6">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Unfollow Subreddit
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Are you sure you want to unfollow r/{sub.sub}?
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex justify-end gap-3">
              {/* Cancel Button - Closes Dialog */}
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-all"
                onClick={handleClose} // Close dialog
              >
                Cancel
              </button>

              {/* Unfollow Button */}
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
                type="button"
                onClick={async () => {
                  await removeSub(sub);
                  handleClose(); // Close dialog after action
                }}
              >
                Unfollow
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
