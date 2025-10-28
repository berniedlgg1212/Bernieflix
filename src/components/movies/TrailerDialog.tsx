import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PlayCircle } from "lucide-react"
import type { Video } from "@/lib/tmdb"

interface TrailerDialogProps {
  trailer: Video;
}

export function TrailerDialog({ trailer }: TrailerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          <PlayCircle className="mr-2 h-4 w-4" />
          Watch Trailer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>{trailer.name}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={trailer.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}