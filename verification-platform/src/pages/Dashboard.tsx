import {
  TrendingUp,
  Users,
  FileCheck,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Upload,
  Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Clients',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      link: '/clients',
    },
    {
      title: 'Pending Reviews',
      value: '156',
      change: '-8.2%',
      trend: 'down',
      icon: Clock,
      color: 'yellow',
      link: '/documents',
    },
    {
      title: 'Approved',
      value: '2,459',
      change: '+18.7%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green',
      link: '/clients',
    },
    {
      title: 'Active Partners',
      value: '42',
      change: '+5.3%',
      trend: 'up',
      icon: Building2,
      color: 'purple',
      link: '/partners',
    },
  ];

  const verificationData = [
    { month: 'Jan', verifications: 240 },
    { month: 'Feb', verifications: 320 },
    { month: 'Mar', verifications: 280 },
    { month: 'Apr', verifications: 390 },
    { month: 'May', verifications: 420 },
    { month: 'Jun', verifications: 510 },
  ];

  const documentStatusData = [
    { name: 'Approved', value: 2459, color: '#10b981' },
    { name: 'Pending', value: 156, color: '#f59e0b' },
    { name: 'Rejected', value: 232, color: '#ef4444' },
  ];

  const recentActivities = [
    {
      id: 1,
      clientId: 'CLT-001',
      client: 'Acme Corp Ltd',
      action: 'Documents approved',
      time: '5 minutes ago',
      status: 'approved',
      country: 'United Kingdom',
    },
    {
      id: 2,
      clientId: 'CLT-002',
      client: 'TechStart Inc',
      action: 'Verification pending',
      time: '12 minutes ago',
      status: 'pending',
      country: 'United States',
    },
    {
      id: 3,
      clientId: 'CLT-003',
      client: 'Global Traders SA',
      action: 'Documents rejected',
      time: '1 hour ago',
      status: 'rejected',
      country: 'Spain',
    },
    {
      id: 4,
      clientId: 'CLT-004',
      client: 'Eastern Imports',
      action: 'Documents approved',
      time: '2 hours ago',
      status: 'approved',
      country: 'Singapore',
    },
    {
      id: 5,
      clientId: 'CLT-005',
      client: 'Nordic Solutions',
      action: 'New submission',
      time: '3 hours ago',
      status: 'pending',
      country: 'Norway',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                onClick={() => navigate(stat.link)}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${getColorClasses(stat.color)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Trend */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Verification Trend</h2>
                <p className="text-sm text-gray-600">Monthly verification statistics</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={verificationData}>
                <defs>
                  <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Area type="monotone" dataKey="verifications" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVerifications)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Document Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Document Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={documentStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {documentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {documentStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Document Verification */}
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Document Verification</h2>
                  <p className="text-purple-100 mt-1">Powered by Advanced Machine Learning</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold">Coming Soon</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <h3 className="font-semibold">Auto-Verification</h3>
                </div>
                <p className="text-sm text-purple-100">Automatically verify documents using AI with 99.8% accuracy</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileCheck className="w-5 h-5 text-blue-300" />
                  <h3 className="font-semibold">Fraud Detection</h3>
                </div>
                <p className="text-sm text-purple-100">Detect forged or tampered documents instantly with AI</p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-yellow-300" />
                  <h3 className="font-semibold">Instant Processing</h3>
                </div>
                <p className="text-sm text-purple-100">Process hundreds of documents in seconds, not hours</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all flex items-center gap-2 shadow-lg">
                <Upload className="w-5 h-5" />
                Upload Documents for AI Review
              </button>
              <button className="bg-white bg-opacity-20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-30 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                onClick={() => navigate(`/documents/${activity.clientId}`)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.client}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <div className="hidden md:block">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {activity.country}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 ml-4">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
