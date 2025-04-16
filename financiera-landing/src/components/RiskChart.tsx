'use client';

import styled from 'styled-components';
import { RiskLevel } from '@/types';

const ChartContainer = styled.div`
  background-color: #f7fafc;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const RiskBarContainer = styled.div`
  height: 1.5rem;
  background-color: #e2e8f0;
  border-radius: 9999px;
  position: relative;
  overflow: hidden;
  margin: 1.5rem 0;
`;

const RiskBar = styled.div<{ width: number; color: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.color};
  border-radius: 9999px;
`;

const RiskLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const RiskLabel = styled.div<{ active: boolean }>`
  font-size: 0.875rem;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#2d3748' : '#718096'};
`;

const RiskInfo = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
`;

const RiskDescription = styled.p`
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0;
`;

interface RiskChartProps {
  riskLevel: RiskLevel;
}

const RiskChart = ({ riskLevel }: RiskChartProps) => {
  const riskValues = {
    low: { 
      width: 33, 
      color: '#48bb78', 
      description: 'Producto con riesgo bajo, diseñado para inversores conservadores que priorizan la preservación del capital.' 
    },
    medium: { 
      width: 66, 
      color: '#ed8936', 
      description: 'Producto con riesgo moderado, adecuado para inversores que buscan un equilibrio entre seguridad y rendimiento.' 
    },
    high: { 
      width: 100, 
      color: '#e53e3e', 
      description: 'Producto con riesgo elevado, orientado a inversores que buscan maximizar el rendimiento a largo plazo y pueden tolerar la volatilidad.' 
    }
  };
  
  return (
    <ChartContainer>
      <RiskLabels>
        <RiskLabel active={riskLevel === 'low'}>Bajo</RiskLabel>
        <RiskLabel active={riskLevel === 'medium'}>Medio</RiskLabel>
        <RiskLabel active={riskLevel === 'high'}>Alto</RiskLabel>
      </RiskLabels>
      
      <RiskBarContainer>
        <RiskBar 
          width={riskValues[riskLevel].width}
          color={riskValues[riskLevel].color}
        />
      </RiskBarContainer>
      
      <RiskInfo>
        <RiskDescription>{riskValues[riskLevel].description}</RiskDescription>
      </RiskInfo>
    </ChartContainer>
  );
};

export default RiskChart; 