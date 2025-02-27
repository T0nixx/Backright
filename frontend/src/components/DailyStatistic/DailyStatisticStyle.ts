import styled from "styled-components";

export const DailyStatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2.5rem;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  background-color: var(--white);
`;

export const Title = styled.div`
  position: relative;
  font-weight: 700;
  text-align: center;
`;

export const GraphContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 2rem;
`;

export const Divider = styled.div`
  width: 2px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 4px,
    var(--gray-100) 4px,
    var(--gray-100) 8px
  );
`;

export const NoPreviousGraph = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 600;
`;
