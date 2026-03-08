import { useMemo } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, BookOpen, Brain, Activity } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from "recharts";
import { useSessions } from "@/hooks/use-sessions";
import { useConcepts } from "@/hooks/use-concepts";
import { GlassCard } from "@/components/ui/glass-card";

export default function Dashboard() {
  const { data: sessions, isLoading: sessionsLoading } = useSessions();
  const { data: concepts, isLoading: conceptsLoading } = useConcepts();

  const isLoading = sessionsLoading || conceptsLoading;

  // Process data for charts
  const stats = useMemo(() => {
    if (!sessions || !concepts) return null;

    // Difficulty Distribution
    const difficultyCounts = [1, 2, 3, 4, 5].map(level => ({
      level: `Level ${level}`,
      count: sessions.filter(s => s.difficulty === level).length
    }));

    // Topic Distribution
    const topicMap = sessions.reduce((acc, session) => {
      acc[session.topic] = (acc[session.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topicData = Object.entries(topicMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5

    // Activity over time (simplified to dates)
    const activityMap = [...sessions, ...concepts].reduce((acc, item) => {
      const date = new Date(item.createdAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activityData = Object.entries(activityMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    const averageDifficulty = sessions.length 
      ? (sessions.reduce((sum, s) => sum + s.difficulty, 0) / sessions.length).toFixed(1)
      : 0;

    return {
      totalNotes: sessions.length,
      totalConcepts: concepts.length,
      averageDifficulty,
      difficultyCounts,
      topicData,
      activityData
    };
  }, [sessions, concepts]);

  if (isLoading || !stats) {
    return (
      <div className="pt-24 min-h-screen flex justify-center items-center">
        <div className="animate-pulse space-y-6 flex flex-col items-center">
          <Activity className="w-12 h-12 text-primary animate-pulse" />
          <div className="text-xl font-display text-muted-foreground">Loading insights...</div>
        </div>
      </div>
    );
  }

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-primary/20 text-primary rounded-xl border border-primary/30">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold">Learning Dashboard</h1>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div variants={item}>
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Study Sessions</p>
              <h3 className="text-4xl font-display font-bold text-white">{stats.totalNotes}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Concepts Mastered</p>
              <h3 className="text-4xl font-display font-bold text-white">{stats.totalConcepts}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
              <Brain className="w-6 h-6 text-pink-400" />
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard className="p-6 flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Avg. Difficulty</p>
              <h3 className="text-4xl font-display font-bold text-white">{stats.averageDifficulty} <span className="text-xl text-muted-foreground">/ 5</span></h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div variants={item}>
          <GlassCard variant="panel" className="h-96">
            <h3 className="text-lg font-display font-bold mb-6">Recent Activity</h3>
            {stats.activityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4}
                    dot={{ r: 4, fill: 'hsl(var(--background))', strokeWidth: 2 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No recent activity</div>
            )}
          </GlassCard>
        </motion.div>

        <motion.div variants={item}>
          <GlassCard variant="panel" className="h-96">
            <h3 className="text-lg font-display font-bold mb-6">Topic Distribution</h3>
            {stats.topicData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">No topics yet</div>
            )}
            
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {stats.topicData.map((entry, index) => (
                <div key={entry.name} className="flex items-center text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <GlassCard variant="panel" className="h-80">
            <h3 className="text-lg font-display font-bold mb-6">Difficulty Profile</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.difficultyCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="level" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.difficultyCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
