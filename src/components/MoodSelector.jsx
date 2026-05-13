const MOODS = [
  { name: 'Happy',     icon: '😊', desc: 'Light & cheerful',    color: 'hover:border-yellow-400 hover:bg-yellow-50 data-[active=true]:border-yellow-400 data-[active=true]:bg-yellow-50' },
  { name: 'Tired',     icon: '☕', desc: 'Quick & comforting',  color: 'hover:border-amber-400 hover:bg-amber-50 data-[active=true]:border-amber-400 data-[active=true]:bg-amber-50' },
  { name: 'Energetic', icon: '⚡', desc: 'Protein-packed',      color: 'hover:border-orange-400 hover:bg-orange-50 data-[active=true]:border-orange-400 data-[active=true]:bg-orange-50' },
  { name: 'Morning',   icon: '🌤️', desc: 'Breakfast & brunch',  color: 'hover:border-sky-400 hover:bg-sky-50 data-[active=true]:border-sky-400 data-[active=true]:bg-sky-50' },
  { name: 'Evening',   icon: '🌙', desc: 'Cozy dinner ideas',   color: 'hover:border-blue-400 hover:bg-blue-50 data-[active=true]:border-blue-400 data-[active=true]:bg-blue-50' },
]
export default function MoodSelector({ selectedMood, onMoodSelect }) {
  return (
    <section className="">
      <h2 className="">How are you feeling?</h2>
      <p className="">Pick a mood and we'll suggest the perfect recipes</p>
      <div className="">
        {MOODS.map(mood => (
          <button
            key={mood.name}
            data-active={selectedMood === mood.name}
            onClick={() => onMoodSelect(mood.name)}
            className={}
          >
            <span className="">{mood.icon}</span>
            <span className="">{mood.name}</span>
            <span className="">{mood.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}