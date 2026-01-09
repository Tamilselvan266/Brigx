import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import {
  Home,
  Pencil,
  HardHat,
  Hammer,
  Package,
  Shield,
} from 'lucide-react';

export type UserRole =
  | 'homeowner'
  | 'architect'
  | 'engineer'
  | 'builder'
  | 'supplier'
  | 'government';

interface RoleSelectionProps {
  onRoleSelected: (role: UserRole) => void;
}

const roles = [
  {
    id: 'homeowner' as UserRole,
    title: 'Home Owner',
    description: 'Monitor and manage your construction project',
    icon: Home,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'architect' as UserRole,
    title: 'Architect',
    description: 'Showcase designs and connect with clients',
    icon: Pencil,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'engineer' as UserRole,
    title: 'Engineer',
    description: 'Document construction progress on-site',
    icon: HardHat,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'builder' as UserRole,
    title: 'Builder / Contractor',
    description: 'Manage projects and upload progress',
    icon: Hammer,
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'supplier' as UserRole,
    title: 'Raw Material Supplier',
    description: 'List products and manage orders',
    icon: Package,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'government' as UserRole,
    title: 'Government Official',
    description: 'Monitor and validate construction projects',
    icon: Shield,
    color: 'from-red-500 to-red-600',
  },
];

export function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-8">
          Select Your Role
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const active = selectedRole === role.id;

            return (
              <motion.button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`p-6 rounded-2xl text-left ${
                  active
                    ? 'ring-4 ring-orange-500 shadow-xl'
                    : 'border border-gray-200 hover:shadow-lg'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-bold">{role.title}</h3>
                <p className="text-sm text-gray-500">
                  {role.description}
                </p>
              </motion.button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            disabled={!selectedRole}
            onClick={() => selectedRole && onRoleSelected(selectedRole)}
            className="h-12 px-12 bg-orange-600 hover:bg-orange-700 rounded-xl"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
