import Image from "next/image";
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main >
      </main>
    </div>
  );
}
