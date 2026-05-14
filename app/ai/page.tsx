'use client';
import { useDevice } from '@/lib/hooks/useDevice';
import { Chatbot }   from '@/components/ai/Chatbot';

export default function AIPage() {
  const { data } = useDevice();

  return (
    <div className="p-6 h-full">
      <Chatbot data={data} />
    </div>
  );
}
