// 📁 src/components/SenaHeader/SenaHeader.tsx
export interface SenaHeaderProps {
  tituloPortal: string;
  centroFormacion: string;
}

export default function SenaHeader({ tituloPortal, centroFormacion }: SenaHeaderProps) {
  return (
    <header className="bg-sena-dark border-b-4 border-sena-green px-6 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-sena-green flex items-center justify-center text-sena-green font-black">
        +
      </div>
      <div>
        <h1 className="text-sm font-bold leading-none">{tituloPortal}</h1>
        <p className="text-[11px] text-slate-400">{centroFormacion}</p>
      </div>
    </header>
  );
}
