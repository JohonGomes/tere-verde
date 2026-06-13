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
import { Heart, Send, MessageSquare, Image, ShieldAlert, Camera, X, ZoomIn } from "lucide-react";

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
  const [expandedPhoto, setExpandedPhoto] = useState<{
    url: string;
    userName: string;
    conteudo: string;
  } | null>(null);

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

  const commentsWithImages = comments.filter(c => c.imagem && c.imagem.trim() !== "");

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

      {/* Galeria do Usuário */}
      {destinoTipo === "trail" && commentsWithImages.length > 0 && (
        <div className="space-y-4 pb-6 border-b border-border/50">
          <h4 className="text-lg font-bold flex items-center gap-2 text-foreground">
            <Camera className="h-5 w-5 text-primary" />
            Galeria do Usuário
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {commentsWithImages.map((c) => (
              <div key={c.id} className="group relative rounded-lg overflow-hidden border border-border shadow-sm bg-muted/20 flex flex-col h-[320px]">
                {/* Imagem com zoom no hover */}
                <div 
                  className="relative flex-1 overflow-hidden cursor-zoom-in group/img"
                  onClick={() => setExpandedPhoto({ url: c.imagem!, userName: c.userName, conteudo: c.conteudo })}
                >
                  <img
                    src={c.imagem}
                    alt={`Foto de ${c.userName} em ${destinoNome}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Overlay no hover com ícone de zoom */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-black/50 p-2.5 rounded-full text-white backdrop-blur-sm scale-90 group-hover/img:scale-100 transition-all duration-300">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>
                  {/* Badge da Trilha */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-black/60 hover:bg-black/80 backdrop-blur-sm border-none text-white text-[10px]">
                      {destinoNome}
                    </Badge>
                  </div>
                </div>

                {/* Legenda com as informações solicitadas */}
                <div className="p-4 bg-background flex flex-col justify-between shrink-0 h-[120px]">
                  <p className="text-xs text-muted-foreground italic line-clamp-3 leading-relaxed">
                    "{c.conteudo}"
                  </p>
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                    {c.userPic ? (
                      <img
                        src={c.userPic}
                        alt={c.userName}
                        className="h-6 w-6 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {c.userName ? c.userName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-foreground truncate">
                      {c.userName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    <img 
                      src={comment.imagem} 
                      alt="Envio do visitante" 
                      className="w-20 h-20 object-cover rounded border mt-1 cursor-zoom-in hover:brightness-90 transition-all" 
                      onClick={() => setExpandedPhoto({ url: comment.imagem!, userName: comment.userName, conteudo: comment.conteudo })}
                    />
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

      {/* Lightbox Modal para Ampliar a Foto */}
      {expandedPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-300 animate-in fade-in"
          onClick={() => setExpandedPhoto(null)}
        >
          {/* Botão Fechar */}
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all backdrop-blur-sm z-[110]"
            onClick={() => setExpandedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Container Principal */}
          <div 
            className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Área da Imagem */}
            <div className="flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[50vh] md:max-h-[75vh]">
              <img 
                src={expandedPhoto.url} 
                alt="Foto Ampliada" 
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Detalhes / Legenda (Barra Lateral) */}
            <div className="w-full md:w-[320px] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 bg-zinc-900 shrink-0 text-white">
              <div className="space-y-4">
                <div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs mb-2 hover:bg-primary/20">
                    {destinoNome}
                  </Badge>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Depoimento do Visitante</h4>
                </div>
                
                <p className="text-zinc-300 italic text-sm leading-relaxed border-l-2 border-primary/50 pl-3 py-1 bg-primary/5 rounded-r">
                  "{expandedPhoto.conteudo}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-zinc-800">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-zinc-700">
                  {(expandedPhoto.userName || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-zinc-100">{expandedPhoto.userName}</div>
                  <div className="text-[11px] text-zinc-400">Aventureiro Terê Verde</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
