
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import api from '../utils/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { listFadeIn, itemSlideUp } from '../utils/animationVariants';

const ACCENT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

export default function ResponseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [formMeta, setFormMeta] = useState({ title: '', fields: [] });
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState('table'); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [respData, analyticsData] = await Promise.all([
          api.get(`/responses/${id}`),
          api.get(`/responses/${id}/analytics`),
        ]);
        setResponses(respData.data.responses);
        setFormMeta({ title: respData.data.form.title, fields: respData.data.form.fields });
        setAnalytics(analyticsData.data);
      } catch (err) {
        toast.error('Failed to load responses');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);
  const filteredResponses = useMemo(() => {
    if (!searchQuery) return responses;
    return responses.filter((resp) => {
      const allValues = Object.values(resp.answers || {}).join(' ').toLowerCase();
      return allValues.includes(searchQuery.toLowerCase());
    });
  }, [responses, searchQuery]);
  const exportCSV = async () => {
    try {
      const { data } = await api.get(`/responses/${id}/export`);
      const csv = Papa.unparse(data.exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.formTitle || 'responses'}_export.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch {
      toast.error('Export failed');
    }
  };
  const exportJSON = async () => {
    try {
      const { data } = await api.get(`/responses/${id}/export`);
      const blob = new Blob([JSON.stringify(data.exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${data.formTitle || 'responses'}_export.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('JSON downloaded!');
    } catch {
      toast.error('Export failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {}
      <header className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="text-surface-400 hover:text-white transition-colors">
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <div>
              <h1 className="text-lg font-display font-bold text-white">{formMeta.title}</h1>
              <p className="text-xs text-surface-400">{responses.length} response{responses.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="btn-ghost text-sm flex items-center gap-1.5">
              <i className="ri-file-excel-2-line"></i> CSV
            </button>
            <button onClick={exportJSON} className="btn-ghost text-sm flex items-center gap-1.5">
              <i className="ri-code-s-slash-line"></i> JSON
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        {analytics && (
          <motion.div
            variants={listFadeIn}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <motion.div variants={itemSlideUp} className="glass-card p-5">
              <p className="text-sm text-surface-400 mb-1">Total Submissions</p>
              <p className="text-3xl font-display font-bold text-white">{analytics.totalSubmissions}</p>
            </motion.div>
            <motion.div variants={itemSlideUp} className="glass-card p-5">
              <p className="text-sm text-surface-400 mb-1">Fields</p>
              <p className="text-3xl font-display font-bold text-white">{formMeta.fields.length}</p>
            </motion.div>
            <motion.div variants={itemSlideUp} className="glass-card p-5">
              <p className="text-sm text-surface-400 mb-1">Analytics Fields</p>
              <p className="text-3xl font-display font-bold text-white">{Object.keys(analytics.fieldStats).length}</p>
            </motion.div>
          </motion.div>
        )}

        {}
        <div className="flex gap-2 mb-6">
          {[{ id: 'table', icon: 'ri-table-line', label: 'Table' },
            { id: 'analytics', icon: 'ri-bar-chart-2-line', label: 'Analytics' }].map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveView(v.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeView === v.id
                  ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                  : 'text-surface-400 hover:bg-surface-800 border border-transparent'
              }`}
            >
              <i className={v.icon}></i> {v.label}
            </button>
          ))}
        </div>

        {}
        {activeView === 'table' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {}
            <div className="relative max-w-md mb-4">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search responses..."
                className="input-field pl-10"
              />
            </div>

            {}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-700/50">
                      <th className="text-left px-4 py-3 text-surface-400 font-medium">#</th>
                      {formMeta.fields.map((f) => (
                        <th key={f.fieldId} className="text-left px-4 py-3 text-surface-400 font-medium truncate max-w-[200px]">
                          {f.label}
                        </th>
                      ))}
                      <th className="text-left px-4 py-3 text-surface-400 font-medium">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResponses.length === 0 ? (
                      <tr>
                        <td colSpan={formMeta.fields.length + 2} className="text-center py-12 text-surface-500">
                          {searchQuery ? 'No matches found' : 'No responses yet'}
                        </td>
                      </tr>
                    ) : (
                      filteredResponses.map((resp, idx) => (
                        <tr key={resp._id} className="border-b border-surface-800/50 hover:bg-surface-800/30 transition-colors">
                          <td className="px-4 py-3 text-surface-500">{idx + 1}</td>
                          {formMeta.fields.map((f) => {
                            const val = resp.answers?.[f.fieldId];
                            const display = Array.isArray(val) ? val.join(', ') : (val ?? '—');
                            return (
                              <td key={f.fieldId} className="px-4 py-3 text-surface-200 truncate max-w-[200px]" title={display}>
                                {display}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-surface-400 whitespace-nowrap">
                            {new Date(resp.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {}
        {activeView === 'analytics' && analytics && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {}
            {analytics.timelineData.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Submissions Over Time</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={analytics.timelineData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" fill="url(#colorCount)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {Object.entries(analytics.fieldStats).map(([fieldId, stat]) => (
              <div key={fieldId} className="glass-card p-5">
                <h3 className="text-lg font-display font-semibold text-white mb-1">{stat.label}</h3>
                <p className="text-xs text-surface-400 mb-4 capitalize">{stat.kind}</p>
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  {}
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(stat.distribution).map(([name, value]) => ({ name, value }))}
                          cx="50%" cy="50%"
                          innerRadius={40} outerRadius={70}
                          dataKey="value"
                          paddingAngle={3}
                        >
                          {Object.keys(stat.distribution).map((_, i) => (
                            <Cell key={i} fill={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {}
                  <div className="flex-1 space-y-2">
                    {Object.entries(stat.distribution).map(([label, count], i) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ACCENT_COLORS[i % ACCENT_COLORS.length] }} />
                          <span className="text-sm text-surface-200">{label}</span>
                        </div>
                        <span className="text-sm text-surface-400 font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {Object.keys(analytics.fieldStats).length === 0 && analytics.timelineData.length === 0 && (
              <div className="text-center py-16">
                <i className="ri-bar-chart-2-line text-4xl text-surface-600 mb-3 block"></i>
                <p className="text-surface-400">No analytics data available yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
