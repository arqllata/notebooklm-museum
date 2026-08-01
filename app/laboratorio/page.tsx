import LaboratoryDashboard from '@/components/Laboratory/LaboratoryDashboard';

export const metadata = {
  title: "Laboratorio de Correlación Cognitiva | Antigravity Analytics",
  description: "Rastrea la evolución del pensamiento creativo y el paralelo bioquímico/neurológico colectivo a través del diseño histórico.",
};

export default function LaboratorioPage() {
  return (
    <main className="w-full min-h-screen bg-[#050507] text-zinc-100 overflow-x-hidden font-sans">
      <LaboratoryDashboard />
    </main>
  );
}
