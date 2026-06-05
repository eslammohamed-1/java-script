export default function MobileNav({ view, views, onNavigate }) {
  const items = [
    { id: views.DASHBOARD, icon: '📊', label: 'لوحتي' },
    { id: views.LESSONS, icon: '📚', label: 'الدروس' },
    { id: views.SEARCH, icon: '🔍', label: 'بحث' },
    { id: views.CHEATSHEET, icon: '📖', label: 'مرجع' },
  ];

  return (
    <nav className="mobile-nav" aria-label="التنقل الرئيسي">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`mobile-nav__btn ${view === item.id ? 'mobile-nav__btn--active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="mobile-nav__btn-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
