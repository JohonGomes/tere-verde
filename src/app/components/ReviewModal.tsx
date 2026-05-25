import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/api";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Star, ShieldAlert } from "lucide-react";

interface ReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAuth?: () => void;
  establishment: {
    id: string;
    nome: string;
    tipo: string;
    especialidade?: string;
  } | null;
}

export function ReviewModal({ open, onOpenChange, onOpenAuth, establishment }: ReviewModalProps) {
  const { user } = useAuth();
  
  // Rating states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para fazer avaliações (RN02).");
      return;
    }

    if (!establishment) return;

    setSubmitting(true);
    try {
      const type = establishment.tipo === "Restaurante" ? "restaurant" : "lodging";
      await ApiService.addReview(type, establishment.id, rating, comment);
      
      toast.success("Avaliação enviada com sucesso! Obrigado por colaborar.");
      setComment("");
      setRating(5);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao enviar avaliação.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!establishment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            Avaliar {establishment.nome}
          </DialogTitle>
          <DialogDescription>
            Deixe sua nota de 1 a 5 estrelas e ajude outros turistas (RF05).
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto text-yellow-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground">Login Obrigatório (RN02)</p>
              <p className="text-sm text-muted-foreground px-4">
                Apenas usuários cadastrados e logados podem avaliar restaurantes e hotéis parceiros.
              </p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/95" onClick={() => {
              onOpenChange(false);
              if (onOpenAuth) onOpenAuth();
            }}>
              Entrar ou Cadastrar-se
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Sistema Interativo de Estrelas */}
            <div className="space-y-2 text-center py-2 bg-accent/5 rounded-lg border">
              <Label className="text-sm font-semibold block mb-1">Qual a sua nota?</Label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform active:scale-90"
                  >
                    <Star 
                      className={`h-8 w-8 transition-colors ${
                        star <= (hoverRating ?? rating)
                          ? "fill-yellow-400 text-yellow-400 scale-105"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-muted-foreground font-semibold uppercase">
                {rating === 1 ? "Péssimo" :
                 rating === 2 ? "Ruim" :
                 rating === 3 ? "Regular" :
                 rating === 4 ? "Muito Bom" : "Excelente!"}
              </span>
            </div>

            {/* Texto de Opinião */}
            <div className="space-y-1">
              <Label htmlFor="rev-comment">Comentário / Opinião</Label>
              <Textarea
                id="rev-comment"
                placeholder="Atendimento excelente, prato muito bem servido e vista impecável..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                disabled={submitting}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/95" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar Avaliação"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
