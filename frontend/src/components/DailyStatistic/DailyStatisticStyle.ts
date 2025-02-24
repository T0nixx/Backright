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
  font-weight: 700;
  text-align: center;
`;

export const GraphContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2px 1fr;
  align-items: center;
  gap: 2rem;
  min-height: 300px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-weight: 600;
`;
