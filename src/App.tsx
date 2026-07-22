import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import Landing from './components/Landing';
import Chat from './components/Chat';
import Modal from './components/Modal';

import FloatingChatWidget from './components/FloatingChatWidget';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-slate-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function App() {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [activeModal, setActiveModal] = useState<'methodology' | 'sources' | 'remedies' | 'contact' | 'faq' | 'glossary' | null>(null);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-slate-200 flex flex-col font-sans overflow-hidden relative">
      {/* Running Ayah Ticker */}
      <div className="w-full bg-[#C5A059]/10 border-b border-[#C5A059]/20 py-2 overflow-hidden flex items-center relative z-30">
        <div className="animate-marquee whitespace-nowrap">
          <span className="font-arabic text-[#C5A059] text-sm md:text-base px-4" dir="rtl">
            وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِلْمُؤْمِنِينَ (الإسراء: 82)
          </span>
          <span className="text-xs md:text-sm text-slate-400 px-4 mr-16">
            "And We send down of the Qur'an that which is healing and mercy for the believers" (Al-Isra, 17:82)
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#C5A059] flex items-center justify-center rotate-45">
            <span className="serif accent-gold text-xl -rotate-45">Q</span>
          </div>
          <span className="serif tracking-widest text-lg">Al Shafi <span className="text-xs block opacity-50 tracking-normal sans">Portal</span></span>
        </div>
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] opacity-70">
          <button onClick={() => setActiveModal('methodology')} className="hover:text-[#C5A059] transition-colors">Methodology</button>
          <button onClick={() => setActiveModal('sources')} className="hover:text-[#C5A059] transition-colors">Sources</button>
          <button onClick={() => setActiveModal('remedies')} className="hover:text-[#C5A059] transition-colors">Remedies</button>
          <button onClick={() => setActiveModal('faq')} className="hover:text-[#C5A059] transition-colors">FAQ</button>
          <button onClick={() => setActiveModal('glossary')} className="hover:text-[#C5A059] transition-colors">Glossary</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 py-4">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <Landing key="landing" onStart={() => setView('chat')} onOpenModal={setActiveModal} />
          ) : (
            <Chat key="chat" onBack={() => setView('landing')} />
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Sources Bar */}
      <footer className="px-6 md:px-12 py-6 md:py-8 bg-[#0F1115] border-t border-white/5 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
          <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-slate-600 font-bold tracking-widest">Primary Source</span>
              <span className="serif text-xs opacity-80">The Holy Qur'an</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-slate-600 font-bold tracking-widest">Supporting Text</span>
              <span className="serif text-xs opacity-80">Authentic Hadith</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-slate-600 font-bold tracking-widest">Specialized Reference</span>
              <span className="serif text-xs opacity-80">Scholarly Guidance</span>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-6 text-left md:text-right">
            <div>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest leading-none mb-2">
                Medical & Mental Health Disclaimer
              </p>
              <p className="text-[9px] text-slate-500 max-w-[300px] mb-4 md:mb-3">
                Spiritual assessments do not replace clinical diagnosis. Please consult qualified medical professionals for physical or psychological symptoms.
              </p>
              <div className="flex gap-4 md:justify-end mt-2">
                <button 
                  onClick={() => setActiveModal('faq')} 
                  className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#b59049] transition-colors border-b border-[#C5A059]/30 pb-0.5"
                >
                  FAQ
                </button>
                <button 
                  onClick={() => setActiveModal('glossary')} 
                  className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#b59049] transition-colors border-b border-[#C5A059]/30 pb-0.5"
                >
                  Glossary
                </button>
                <button 
                  onClick={() => setActiveModal('contact')} 
                  className="text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-[#b59049] transition-colors border-b border-[#C5A059]/30 pb-0.5"
                >
                  Contact Information
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-[9px] text-slate-600 uppercase tracking-widest leading-none mb-2">
                Privacy Notice
              </p>
              <p className="text-[9px] text-slate-500 max-w-[300px]">
                Your conversations are private and confidential. User inputs are processed securely in real-time solely to provide assessments and are not permanently stored or shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <Modal isOpen={activeModal === 'methodology'} onClose={() => setActiveModal(null)} title="Our Methodology">
        <div className="space-y-4">
          <p>
            The objective of Al Shafi Portal is to provide a careful, evidence-based spiritual assessment that remains faithful to our sources, treating every client with honesty, compassion, and professionalism.
          </p>
          <h4 className="font-semibold text-slate-200 mt-6 mb-2">Assessment Process</h4>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li><strong className="text-slate-300">Information Gathering:</strong> We carefully listen to your symptoms, timing, and history before making any assessments.</li>
            <li><strong className="text-slate-300">Evidence-Based Evaluation:</strong> We evaluate the situation strictly according to approved sources. We never exaggerate certainty.</li>
            <li><strong className="text-slate-300">Uncertainty Policy:</strong> If there is insufficient evidence to conclude that an issue is spiritual (such as black magic, evil eye, or jinn), we state so honestly.</li>
          </ul>
          <h4 className="font-semibold text-slate-200 mt-6 mb-2">Forbidden Behaviors</h4>
          <p className="text-slate-400">
            We strictly avoid inventing explanations, creating new spiritual concepts, mixing personal opinions, using folklore, or presenting assumptions as facts.
          </p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'sources'} onClose={() => setActiveModal(null)} title="Authentic Sources">
        <div className="space-y-4">
          <p>
            Our guidance and assessments are strictly restricted to information supported by established texts. We never use cultural beliefs, internet myths, or unsupported practices.
          </p>
          <div className="grid gap-4 mt-4">
            <div className="glass p-4 rounded-lg">
              <h4 className="serif text-gold-accent font-bold mb-1">The Holy Qur'an</h4>
              <p className="text-xs text-slate-400">The primary source of truth, healing, and protection in Islam.</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <h4 className="serif text-gold-accent font-bold mb-1">Authentic Hadith</h4>
              <p className="text-xs text-slate-400">Verified teachings and practices of the Prophet Muhammad (ﷺ).</p>
            </div>
            <div className="glass p-4 rounded-lg">
              <h4 className="serif text-gold-accent font-bold mb-1">Scholarly Guidance</h4>
              <p className="text-xs text-slate-400">Recognized scholarly manuals on identifying and treating spiritual afflictions according to the Sunnah.</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'remedies'} onClose={() => setActiveModal(null)} title="Spiritual Remedies">
        <div className="space-y-4">
          <p>
            We only recommend remedies and practices that are firmly rooted in our approved sources.
          </p>
          <h4 className="font-semibold text-slate-200 mt-6 mb-2">Recommended Practices</h4>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Recitation of specific Qur'anic verses (Ruqyah)</li>
            <li>Consistent Morning and Evening Adhkar (remembrances)</li>
            <li>Authentic Prophetic Du'as (supplications)</li>
            <li>Maintaining regular Salah (prayer) and seeking forgiveness</li>
            <li>Tawakkul (putting complete trust in Allah)</li>
          </ul>
          <div className="mt-6 p-4 border border-red-500/20 bg-red-500/5 rounded-lg">
            <h4 className="font-semibold text-red-400 mb-2">Prohibited Practices</h4>
            <p className="text-xs text-slate-400">
              We strictly forbid and will never recommend talismans, amulets, charms, numerology, astrology, fortune-telling, or any unverified cultural rituals.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'contact'} onClose={() => setActiveModal(null)} title="Contact Information">
        <div className="space-y-6">
          <p className="text-slate-400">
            If you need further assistance or wish to reach out directly, please use the contact details below.
          </p>
          <div className="grid gap-4">
            <div className="glass p-4 rounded-lg flex items-center justify-between group">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Email Address</h4>
                <p className="serif text-slate-200 text-base md:text-lg">linksundas981@gmail.com</p>
              </div>
              <CopyButton text="linksundas981@gmail.com" />
            </div>
            <div className="glass p-4 rounded-lg flex items-center justify-between group">
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Phone Number</h4>
                <p className="serif text-slate-200 text-base md:text-lg">03468302953</p>
              </div>
              <CopyButton text="03468302953" />
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'faq'} onClose={() => setActiveModal(null)} title="Frequently Asked Questions">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">What is Al Shafi Portal?</h4>
            <p className="text-sm text-slate-400">
              Al Shafi Portal is a secure platform designed to provide evidence-based spiritual assessments guided by the Qur'an and authentic Sunnah.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Are my conversations private?</h4>
            <p className="text-sm text-slate-400">
              Yes, all interactions are private and confidential. Your messages are processed securely in real-time and are not permanently stored or shared.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">Does this replace medical advice?</h4>
            <p className="text-sm text-slate-400">
              No. Spiritual assessments are supplementary. Always consult qualified medical professionals for any physical or psychological symptoms.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200">What kind of remedies are suggested?</h4>
            <p className="text-sm text-slate-400">
              We only suggest remedies firmly rooted in our approved sources, such as specific Qur'anic verses (Ruqyah), authentic Prophetic supplications, and maintaining regular prayer.
            </p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'glossary'} onClose={() => setActiveModal(null)} title="Glossary of Terms">
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-[#C5A059]">Ruqyah</span> (الرُّقْيَة)
            </h4>
            <p className="text-sm text-slate-400">
              Recitation of the Qur'an, seeking of refuge, remembrance and supplications that are used as a means of treating sicknesses and other problems, as established in the authentic Sunnah.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-[#C5A059]">Ayn / Evil Eye</span> (العين)
            </h4>
            <p className="text-sm text-slate-400">
              Harm or misfortune transmitted through the gaze or admiration of another person, often unintentionally. It is an acknowledged reality in Islamic theology that is treated through specific adhkar and Ruqyah.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-[#C5A059]">Dhikr</span> (ذِكْر)
            </h4>
            <p className="text-sm text-slate-400">
              The remembrance of Allah, typically consisting of specific phrases of praise or glorification repeated consistently.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-[#C5A059]">Sihr</span> (سِحْر)
            </h4>
            <p className="text-sm text-slate-400">
              Magic or sorcery. It is strictly forbidden in Islam, and those afflicted by it seek cure through the Qur'an and authentic prophetic medicine.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 flex items-center gap-2">
              <span className="text-[#C5A059]">Hasad</span> (حَسَد)
            </h4>
            <p className="text-sm text-slate-400">
              Destructive envy. The desire for someone else's blessing to be removed. Like the Evil Eye, it is addressed through specific prayers for protection.
            </p>
          </div>
        </div>
      </Modal>

      {/* Floating Chat Widget */}
      {view === 'landing' && <FloatingChatWidget />}

    </div>
  );
}
