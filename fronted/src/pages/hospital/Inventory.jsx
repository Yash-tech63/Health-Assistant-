import React, { useState } from 'react';
import { useHealthStore } from '../../context/HealthStoreContext';
import { Card, CardBody } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { AlertTriangle, Plus, Search } from 'lucide-react';
import { Alert } from '../../components/Alert';
import { Input } from '../../components/Input';
export const Inventory = () => {
    const { inventory, updateInventoryStock } = useHealthStore();
    const [searchTerm, setSearchTerm] = useState('');
    // Hospital Facility inventory F-DIST-01
    const hospitalInventory = inventory.filter(item => item.facilityId === 'F-DIST-01' &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const lowStockMedicines = hospitalInventory.filter(item => item.stock < item.minStockThreshold);
    const handleRestock = (id) => {
        updateInventoryStock(id, 100);
        alert('Issued procurement request. Restocked 100 units.');
    };
    return (<div className="space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Pharmacy Drug Inventory</h1>
          <p className="text-xs text-slate-500">Monitor stock levels, issue warnings for vital medicines, and manage logistics.</p>
        </div>
      </div>

      {/* Critical Stock Alert banner */}
      {lowStockMedicines.length > 0 && (<Alert type="warning" title="Critical Stock warning: Replenishment Required">
          <ul className="list-disc list-inside space-y-1 mt-1 text-[11px] font-semibold">
            {lowStockMedicines.map(m => (<li key={m.id}>
                {m.name} is down to <span className="text-red-600 dark:text-red-400 font-extrabold">{m.stock} units</span> (Min threshold: {m.minStockThreshold}).
              </li>))}
          </ul>
        </Alert>)}

      {/* Search and Action Bar */}
      <div className="max-w-md bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-xs">
        <Input id="inv-search" placeholder="Filter inventory by name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} leftIcon={<Search className="h-4 w-4"/>}/>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-900/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-150 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">Medicine Info</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Stock Units</th>
                  <th className="px-6 py-3">Price / Tab</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {hospitalInventory.map(item => {
            const isLow = item.stock < item.minStockThreshold;
            return (<tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">💊</span>
                          <span className="font-bold text-slate-850 dark:text-slate-100">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge color={item.category === 'Cardiac' ? 'danger' : item.category === 'Diabetic' ? 'warning' : 'primary'}>
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        <span className={isLow ? 'text-red-650 dark:text-red-400 font-extrabold flex items-center gap-1' : 'text-slate-800 dark:text-slate-200'}>
                          {isLow && <AlertTriangle className="h-3.5 w-3.5"/>} {item.stock} / {item.minStockThreshold} Min
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-semibold">₹{item.price}</td>
                      <td className="px-6 py-4 text-right">
                        <Button variant={isLow ? 'primary' : 'outline'} size="sm" onClick={() => handleRestock(item.id)} leftIcon={<Plus className="h-3 w-3"/>}>
                          Restock
                        </Button>
                      </td>
                    </tr>);
        })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

    </div>);
};
