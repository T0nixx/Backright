import styled from "styled-components";

export const ReportLayoutContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 4rem);
  margin-left: 4rem;
  padding: 2.5rem;
  background-color: var(--navy-100);
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 75rem;
`;

export const ReportContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: 50rem;
  padding: 2.5rem;
  border-radius: 12px;
  background-color: var(--cream);
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
