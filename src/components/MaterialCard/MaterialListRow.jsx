import { useState } from 'react';
import { Icon } from '../ui/Icon';
import './MaterialListRow.css';

function StatusLabel({ state }) {
  if (state === 'Deactivated') {
    return (
      <div className="mat-row__status mat-row__status--deactivated">
        <Icon name="cancel" size={14} />
        <span>Deactivated</span>
      </div>
    );
  }
  if (state === 'Inactive') {
    return (
      <div className="mat-row__status mat-row__status--inactive">
        <Icon name="do_not_disturb_on" size={14} />
        <span>Not Active</span>
      </div>
    );
  }
  return (
    <div className="mat-row__status mat-row__status--active">
      <Icon name="check_circle" size={14} fill={1} />
      <span>Active</span>
    </div>
  );
}

export default function MaterialListRow({ material }) {
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
    <div className="mat-row">
      {/* Material column — 400px fixed */}
      <div className="mat-row__material">
        <div className="mat-row__thumb" style={{ background: (imageUrl && !imgFailed) ? (previewColor || '#eeebe6') : 'transparent' }}>
          {imageUrl && !imgFailed ? (
            <img src={imageUrl} alt={name} onError={() => setImgFailed(true)} />
          ) : (
            <img src="/placeholder.png" alt="" className="mat-row__thumb-placeholder" />
          )}
        </div>
        <div className="mat-row__text">
          <StatusLabel state={material_state} />
          <div className="mat-row__nameline">
            <span className="mat-row__name">{shortName || name}</span>
            {materialNumber && (
              <>
                <span className="mat-row__sep"> | </span>
                <span className="mat-row__number">№ {materialNumber}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Data columns */}
      <div className="mat-row__cell">{brand || '—'}</div>
      <div className="mat-row__cell">{composition || '—'}</div>
      <div className="mat-row__cell">{subcategory || '—'}</div>
      <div className="mat-row__cell">{weight || '—'}</div>
      <div className="mat-row__cell">{manufacture || '—'}</div>
    </div>
  );
}
