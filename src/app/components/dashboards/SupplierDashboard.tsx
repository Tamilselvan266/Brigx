import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import {
  Package,
  Plus,
  ShoppingCart,
  LogOut,
  DollarSign,
  X,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';

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

interface Order {
  id: number;
  buyer: string;
  product: string;
  quantity: number;
  total: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered';
  date: string;
  location: string;
}

export function SupplierDashboard({ mobile, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('products');

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Premium Cement', stock: 500, price: 350, unit: 'bag', orders: 45 },
    { id: 2, name: 'Steel TMT Bars', stock: 200, price: 55, unit: 'kg', orders: 28 },
    { id: 3, name: 'Premium Tiles', stock: 150, price: 450, unit: 'sqft', orders: 12 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 1001, buyer: 'Rahul Verma', product: 'Premium Cement', quantity: 50, total: '₹17,500', status: 'Pending', date: '2 hours ago', location: 'Whitefield, Bangalore' },
    { id: 1002, buyer: 'Priya Sharma', product: 'Steel TMT Bars', quantity: 100, total: '₹5,500', status: 'Confirmed', date: '5 hours ago', location: 'MG Road, Bangalore' },
    { id: 1003, buyer: 'Amit Kumar', product: 'Premium Tiles', quantity: 200, total: '₹90,000', status: 'Shipped', date: '1 day ago', location: 'Indiranagar, Bangalore' },
    { id: 1004, buyer: 'Karthik Menon', product: 'Premium Cement', quantity: 30, total: '₹10,500', status: 'Delivered', date: '2 days ago', location: 'Koramangala, Bangalore' },
    { id: 1005, buyer: 'Suresh Reddy', product: 'Steel TMT Bars', quantity: 75, total: '₹4,125', status: 'Pending', date: '3 hours ago', location: 'Electronic City, Bangalore' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [stockEditProduct, setStockEditProduct] = useState<Product | null>(null);
  const [stockEditValue, setStockEditValue] = useState(0);

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
    toast.success('Product added successfully!');
  };

  /* ================= MANAGE STOCK ================= */
  const openStockModal = (product: Product) => {
    setStockEditProduct(product);
    setStockEditValue(product.stock);
  };

  const handleStockUpdate = () => {
    if (!stockEditProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === stockEditProduct.id ? { ...p, stock: stockEditValue } : p
      )
    );
    toast.success(`Stock updated for ${stockEditProduct.name}`, {
      description: `New stock: ${stockEditValue} ${stockEditProduct.unit}s`,
    });
    setStockEditProduct(null);
  };

  /* ================= ORDER STATUS ================= */
  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    toast.success(`Order #${orderId} marked as ${newStatus}`);
  };

  const statusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
    }
  };

  const nextStatus = (status: Order['status']): Order['status'] | null => {
    switch (status) {
      case 'Pending': return 'Confirmed';
      case 'Confirmed': return 'Shipped';
      case 'Shipped': return 'Delivered';
      case 'Delivered': return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/brigx.png"
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
                <p className="text-2xl font-bold">{orders.filter(o => o.status !== 'Delivered').length}</p>
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

        {/* TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1">
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders Received
              {orders.filter(o => o.status === 'Pending').length > 0 && (
                <Badge className="ml-1 bg-orange-600">{orders.filter(o => o.status === 'Pending').length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Products</h2>
              <Button onClick={() => setShowAddModal(true)} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{product.price} <span className="text-sm">/ {product.unit}</span>
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Stock: <strong>{product.stock}</strong></span>
                        <Badge variant="secondary">{product.orders} orders</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => openStockModal(product)}
                      >
                        Manage Stock
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Orders Received</h2>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>{orders.filter(o => o.status === 'Pending').length} pending</span>
                <span>•</span>
                <span>{orders.length} total</span>
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Card className={`hover:shadow-lg transition-shadow ${order.status === 'Pending' ? 'border-2 border-orange-400' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{order.buyer}</h3>
                            <Badge className={statusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {order.product} × {order.quantity}
                            </p>
                            <p className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {order.location}
                            </p>
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {order.date}
                            </p>
                          </div>

                          <p className="mt-2 text-lg font-bold text-orange-600">{order.total}</p>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {nextStatus(order.status) && (
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700"
                              onClick={() => updateOrderStatus(order.id, nextStatus(order.status)!)}
                            >
                              {order.status === 'Pending' && <><CheckCircle2 className="w-4 h-4 mr-1" /> Confirm</>}
                              {order.status === 'Confirmed' && <><Truck className="w-4 h-4 mr-1" /> Ship</>}
                              {order.status === 'Shipped' && <><CheckCircle2 className="w-4 h-4 mr-1" /> Delivered</>}
                            </Button>
                          )}
                          {order.status === 'Delivered' && (
                            <Badge className="bg-green-100 text-green-800 px-3 py-1">
                              <CheckCircle2 className="w-4 h-4 mr-1 inline" /> Complete
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Add Product
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MANAGE STOCK MODAL */}
      <AnimatePresence>
        {stockEditProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-sm p-6 space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Manage Stock</h3>
                <Button size="icon" variant="ghost" onClick={() => setStockEditProduct(null)}>
                  <X />
                </Button>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-lg text-gray-900">{stockEditProduct.name}</p>
                <p className="text-sm text-gray-500">
                  Current stock: <strong>{stockEditProduct.stock}</strong> {stockEditProduct.unit}s
                </p>

                <div>
                  <Label>New Stock Quantity</Label>
                  <Input
                    type="number"
                    value={stockEditValue}
                    onChange={(e) => setStockEditValue(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStockEditValue((v) => Math.max(0, v - 10))}
                  >
                    -10
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStockEditValue((v) => Math.max(0, v - 1))}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStockEditValue((v) => v + 1)}
                  >
                    +1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStockEditValue((v) => v + 10)}
                  >
                    +10
                  </Button>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleStockUpdate}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Update Stock
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
