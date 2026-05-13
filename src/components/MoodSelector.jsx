const MOODS = [
  { name: 'Happy',     icon: '😊', desc: 'Light & cheerful',    color: 'hover:border-yellow-400 hover:bg-yellow-50 data-[active=true]:border-yellow-400 data-[active=true]:bg-yellow-50' },
  { name: 'Tired',     icon: '☕', desc: 'Quick & comforting',  color: 'hover:border-amber-400 hover:bg-amber-50 data-[active=true]:border-amber-400 data-[active=true]:bg-amber-50' },
  { name: 'Energetic', icon: '⚡', desc: 'Protein-packed',      color: 'hover:border-orange-400 hover:bg-orange-50 data-[active=true]:border-orange-400 data-[active=true]:bg-orange-50' },
  { name: 'Morning',   icon: '🌤️', desc: 'Breakfast & brunch',  color: 'hover:border-sky-400 hover:bg-sky-50 data-[active=true]:border-sky-400 data-[active=true]:bg-sky-50' },
  { name: 'Evening',   icon: '🌙', desc: 'Cozy dinner ideas',   color: 'hover:border-blue-400 hover:bg-blue-50 data-[active=true]:border-blue-400 data-[active=true]:bg-blue-50' },
]
export default function MoodSelector({ selectedMood, onMoodSelect }) {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-stone-800 mb-1">How are you feeling?</h2>
      <p className="text-stone-500 mb-5 text-sm">Pick a mood and we'll suggest the perfect recipes</p>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {MOODS.map(mood => (
          <button
            key={mood.name}
            data-active={selectedMood === mood.name}
            onClick={() => onMoodSelect(mood.name)}
            className={`flex flex-col items-center gap-1.5 py-4 px-2 rounded-xl border-2 border-stone-200 bg-white transition-all duration-200 cursor-pointer ${mood.color} ${
              selectedMood === mood.name ? 'shadow-md scale-105' : 'hover:scale-105 hover:shadow-sm'
            }`}
          >
            <span className="text-2xl">{mood.icon}</span>
            <span className="text-xs font-semibold text-stone-700">{mood.name}</span>
            <span className="text-[10px] text-stone-400 text-center leading-tight">{mood.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}