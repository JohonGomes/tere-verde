import { Minus, Plus, Type } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    // Carregar VLibras
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };

    // Recuperar tamanho de fonte salvo
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      const size = parseInt(savedFontSize);
      setFontSize(size);
      document.documentElement.style.fontSize = `${size}%`;
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const increaseFontSize = () => {
    if (fontSize < 130) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("fontSize", newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 70) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}%`;
      localStorage.setItem("fontSize", newSize.toString());
    }
  };

  const resetFontSize = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
    localStorage.setItem("fontSize", "100");
  };

  return (
    <div className="flex items-center gap-0.5 bg-primary/10 rounded-md px-2 py-1 border-l border-border ml-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={decreaseFontSize}
        className="h-8 px-2 hover:bg-primary/20 font-bold text-base"
        title="Diminuir tamanho do texto"
        disabled={fontSize <= 70}
      >
        -
        <span className="sr-only">Diminuir fonte</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFontSize}
        className="h-8 px-3 hover:bg-primary/20 font-bold text-lg"
        title={`Tamanho atual: ${fontSize}% - Clique para resetar`}
      >
        A
        <span className="sr-only">Tamanho de fonte atual</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={increaseFontSize}
        className="h-8 px-2 hover:bg-primary/20 font-bold text-base"
        title="Aumentar tamanho do texto"
        disabled={fontSize >= 130}
      >
        +
        <span className="sr-only">Aumentar fonte</span>
      </Button>
    </div>
  );
}
