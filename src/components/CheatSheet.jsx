import { useState } from 'react';

const CHEATSHEET_DATA = [
  {
    category: 'Selection',
    title: 'تحديد العناصر',
    items: [
      { name: 'document.querySelector(sel)', desc: 'يحدد أول عنصر يطابق الـ selector.', code: 'const el = document.querySelector(".my-class");' },
      { name: 'document.querySelectorAll(sel)', desc: 'يحدد كل العناصر المطابقة كـ NodeList.', code: 'const els = document.querySelectorAll("p");' },
      { name: 'document.getElementById(id)', desc: 'يحدد عنصر عن طريق الـ ID الخاص به.', code: 'const el = document.getElementById("header");' },
    ]
  },
  {
    category: 'Manipulation',
    title: 'تعديل العناصر',
    items: [
      { name: 'element.textContent', desc: 'يقرأ أو يغير النص فقط داخل العنصر.', code: 'el.textContent = "مرحباً";' },
      { name: 'element.innerHTML', desc: 'يقرأ أو يغير محتوى HTML الداخلي.', code: 'el.innerHTML = "<strong>قوي</strong>";' },
      { name: 'element.classList.add(c)', desc: 'يضيف كلاس للعنصر.', code: 'el.classList.add("active");' },
      { name: 'element.classList.remove(c)', desc: 'يحذف كلاس من العنصر.', code: 'el.classList.remove("hidden");' },
      { name: 'element.classList.toggle(c)', desc: 'يبدل حالة الكلاس (يضيفه لو مش موجود ويحذفه لو موجود).', code: 'el.classList.toggle("dark");' },
      { name: 'element.setAttribute(n, v)', desc: 'يضيف أو يغير قيمة attribute.', code: 'el.setAttribute("src", "img.jpg");' },
    ]
  },
  {
    category: 'Events',
    title: 'الأحداث (Events)',
    items: [
      { name: 'element.addEventListener(e, fn)', desc: 'يستمع لحدث معين وينفذ دالة عند حدوثه.', code: 'el.addEventListener("click", () => console.log("Click!"));' },
      { name: 'event.preventDefault()', desc: 'يمنع السلوك الافتراضي للحدث (مثل تحديث الصفحة في الفورم).', code: 'e.preventDefault();' },
      { name: 'event.target', desc: 'يرجع العنصر الذي حدث عليه الحدث فعلياً.', code: 'console.log(e.target.value);' },
    ]
  }
];

export default function CheatSheet() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...CHEATSHEET_DATA.map(c => c.category)];

  const filteredData = CHEATSHEET_DATA.map(section => ({
    ...section,
    items: section.items.filter(item => 
      (filter === 'All' || filter === section.category) &&
      (item.name.toLowerCase().includes(query.toLowerCase()) || item.desc.includes(query))
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="cheatsheet animate-fade-in">
      <h1 className="cheatsheet__title">المرجع السريع (Cheat Sheet)</h1>
      <p className="cheatsheet__subtitle">دليلك السريع لأهم أوامر DOM و Events.</p>

      <input 
        type="text" 
        className="cheatsheet__search" 
        placeholder="ابحث عن أمر أو وظيفة..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="cheatsheet__filter-chips">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`cheatsheet__filter-chip ${filter === cat ? 'cheatsheet__filter-chip--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'All' ? 'الكل' : cat}
          </button>
        ))}
      </div>

      {filteredData.map(section => (
        <div key={section.category} className="cheatsheet__section">
          <h2 className="cheatsheet__section-title">{section.title}</h2>
          <div className="cheatsheet__grid">
            {section.items.map((item, i) => (
              <div key={i} className="cheatsheet__card">
                <div className="cheatsheet__card-name">{item.name}</div>
                <div className="cheatsheet__card-desc">{item.desc}</div>
                <div className="cheatsheet__card-code">{item.code}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {filteredData.length === 0 && (
        <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
          لا توجد نتائج مطابقة لبحثك.
        </div>
      )}
    </div>
  );
}
