import React from 'react';

const DashboardHome: React.FC = () => {
  const stats = [
    { label: '訪客人數', value: '261', change: '+12%' },
    { label: '總人氣', value: '309', change: '+5%' },
    { label: '互動數', value: '309', change: '+8%' },
    { label: '按讚數', value: '0', change: '0' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-serif text-secondary mb-8 italic">Welcome Back, Sister</h2>
      
      {/* 數據卡片 */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 圖表模擬區 */}
      <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm h-64 flex items-center justify-center text-gray-300">
        流量統計圖表 (Charts Logic Here)
      </div>
    </div>
  );
};

export default DashboardHome;