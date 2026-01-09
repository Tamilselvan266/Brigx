import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import {
  Package,
  Plus,
  ShoppingCart,
  LogOut,
  DollarSign,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface DashboardProps {
  mobile: string;
  onLogout: () => void;
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
  unit: string;
  orders: number;
}

export function SupplierDashboard({ mobile, onLogout }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Premium Cement', stock: 500, price: 350, unit: 'bag', orders: 45 },
    { id: 2, name: 'Steel TMT Bars', stock: 200, price: 55, unit: 'kg', orders: 28 },
    { id: 3, name: 'Premium Tiles', stock: 150, price: 450, unit: 'sqft', orders: 12 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'orders'>>({
    name: '',
    stock: 0,
    price: 0,
    unit: '',
  });

  /* ================= ADD PRODUCT ================= */
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.unit || newProduct.price <= 0) return;

    setProducts((prev) => [
      {
        id: prev.length + 1,
        orders: 0,
        ...newProduct,
      },
      ...prev,
    ]);

    setNewProduct({ name: '', stock: 0, price: 0, unit: '' });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
              <img
                src="/src/assets/brigx.png"
                alt="BRIGX Logo"
                className="h-27 w-auto-contain"
              />  
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Raw Material Supplier</p>
            <p className="font-semibold text-gray-900">+91 {mobile}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹2.4L</p>
              </div>
              <DollarSign className="text-green-600 w-8 h-8" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold">85</p>
              </div>
              <ShoppingCart className="text-blue-600 w-8 h-8" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Package className="text-purple-600 w-8 h-8" />
            </CardContent>
          </Card>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Products</h2>
          <Button onClick={() => setShowAddModal(true)} className="bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* PRODUCTS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold text-orange-600">
                  ₹{product.price} <span className="text-sm">/ {product.unit}</span>
                </p>
                <div className="flex justify-between text-sm">
                  <span>Stock: {product.stock}</span>
                  <Badge variant="secondary">{product.orders} orders</Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Manage Stock
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md p-6 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Add Product</h3>
                <Button size="icon" variant="ghost" onClick={() => setShowAddModal(false)}>
                  <X />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: Number(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <Label>Unit</Label>
                  <Input
                    placeholder="bag / kg / sqft"
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <Button
  type="button"
  onClick={handleAddProduct}
  className="w-full bg-orange-600"
>
  Add Product
</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
