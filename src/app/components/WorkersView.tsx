import { Users, Plus, Search, Shield, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface Worker {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  addedDate: string;
}

const MOCK_WORKERS: Worker[] = [
  {
    id: '1',
    name: 'Chidi Okafor',
    email: 'chidi.okafor@company.com',
    department: 'Engineering',
    role: 'Senior Developer',
    status: 'active',
    addedDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Amina Bello',
    email: 'amina.bello@company.com',
    department: 'Finance',
    role: 'Accountant',
    status: 'active',
    addedDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Emeka Nwosu',
    email: 'emeka.nwosu@company.com',
    department: 'Operations',
    role: 'Operations Manager',
    status: 'active',
    addedDate: '2023-11-08',
  },
];

export function WorkersView() {
  const [workers] = useState<Worker[]>(MOCK_WORKERS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorkers = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="cp-page-title">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage employees and track compliance status</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Worker
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search workers by name, email, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{workers.length}</p>
              <p className="text-sm text-muted-foreground">Total Workers</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {workers.filter((w) => w.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {workers.filter((w) => w.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Department
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredWorkers.map((worker) => (
              <tr key={worker.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{worker.name}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{worker.email}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{worker.department}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{worker.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      worker.status === 'active'
                        ? 'bg-green-500/10 text-green-500'
                        : worker.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{worker.addedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWorkers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No workers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
