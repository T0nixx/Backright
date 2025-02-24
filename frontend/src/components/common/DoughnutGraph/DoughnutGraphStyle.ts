import styled from "styled-components";

export const DoughnutGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100%;
`;

export const DoughnutGraph = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 85%;
  aspect-ratio: 1;
`;

export const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  font-size: 1.25rem;
  font-weight: 700;
  color: var(--mint);
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
