import { Outlet } from 'react-router-dom';
import DashboardLayout from '@/components/medisaas/DashboardLayout';

// ============ Layout agent (Medisaas) ============
// Le poste agent est harmonisé avec les pages patient : même shell,
// même fond, même navigation — le triage ne doit pas se distinguer.
export default function AgentLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}