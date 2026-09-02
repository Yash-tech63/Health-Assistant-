import React from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Clock, Activity } from 'lucide-react';
export const AuditLogs = () => {
    const { auditLogs } = useHealthStore();
    return (<div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Security & Audit Event Logs</h1>
        <p className="text-xs text-slate-500">Chronological ledger recording all digital health transactions, referral creations, and drug stock warnings.</p>
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Event Action</th>
                  <th className="px-6 py-3">Actor Role</th>
                  <th className="px-6 py-3">Transaction details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {auditLogs.map(log => (<tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium font-mono flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5"/>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-medical-600"/>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={log.actorRole === 'admin' ? 'danger' : log.actorRole === 'doctor' ? 'info' : log.actorRole === 'hospital' ? 'success' : 'primary'}>
                        {log.actorRole.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350">{log.details}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

    </div>);
};
