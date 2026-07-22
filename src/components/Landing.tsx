import { motion, useMotionValue, useTransform } from 'motion/react';
import { BookOpen, Shield, Sparkles, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import JourneyDashboard from './JourneyDashboard';

interface LandingProps {
  onStart: () => void;
  onOpenModal: (modal: 'methodology' | 'sources' | 'remedies') => void;
}

const ADHKAR_LIST = [
  {
    arabic: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    translation: "Allah is sufficient for me. There is none worthy of worship but Him. I have placed my trust in Him, and He is the Lord of the Majestic Throne.",
    reference: "Abu Dawud 4:321"
  },
  {
    arabic: "بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    translation: "In the Name of Allah with Whose Name there is protection against every kind of harm in the earth or in the heaven, and He is the All-Hearing and All-Knowing.",
    reference: "Abu Dawud 4:323"
  },
  {
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    translation: "I seek refuge in the Perfect Words of Allah from the evil of what He has created.",
    reference: "Muslim 4:2080"
  },
  {
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    translation: "I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad (peace and blessings of Allah be upon him) as my Prophet.",
    reference: "Abu Dawud 4:318"
  }
];

export default function Landing({ onStart, onOpenModal }: LandingProps) {
  const [dailyDhikr, setDailyDhikr] = useState(ADHKAR_LIST[0]);
  const [isDhikrCompleted, setIsDhikrCompleted] = useState(false);

  useEffect(() => {
    // Check completion status from localStorage
    const today = new Date().toDateString();
    const storedStatus = localStorage.getItem('dhikrCompleted');
    const storedDate = localStorage.getItem('dhikrDate');

    if (storedDate === today && storedStatus === 'true') {
      setIsDhikrCompleted(true);
    } else {
      setIsDhikrCompleted(false);
      localStorage.setItem('dhikrDate', today);
      localStorage.setItem('dhikrCompleted', 'false');
    }

    // Pick a random dhikr on mount
    const randomIndex = Math.floor(Math.random() * ADHKAR_LIST.length);
    setDailyDhikr(ADHKAR_LIST[randomIndex]);
  }, []);

  const toggleDhikrCompletion = () => {
    const newStatus = !isDhikrCompleted;
    setIsDhikrCompleted(newStatus);
    localStorage.setItem('dhikrCompleted', String(newStatus));
  };

  const TESTIMONIALS = [
    {
      quote: "The guidance provided brought immense clarity and peace to my heart. It's rare to find an assessment so deeply rooted in authentic sources.",
      author: "Ahmad M.",
      role: "Community Member"
    },
    {
      quote: "I appreciated the compassionate approach. The daily adhkar reminders and the structured methodology helped me refocus on my spiritual well-being.",
      author: "Sarah A.",
      role: "Student"
    },
    {
      quote: "This platform is a breath of fresh air. It offers practical, permissible remedies that align perfectly with the Qur'an and Sunnah.",
      author: "Omar K.",
      role: "Professional"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col w-full gap-24 pb-12"
    >
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between flex-1 w-full gap-12 mt-4 lg:mt-12">
        <div className="lg:w-5/12 text-left mb-12 lg:mb-0">
        <h1 className="serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
          Seek Guidance <br/>
          Through <span className="accent-gold block py-2">Authentic</span>
          Spiritual Wisdom
        </h1>
        <p className="sans text-slate-400 text-sm sm:text-base leading-relaxed mb-8 pr-0 lg:pr-12">
          A specialized assessment framework and adhkar tracker strictly anchored in the Holy Qur'an, Authentic Hadith, and scholarly texts. We provide compassionate, evidence-based evaluation and daily remembrances for your spiritual well-being.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button
            onClick={onStart}
            className="bg-gold text-black px-8 py-3 serif text-sm font-bold tracking-widest shadow-lg hover:bg-[#b59049] transition-colors"
          >
            BEGIN ASSESSMENT
          </button>
          <button 
            onClick={() => onOpenModal('sources')}
            className="border border-white/20 px-8 py-3 serif text-sm tracking-widest hover:bg-white/5 transition-all text-slate-200"
          >
            VIEW SOURCES
          </button>
        </div>
        
        {/* Daily Adhkar Card */}
        <div className={`glass card-gradient p-5 rounded-xl border transition-all duration-300 max-w-lg ${isDhikrCompleted ? 'border-[#C5A059]/50' : 'border-white/10'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <h4 className="text-[10px] uppercase tracking-widest font-semibold text-[#C5A059]">Daily Adhkar</h4>
            </div>
            <button 
              onClick={toggleDhikrCompletion}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] uppercase tracking-widest font-semibold transition-colors ${
                isDhikrCompleted 
                  ? 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30' 
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isDhikrCompleted ? 'Completed' : 'Mark Complete'}
            </button>
          </div>
          <p className={`text-lg text-right font-arabic mb-3 leading-loose transition-colors ${isDhikrCompleted ? 'text-slate-400' : 'text-slate-200'}`} dir="rtl">
            {dailyDhikr.arabic}
          </p>
          <p className={`text-xs mb-2 italic transition-colors ${isDhikrCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
            "{dailyDhikr.translation}"
          </p>
          <p className="text-[9px] text-slate-500 uppercase tracking-wider">
            {dailyDhikr.reference}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-7/12 relative flex justify-center items-center">
        <div className="absolute w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] border border-[#C5A059]/10 rounded-full z-0"></div>

        <div className="relative w-full max-w-[520px] card-gradient rounded-xl p-6 sm:p-8 shadow-2xl border border-white/10 z-10">
          {/* Inner elements */}
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest accent-gold mb-1 block sans font-semibold">Step 01 — Understanding</span>
                <h2 className="serif text-xl text-slate-200">Compassionate Listening</h2>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { icon: BookOpen, title: "Quran & Hadith", desc: "Rooted strictly in authentic sources." },
                { icon: Shield, title: "Safe & Professional", desc: "No superstitions or fear-based language." },
                { icon: Sparkles, title: "Clear Guidance", desc: "Practical, permissible spiritual remedies." }
              ].map((feature, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-lg glass transition-colors cursor-pointer hover:bg-white/5"
                  onClick={() => i === 0 ? onOpenModal('sources') : i === 1 ? onOpenModal('methodology') : onOpenModal('remedies')}
                >
                  <div className="p-2 rounded-lg bg-gold/10 accent-gold text-[#C5A059]">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="serif text-sm text-slate-200 mb-1">{feature.title}</h3>
                    <p className="sans text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-4 -left-4 sm:-left-8 glass p-3 px-6 rounded-full shadow-2xl z-20">
              <span className="sans text-[9px] uppercase tracking-widest flex items-center gap-2 text-slate-200">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                Verified Scholarly Sources
              </span>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      <JourneyDashboard isDhikrCompleted={isDhikrCompleted} />

      {/* Testimonials Section */}
      <div className="w-full flex flex-col items-center pt-12 border-t border-white/5">
        <div className="text-center mb-12">
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] mb-3 block font-semibold">Community</span>
          <h3 className="serif text-3xl text-slate-200">Words of Comfort</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="glass card-gradient p-8 rounded-xl border border-white/10 flex flex-col relative overflow-hidden group hover:border-[#C5A059]/30 transition-colors">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-16 h-16 text-[#C5A059]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="sans text-sm text-slate-300 leading-relaxed mb-8 flex-1 italic relative z-10">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#C5A059] serif font-bold text-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">{testimonial.author}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
