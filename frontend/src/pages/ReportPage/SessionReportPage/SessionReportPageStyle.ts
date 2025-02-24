import styled from "styled-components";

export const SessionReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  background-color: var(--white);
  border-radius: 12px;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0;
`;

export const TitleWrapper = styled.div`
  flex: 1;
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--gray-300);
  cursor: pointer;
`;

export const TimeInfoCard = styled.div`
  padding: 2rem 1.5rem;
  background-color: var(--white);
  border-radius: 12px;
  border: 1px solid var(--gray-100);
`;

export const TimeInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
`;

export const TimeInfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const TimeLabel = styled.span`
  color: var(--gray-300);
  font-size: 0.875rem;
`;

export const TimeValue = styled.span`
  font-weight: 700;
  font-size: 1rem;
`;

export const GraphContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
`;
export const GraphItem = styled.div`
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 12px;
  border: 1px solid var(--gray-100);
  display: flex;
  flex-direction: column;

  > * {
    flex: 0 1 auto;
  }
`;

export const SemiTitle = styled.div`
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.25rem;
`;

export const BodyPartList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const BodyPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--gray-100);
  border-radius: 12px;
`;

export const BodyPartImage = styled.img`
  width: 3.5rem;
  height: 3.5rem;
`;

export const BodyPartAlertCount = styled.div<{ $count: number }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${(props) => {
    if (props.$count >= 25) return "var(--red)";
    if (props.$count >= 15) return "#FF893A";
    return "var(--gray-300)";
  }};
`;

export const AlertHistoryCard = styled.div`
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 12px;
  border: 1px solid var(--gray-100);
`;

export const DetectionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--gray-100);

  &:last-child {
    border-bottom: none;
  }
`;

export const DetectionTime = styled.span`
  min-width: 5rem;
  font-size: 0.875rem;
  color: var(--gray-300);
`;

export const DetectionParts = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;

  span {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    background-color: var(--gray-100);
    font-size: 0.875rem;
  }
`;

export const VideoButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "$isActive",
})<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--mint);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  margin-left: auto;

  &:hover {
    background-color: var(--primary-dark);
  }
`;
export const VideoLoadingText = styled.span`
  margin-left: auto;
  color: var(--gray-300);
  font-size: 0.875rem;
`;

export const VideoErrorText = styled.span`
  margin-left: auto;
  color: var(--red);
  font-size: 0.875rem;
`;

export const VideoUnavailableText = styled.span`
  margin-left: auto;
  color: var(--gray-300);
  font-size: 0.875rem;
`;

export const VideoModalWrapper = styled.div`
  // VideoModal을 감싸는 컨테이너
  > div {
    // VideoModalContainer를 타겟팅
    position: fixed; // absolute 대신 fixed 사용
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); // 중앙 정렬
    width: 90%; // 더 작은 너비
    max-width: 600px; // 최대 너비 제한
    aspect-ratio: 1.8;
    z-index: 100; // 더 높은 z-index
  }
`;

export const VideoContainer = styled.div`
  width: 100%;
  max-width: 280px; // 400px에서 280px로 축소
  margin: 0.75rem auto; // 1rem에서 0.75rem으로 축소

  video {
    width: 100%;
    border-radius: 12px; // 8px에서 12px로 변경 (다른 컴포넌트들과 일관성)
  }
`;
export const VideoLink = styled.a.withConfig({
  shouldForwardProp: (prop) => prop !== "$isActive",
})<{ $isActive?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: var(--primary);
  color: var(--white);
  font-size: 0.875rem;
  cursor: pointer;
  border: none;
  margin-left: auto;
  text-decoration: none;

  &:hover {
    background-color: var(--primary-dark);
  }
`;
