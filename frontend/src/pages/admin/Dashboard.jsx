import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UsersIcon, 
  CurrencyRupeeIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...');
        const [statsRes, ordersRes, productsRes] = await Promise.allSettled([
          adminAPI.getDashboardStats(),
          adminAPI.getOrders({ size: 5, sortBy: 'createdAt', sortDir: 'desc' }),
          adminAPI.getProducts({ size: 5, sortBy: 'createdAt', sortDir: 'desc' }),
        ]);
        
        if (statsRes.status === 'fulfilled') {
          console.log('Stats fetched:', statsRes.value.data);
          setStats(statsRes.value.data?.data || {});
        } else {
          console.error('Failed to fetch stats:', statsRes.reason);
          toast.error('Failed to load dashboard statistics');
        }

        if (ordersRes.status === 'fulfilled') {
          setRecentOrders(ordersRes.value.data?.data?.content || ordersRes.value.data?.data || []);
        } else {
          console.error('Failed to fetch orders:', ordersRes.reason);
        }

        if (productsRes.status === 'fulfilled') {
          setRecentProducts(productsRes.value.data?.data?.content || productsRes.value.data?.data || []);
        } else {
          console.error('Failed to fetch products:', productsRes.reason);
        }
      } catch (e) { 
        console.error('Unexpected error in dashboard data fetch:', e);
        toast.error('An unexpected error occurred while loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted');
      setRecentProducts(p => p.filter(x => x.id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size="lg" /></div>;

  const statCards = [
    { title: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: CurrencyRupeeIcon, color: 'bg-green-500', change: '+12%' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBagIcon, color: 'bg-blue-500', change: '+8%' },
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: CubeIcon, color: 'bg-purple-500', change: '+5%' },
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: UsersIcon, color: 'bg-orange-500', change: '+15%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your store overview.</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary flex items-center gap-2">
          <CubeIcon className="h-5 w-5" /> Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="flex items-center text-sm font-medium text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />{stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-primary-600 text-sm font-medium hover:underline">View All →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-3 pr-4">Order</th>
                  <th className="pb-3 pr-4">Customer</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="4" className="py-8 text-center text-gray-400">No orders yet</td></tr>
                ) : recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 pr-4">
                      <Link to={`/admin/orders/${order.id}`} className="text-primary-600 hover:underline font-medium text-xs">
                        #{order.orderNumber || order.id?.substring(0,8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-gray-600 dark:text-gray-400 text-xs">{order.userName || order.userEmail || 'Customer'}</td>
                    <td className="py-3 pr-4 font-semibold">₹{(order.totalAmount || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.orderStatus || order.status] || 'bg-gray-100 text-gray-800'}`}>
                        {order.orderStatus || order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/admin/products/new', icon: CubeIcon, label: 'Add New Product', color: 'text-blue-600' },
              { to: '/admin/products', icon: CubeIcon, label: 'All Products', color: 'text-purple-600' },
              { to: '/admin/categories', icon: ShoppingBagIcon, label: 'Categories', color: 'text-green-600' },
              { to: '/admin/orders', icon: ShoppingBagIcon, label: 'All Orders', color: 'text-orange-600' },
              { to: '/admin/users', icon: UsersIcon, label: 'Users', color: 'text-pink-600' },
            ].map(a => (
              <Link key={a.to} to={a.to} className="p-4 border rounded-xl hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-center group">
                <a.icon className={`h-7 w-7 mx-auto mb-2 ${a.color} group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Products with Edit/Delete */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Products</h2>
          <Link to="/admin/products" className="text-primary-600 text-sm font-medium hover:underline">View All →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
                <th className="px-4 py-3 rounded-l-lg">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {recentProducts.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">No products yet</td></tr>
              ) : recentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img src={product.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-xs line-clamp-2 max-w-[200px]">{product.name}</p>
                        <p className="text-gray-400 text-xs">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{product.categoryName}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-xs">₹{(product.discountPrice || product.price || 0).toLocaleString()}</p>
                    {product.discountPrice && <p className="text-gray-400 text-xs line-through">₹{(product.price || 0).toLocaleString()}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{product.stockQuantity}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/products/${product.id}/edit`)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => navigate(`/products/${product.id}`)} className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="View on site">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id, product.name)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
