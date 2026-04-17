import TimelineMap from '../../components/MuseumMap/TimelineMapWrapper';

export const metadata = {
  title: "Timeline Geográfico | Museo de los Movimientos Artísticos",
  description: "Explora la expansión espacial y temporal del arte a través de este mapa interactivo exclusivo.",
};

export default function MapPage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden relative">
      <TimelineMap />
    </main>
  );
}
