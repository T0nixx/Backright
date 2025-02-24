import styled from "styled-components";

export const ComparisonBarChartContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  height: 100%;
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

export const Description = styled.span`
  font-size: 0.875rem;

  span {
    font-weight: 700;
  }
`;
