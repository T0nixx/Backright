import styled from "styled-components";

export const DailyReportPageContainer = styled.div.withConfig({
  shouldForwardProp: (prop: string) => !["$hasSelectedSession"].includes(prop),
})<{ $hasSelectedSession: boolean }>`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(66%, 66%) minmax(34%, 34%);
  grid-template-rows: 20.5rem minmax(auto, 25rem);
  grid-template-areas: ${({ $hasSelectedSession }) =>
    $hasSelectedSession
      ? `
          "report calendar"
          "report sessions"
        `
      : `
          "warning calendar"
          "stats sessions"
        `};
  gap: 1.25rem;

  > :nth-child(1) {
    grid-area: ${({ $hasSelectedSession }) =>
      $hasSelectedSession ? "report" : "warning"};
  }

  > :nth-child(2) {
    grid-area: ${({ $hasSelectedSession }) =>
      $hasSelectedSession ? "calendar" : "stats"};
  }

  > :nth-child(3) {
    grid-area: ${({ $hasSelectedSession }) =>
      $hasSelectedSession ? "sessions" : "calendar"};
  }

  > :nth-child(4) {
    grid-area: sessions;
  }
`;
