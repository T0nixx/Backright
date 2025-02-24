import styled from "styled-components";

export const SessionLogContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !["$isSelected"].includes(prop),
})<{ $isSelected: boolean }>`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 0 0.75rem 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${({ $isSelected }) =>
    $isSelected ? "rgba(118, 171, 174, 0.8)" : "transparent"};

  &:hover {
    background-color: rgba(118, 171, 174, 0.8);
  }

  span {
    color: ${({ $isSelected }) => ($isSelected ? "var(--white)" : "inherit")};
  }

  &:hover span {
    color: var(--white);
  }
`;

export const TimeCircle = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 999px;
  background-color: var(--gray-300);
`;

export const SessionDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SessionTime = styled.span`
  font-size: 0.875rem;
  color: var(--gray-300);
`;

export const AlertCount = styled.span`
  font-size: 0.875rem;
`;
