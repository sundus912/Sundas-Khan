import { useState, useEffect } from 'react';
import { Activity, Star, Calendar } from 'lucide-react';

const getLast7Days = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toDateString());
  }
  return dates;
};

export default function JourneyDashboard({ isDhikrCompleted }: { isDhikrCompleted: boolean }) {
  const [history, setHistory] = useState<Record<string, { adhkar: boolean, prayer: boolean }>>({});
  const days = getLast7Days();

  useEffect(() => {
    // Load history from localStorage
    const stored = localStorage.getItem('spiritualJourney');
    const data = stored ? JSON.parse(stored) : {};
    
    // Check if today exists, if not initialize
    const today = new Date().toDateString();
    if (!data[today]) {
      data[today] = { 
        adhkar: isDhikrCompleted, 
        prayer: false 
      };
    } else {
      // Sync with today's dhikr status passed as prop
      data[today].adhkar = isDhikrCompleted;
    }
    
    // Ensure we have some mock data for empty days for visual effect (only if no existing history)
    const hasData = Object.keys(data).length > 1;
    if (!hasData) {
      days.forEach((day) => {
        if (day !== today) {
          data[day] = {
            adhkar: Math.random() > 0.3,
            prayer: Math.random() > 0.4
          };
        }
      });
    }

    setHistory(data);
    localStorage.setItem('spiritualJourney', JSON.stringify(data));
  }, [isDhikrCompleted]); // Run when dhikr state changes to sync

  // Handle today's prayer toggle
  const toggleTodayPrayer = () => {
    const today = new Date().toDateString();
    const updated = { ...history };
    if (!updated[today]) {
      updated[today] = { adhkar: isDhikrCompleted, prayer: false };
    }
    updated[today].prayer = !updated[today].prayer;
    setHistory(updated);
    localStorage.setItem('spiritualJourney', JSON.stringify(updated));
  };

  const getDayLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
  };

  return (
    <div className="w-full flex flex-col items-center pt-12 border-t border-white/5 mb-12">
      <div className="text-center mb-10">
        <span className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-3 block font-semibold">Progress Tracker</span>
        <h3 className="serif text-3xl text-slate-200">Spiritual Journey</h3>
      </div>
      
      <div className="w-full max-w-4xl glass card-gradient p-8 rounded-xl border border-white/10 flex flex-col lg:flex-row gap-10">
        
        {/* Weekly Visualization */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-[#C5A059]" />
            <h4 className="serif text-lg text-slate-200">7-Day Consistency</h4>
          </div>
          
          <div className="space-y-6">
            {/* Adhkar Track */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                <span>Daily Adhkar</span>
                <span className="text-[#C5A059]">{days.filter(d => history[d]?.adhkar).length}/7</span>
              </div>
              <div className="flex gap-2 h-12">
                {days.map((day) => (
                  <div key={`adhkar-${day}`} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className={`w-full flex-1 rounded-sm transition-all duration-300 ${history[day]?.adhkar ? 'bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.3)]' : 'bg-white/5 border border-white/10'}`}></div>
                    <span className={`text-[10px] font-medium ${day === new Date().toDateString() ? 'text-[#C5A059]' : 'text-slate-500'}`}>{getDayLabel(day)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prayer Track */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                <span>Obligatory Prayers</span>
                <span className="text-green-500">{days.filter(d => history[d]?.prayer).length}/7</span>
              </div>
              <div className="flex gap-2 h-12">
                {days.map((day) => (
                  <div key={`prayer-${day}`} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    <div className={`w-full flex-1 rounded-sm transition-all duration-300 ${history[day]?.prayer ? 'bg-green-600/80 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-white/5 border border-white/10'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Actions */}
        <div className="w-full lg:w-72 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-10">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#C5A059]" />
            <h4 className="serif text-lg text-slate-200">Today's Check-in</h4>
          </div>
          
          <div className="space-y-4">
             <div className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:border-green-500/30 transition-colors">
               <div>
                 <span className="text-sm text-slate-200 block mb-1">Obligatory Prayers</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-widest">Mark completed</span>
               </div>
               <button 
                onClick={toggleTodayPrayer}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${history[new Date().toDateString()]?.prayer ? 'bg-green-600/20 text-green-500 border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-black/40 text-slate-500 border border-white/10 hover:border-white/30 hover:text-slate-300'}`}
               >
                 <Star className={`w-4 h-4 ${history[new Date().toDateString()]?.prayer ? 'fill-current' : ''}`} />
               </button>
             </div>
             
             <p className="text-xs text-slate-500 italic leading-relaxed mt-2 p-3 bg-black/20 rounded-lg border border-white/5">
               Adhkar progress is synchronized automatically when you check off your Daily Reminder.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
