import styled from "styled-components";

export const ComparisonBarChartContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

export const BarGraph = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 90%;
  height: 75%;
`;

export const DescriptionContainer = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const Description = styled.p`
  color: var(--gray-300);

  span {
    color: var(--primary);
    font-weight: 700;
  }
`;
