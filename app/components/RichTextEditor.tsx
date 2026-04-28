// app/components/RichTextEditor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";

interface RichTextEditorProps {
  content: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

const MenuButton = ({
  onClick,
  isActive = false,
  icon: Icon,
  tooltip,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  tooltip: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={`h-8 w-8 p-0 ${isActive ? "bg-primary/10 text-primary" : ""}`}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function RichTextEditor({
  content,
  onChange,
  readOnly = false,
  placeholder = "Commencez à écrire...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full my-2 cursor-pointer",
        },
      }),
      Underline,
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    editable: !readOnly,
    immediatelyRender: false, // Évite les problèmes SSR
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Mettre à jour le contenu si la prop change (utilisation de setTimeout pour éviter l'erreur)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Utiliser setTimeout pour différer la mise à jour
      const timeoutId = setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [content, editor]);

  // Forcer l'édition
  useEffect(() => {
    if (editor && !readOnly) {
      editor.setEditable(true);
    }
  }, [editor, readOnly]);

  // Si l'éditeur n'est pas encore prêt, afficher un placeholder
  if (!editor) {
    return (
      <div className="rounded-lg border bg-background p-8 text-center text-muted-foreground">
        Initialisation de l&apos;éditeur...
      </div>
    );
  }

  const addImage = () => {
    const url = window.prompt("URL de l'image:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
      toast({
        title: "Image ajoutée",
        description: "L'image a été insérée dans la transcription",
      });
    }
  };

  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
        toast({
          title: "Image ajoutée",
          description: "L'image a été intégrée avec succès",
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      {/* Barre d'outils */}
      <div className="border-b bg-muted/30 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {/* Formatage texte */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={Bold}
            tooltip="Gras (Ctrl+B)"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={Italic}
            tooltip="Italique (Ctrl+I)"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={UnderlineIcon}
            tooltip="Souligné (Ctrl+U)"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={Strikethrough}
            tooltip="Barré"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Titres */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            icon={Heading1}
            tooltip="Titre 1"
          />
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            icon={Heading2}
            tooltip="Titre 2"
          />
          <MenuButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            icon={Heading3}
            tooltip="Titre 3"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Listes */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={List}
            tooltip="Liste à puces"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={ListOrdered}
            tooltip="Liste numérotée"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={Quote}
            tooltip="Citation"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            icon={Code}
            tooltip="Bloc de code"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Alignement */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={AlignLeft}
            tooltip="Aligner à gauche"
          />
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={AlignCenter}
            tooltip="Centrer"
          />
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={AlignRight}
            tooltip="Aligner à droite"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Surlignage */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            icon={Highlighter}
            tooltip="Surligner"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Images */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={addImage}
            icon={ImageIcon}
            tooltip="Insérer une image (URL)"
          />

          <MenuButton
            onClick={uploadImage}
            icon={ImageIcon}
            tooltip="Parcourir les images"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Annuler / Rétablir */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            tooltip="Annuler (Ctrl+Z)"
          />
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            tooltip="Rétablir (Ctrl+Y)"
          />
        </div>

        {/* Stats à droite */}
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-muted-foreground">
            {editor.storage.characterCount?.characters() || 0} / 50 000
            caractères
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(editor.getText());
              toast({ title: "Texte copié !" });
            }}
          >
            Copier le texte
          </Button>
        </div>
      </div>

      {/* Zone d'édition */}
      <div
        className="min-h-[400px] max-h-[600px] overflow-y-auto cursor-text"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>

      {/* Pied de page */}
      <div className="border-t bg-muted/30 p-2 text-xs text-muted-foreground flex justify-between items-center flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span>✨ Édition en temps réel</span>
          <span>📝 {editor.storage.characterCount?.words() || 0} mots</span>
          <span className="font-mono">
            {editor.isEditable ? "✏️ Mode édition" : "👁️ Mode lecture"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const html = editor.getHTML();
              const blob = new Blob([html], { type: "text/html" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "transcription.html";
              a.click();
              URL.revokeObjectURL(url);
              toast({ title: "Export HTML effectué" });
            }}
          >
            Exporter HTML
          </Button>
        </div>
      </div>
    </div>
  );
}
