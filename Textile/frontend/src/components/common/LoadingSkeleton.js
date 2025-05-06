import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que muestra un esqueleto animado mientras se cargan los datos
 * @param {Object} props
 * @param {string} props.type - Tipo de esqueleto (table, card, list, custom)
 * @param {number} props.rows - Número de filas para table o list
 * @param {number} props.columns - Número de columnas para table
 * @param {number} props.cards - Número de tarjetas para tipo card
 * @param {boolean} props.withImage - Si incluye un placeholder para imagen en cards
 * @param {string} props.height - Altura del esqueleto (css valid value)
 * @param {string} props.width - Ancho del esqueleto (css valid value)
 */
const LoadingSkeleton = ({
  type = 'custom',
  rows = 5,
  columns = 4,
  cards = 3,
  withImage = false,
  height,
  width,
}) => {
  
  // Estilo base de los elementos skeleton
  const skeletonStyle = {
    background: '#f0f0f0',
    backgroundImage: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'loading 1.5s infinite',
    borderRadius: '4px',
    height: height || null,
    width: width || null,
  };

  // Componente esqueleto simple para reutilizar
  const Skeleton = ({ style }) => (
    <div className="skeleton" style={{ ...skeletonStyle, ...style }}></div>
  );

  // Render basado en el tipo
  const renderSkeleton = () => {
    switch (type) {
      case 'table':
        return (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  {[...Array(columns)].map((_, i) => (
                    <th key={i} style={{ width: `${100 / columns}%` }}>
                      <Skeleton style={{ height: '20px', width: '70%' }} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(rows)].map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...Array(columns)].map((_, colIndex) => (
                      <td key={colIndex}>
                        <Skeleton style={{ height: '16px', width: colIndex === 0 ? '40%' : '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'card':
        return (
          <div className="row g-4">
            {[...Array(cards)].map((_, i) => (
              <div className="col-md-4" key={i}>
                <div className="card">
                  {withImage && (
                    <Skeleton style={{ height: '180px', borderRadius: '4px 4px 0 0' }} />
                  )}
                  <div className="card-body">
                    <Skeleton style={{ height: '24px', width: '70%', marginBottom: '15px' }} />
                    <Skeleton style={{ height: '16px', width: '90%', marginBottom: '8px' }} />
                    <Skeleton style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
                    <Skeleton style={{ height: '16px', width: '60%' }} />
                    <div className="mt-3">
                      <Skeleton style={{ height: '36px', width: '120px' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="list-group">
            {[...Array(rows)].map((_, i) => (
              <div className="list-group-item" key={i}>
                <div className="d-flex w-100 justify-content-between">
                  <Skeleton style={{ height: '20px', width: '40%' }} />
                  <Skeleton style={{ height: '20px', width: '15%' }} />
                </div>
                <Skeleton style={{ height: '16px', width: '70%', marginTop: '10px' }} />
                <Skeleton style={{ height: '16px', width: '50%', marginTop: '6px' }} />
              </div>
            ))}
          </div>
        );

      case 'custom':
      default:
        return <Skeleton style={{ height: height || '100px', width: width || '100%' }} />;
    }
  };

  return (
    <div className="loading-skeleton-container">
      <style>
        {`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
      {renderSkeleton()}
    </div>
  );
};

LoadingSkeleton.propTypes = {
  type: PropTypes.oneOf(['table', 'card', 'list', 'custom']),
  rows: PropTypes.number,
  columns: PropTypes.number,
  cards: PropTypes.number,
  withImage: PropTypes.bool,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default LoadingSkeleton; 