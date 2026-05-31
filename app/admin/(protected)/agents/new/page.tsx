import { AgentForm } from '../AgentForm';

export default function NewAgentPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-emerald-500">Dodaj Agenta</h1>
      <AgentForm />
    </div>
  );
}
