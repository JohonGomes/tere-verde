import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ApiService } from "../services/api";
import { Comment } from "../types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { Heart, Send, MessageSquare, Image, ShieldAlert } from "lucide-react";

interface InteractionsSectionProps {
  destinoNome: string;
  destinoTipo: "trail" | "park" | "event";
}

export function InteractionsSection({ destinoNome, destinoTipo }: InteractionsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Likes state
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Form states
  const [commentText, setCommentText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const allComments = await ApiService.getCommentsForDest(destinoTipo, destinoNome);
      setComments(allComments);
      
      // Simula likes randômicos e persistidos por destino
      const cachedLikes = localStorage.getItem(`likes_${destinoTipo}_${destinoNome}`);
      if (cachedLikes) {
        setLikes(Number(cachedLikes));
      } else {
        const initialLikes = Math.floor(Math.random() * 45) + 12;
        setLikes(initialLikes);
        localStorage.setItem(`likes_${destinoTipo}_${destinoNome}`, String(initialLikes));
      }

      const likedState = localStorage.getItem(`is_liked_${destinoTipo}_${destinoNome}`);
      setIsLiked(likedState === "true");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [destinoNome, destinoTipo]);

  const handleLike = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    
    const nextLikesCount = nextLiked ? likes + 1 : likes - 1;
    setLikes(nextLikesCount);
    
    localStorage.setItem(`likes_${destinoTipo}_${destinoNome}`, String(nextLikesCount));
    localStorage.setItem(`is_liked_${destinoTipo}_${destinoNome}`, String(nextLiked));

    if (nextLiked) {
      toast.success("Você curtiu esta atração!", {
        icon: "❤️"
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para enviar depoimentos.");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Por favor, digite seu comentário.");
      return;
    }

    setSubmitting(true);
    try {
      await ApiService.addComment({
        userName: user.name,
        userEmail: user.email,
        userProfilePic: user.profilePic,
        tipoDestino: destinoTipo,
        nomeDestino: destinoNome,
        conteudo: commentText.trim(),
        imagem: imageUrl.trim() || undefined,
      });

      // RN01 Rule: Comment starts as "Pendente"
      toast.success("Seu post foi enviado com sucesso! Ele ficará público após moderação de um administrador (RN01).", {
        duration: 5000,
      });
      
      setCommentText("");
      setImageUrl("");
      
      // Recarrega comentários (o usuário não verá a própria postagem imediatamente, exceto se for admin)
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao publicar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 border-t border-border/80">
      {/* Curtidas & Likes Section */}
      <div className="flex items-center justify-between pb-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Heart className={`h-6 w-6 transition-all ${isLiked ? "fill-red-500 text-red-500 scale-120" : "text-muted-foreground hover:scale-110"}`} />
          <span className="font-bold text-foreground">{likes} {likes === 1 ? "curtida" : "curtidas"}</span>
        </div>
        <Button 
          variant={isLiked ? "secondary" : "outline"} 
          className={`gap-1.5 transition-all ${isLiked ? "text-red-500 border-red-200" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4.5 w-4.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          {isLiked ? "Curtido" : "Curtir Atração"}
        </Button>
      </div>

      {/* Grid de Feed & Formulário */}
      <div className="grid md:grid-cols-5 gap-6 items-start">
        {/* Lista de Comentários */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Depoimentos de Visitantes ({comments.length})
          </h4>
          
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando comentários...</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-muted-foreground italic border p-4 rounded-lg bg-accent/5">Seja o primeiro a compartilhar sua experiência sobre esta atração!</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 border rounded-lg bg-background text-sm space-y-1.5 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground text-xs">{comment.userName}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{comment.conteudo}"</p>
                  {comment.imagem && (
                    <img src={comment.imagem} alt="Envio do visitante" className="w-20 h-20 object-cover rounded border mt-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form para Comentar */}
        <Card className="md:col-span-2 shadow-sm border-primary/10">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-bold">Enviar Depoimento</CardTitle>
            <CardDescription className="text-xs">Compartilhe fotos e dicas da sua aventura.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            {!user ? (
              <div className="text-center py-4 text-xs space-y-2">
                <p className="text-muted-foreground">Faça login para interagir com o conteúdo (RF04).</p>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="c-text" className="text-xs">Seu Depoimento</Label>
                  <Textarea
                    id="c-text"
                    placeholder="Excelente caminhada! A vista vale todo o esforço..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="text-xs"
                    disabled={submitting}
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="c-img" className="text-xs flex items-center gap-1">
                    <Image className="h-3 w-3" /> Foto da Trilha (URL - Opcional)
                  </Label>
                  <Input
                    id="c-img"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="text-xs"
                    disabled={submitting}
                  />
                </div>

                <div className="flex items-center gap-1.5 p-2 bg-yellow-500/5 border border-yellow-500/10 rounded text-[10px] text-yellow-800 dark:text-yellow-400">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  <span>Seu depoimento passará por moderação (RN01).</span>
                </div>

                <Button type="submit" size="sm" className="w-full text-xs font-bold" disabled={submitting}>
                  {submitting ? "Publicando..." : "Enviar para Aprovação"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
