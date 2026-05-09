import './MaterialCard.css';

function IconFabric() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4C2 4 4 6 8 6C12 6 14 4 14 4M2 8C2 8 4 10 8 10C12 10 14 8 14 8M2 12C2 12 4 14 8 14C12 14 14 12 14 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function IconWeight() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13L4.5 6H11.5L13 13H3Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function IconSupplier() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5L8 2L14 5V11L8 14L2 11V5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>;
}
function IconMore() {
  return <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="5" r="1.2" fill="currentColor"/><circle cx="10" cy="10" r="1.2" fill="currentColor"/><circle cx="10" cy="15" r="1.2" fill="currentColor"/></svg>;
}
function IconDeactivated() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#d83636" strokeWidth="1.2"/><path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#d83636" strokeWidth="1.2" strokeLinecap="round"/></svg>;
}
function IconActive() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#22c55e" strokeWidth="1.2"/><path d="M5.5 8L7.5 10L10.5 6" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export default function MaterialCard({ material }) {
  const {
    name,
    shortName,
    composition,
    subcategory,
    weight,
    manufacture,
    brand,
    status = 'ACTIVE',
    materialNumber,
    previewColor,
  } = material;

  const isDeactivated = status === 'DEACTIVATED';

  return (
    <div className="mat-card">
      <div className="mat-card__preview" style={{ background: previewColor || '#d4d4d0' }}>
        <div className="mat-card__brand-logo">
          <span className="mat-card__brand-text">{brand || ''}</span>
        </div>
      </div>

      <div className="mat-card__actions">
        <div className={`mat-card__status mat-card__status--${status.toLowerCase()}`}>
          {isDeactivated ? <IconDeactivated /> : <IconActive />}
          <span>{isDeactivated ? 'Deactivated' : 'Active'}</span>
        </div>
        <button className="mat-card__more">
          <IconMore />
        </button>
      </div>

      <div className="mat-card__info">
        <div className="mat-card__top">
          {materialNumber && <span className="mat-card__number">№ {materialNumber}</span>}
          <h3 className="mat-card__name">{shortName || name}</h3>
          <p className="mat-card__composition">{composition}</p>
        </div>

        <div className="mat-card__props">
          <div className="mat-card__prop">
            <IconFabric />
            <span>{subcategory || 'Woven'}</span>
          </div>
          <div className="mat-card__prop">
            <IconWeight />
            <span>{weight || '—'}</span>
          </div>
          <div className="mat-card__prop">
            <IconSupplier />
            <span>{manufacture || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
