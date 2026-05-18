import { useState } from 'react';
import { Icon } from '../ui/Icon';
import './MaterialCard.css';

function StatusBadge({ state }) {
  if (state === 'Deactivated') {
    return (
      <div className="mat-status mat-status--deactivated">
        <Icon name="cancel" size={13} />
        <span>Deactivated</span>
      </div>
    );
  }
  if (state === 'Inactive') {
    return (
      <div className="mat-status mat-status--inactive">
        <Icon name="remove_circle" size={13} />
        <span>Not Active</span>
      </div>
    );
  }
  return (
    <div className="mat-status mat-status--active">
      <Icon name="check_circle" size={13} fill={1} />
      <span>Active</span>
    </div>
  );
}

export default function MaterialCard({ material }) {
  const {
    name,
    short_name: shortName,
    composition,
    subcategory,
    weight,
    manufacture_detail: manufacture,
    brand,
    material_state,
    material_number: materialNumber,
    preview_color: previewColor,
    image_url: imageUrl,
  } = material;

  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="mat-card">
      <div className="mat-card__preview" style={{ background: (imageUrl && !imgFailed) ? (previewColor || '#d4d4d0') : 'transparent' }}>
        {imageUrl && !imgFailed ? (
          <img
            src={imageUrl}
            alt={name}
            className="mat-card__preview-img"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <img
            src="/placeholder.png"
            alt=""
            className="mat-card__preview-img mat-card__preview-img--placeholder"
          />
        )}
        <div
          className="mat-card__preview-overlay"
          style={{ background: previewColor ? `${previewColor}44` : 'transparent' }}
        />
        {brand && (
          <span className="mat-card__brand-watermark">{brand}</span>
        )}
      </div>

      <div className="mat-card__actions">
        <StatusBadge state={material_state} />
        <button className="mat-card__more">
          <Icon name="more_horiz" size={18} />
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
            <Icon name="texture" size={14} />
            <span>{subcategory || '—'}</span>
          </div>
          <div className="mat-card__prop">
            <Icon name="weight" size={14} />
            <span>{weight || '—'}</span>
          </div>
          <div className="mat-card__prop">
            <Icon name="factory" size={14} />
            <span>{manufacture || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
