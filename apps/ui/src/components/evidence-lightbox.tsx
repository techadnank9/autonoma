import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@autonoma/blacklight";
import { XIcon } from "@phosphor-icons/react/X";

interface EvidenceLightboxProps {
  open: boolean;
  onClose: () => void;
  type: "screenshot" | "video";
  url: string;
  description: string;
}

export function EvidenceLightbox({ open, onClose, type, url, description }: EvidenceLightboxProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogBackdrop className="bg-black/80" />
      <DialogContent className="flex max-w-none flex-col items-center justify-center border-none bg-transparent p-8 shadow-none">
        <DialogTitle className="sr-only">{description}</DialogTitle>
        <DialogDescription className="sr-only">Evidence preview</DialogDescription>

        <DialogClose
          aria-label="Close"
          className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
        >
          <XIcon size={20} />
        </DialogClose>

        <p className="mb-3 max-w-xl text-center text-sm leading-snug text-white/90 line-clamp-2">{description}</p>

        {type === "screenshot" ? (
          <img src={url} alt={description} className="max-h-[80vh] max-w-[90vw] rounded-lg object-contain shadow-2xl" />
        ) : (
          <video src={url} controls autoPlay className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl" />
        )}

        <div className="mt-3 text-xs text-white/40">Esc to close</div>
      </DialogContent>
    </Dialog>
  );
}
