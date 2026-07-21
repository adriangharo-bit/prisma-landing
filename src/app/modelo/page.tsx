import ModeloPageClient from '@/components/ModeloPageClient';

export const metadata = {
  title: 'PRISMA — Acopa Outdoors',
  description: 'Boulder técnico de alto nivel. PRISMA de Acopa Outdoors.',
};

export default function ModeloPage() {
  return <ModeloPageClient heroLayout="center" snapStrength="proximity" showSectionNav />;
}
