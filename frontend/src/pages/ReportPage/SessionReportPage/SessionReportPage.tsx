import { useEffect, useState } from "react";
import { SessionType } from "../../../types/reportType";
import useSelectedPostureAlertStore from "../../../store/useSelectedPostureAlertStore";
import BODY_PARTS from "../../../constants/bodyParts";
import DoughnutGraph from "../../../components/common/DoughnutGraph/DoughnutGraph";
import VideoModal from "../../../components/VideoModal/VideoModal";
import * as S from "./SessionReportPageStyle";

interface SessionReportPageProps {
  session: SessionType;
  onClose: () => void;
}

interface DetectionWithVideo {
  id: number;
  startedAt: string;
  videoUrl: string;
  neckDetected: boolean;
  leftShoulderDetected: boolean;
  rightShoulderDetected: boolean;
  backDetected: boolean;
  isLoading: boolean;
  error: string | null;
}

const SessionReportPage = ({ session, onClose }: SessionReportPageProps) => {
  const [detectionVideos, setDetectionVideos] = useState<DetectionWithVideo[]>(
    []
  );
  const { setSelectedDetectionId } = useSelectedPostureAlertStore();

  useEffect(() => {
    const initialDetections = session.detections.map((detection) => ({
      ...detection,
      isLoading: false,
      error: null,
    }));

    setDetectionVideos(initialDetections);
  }, [session]);

  return (
    <S.SessionReportContainer>
      <S.Header>
        <S.Title>세션 보고서</S.Title>
        <S.CloseButton onClick={onClose}>×</S.CloseButton>
      </S.Header>

      <S.TimeInfoCard>
        <S.TimeInfoGrid>
          <S.TimeInfoItem>
            <S.TimeLabel>측정 시작 시간</S.TimeLabel>
            <S.TimeValue>
              {new Date(session.startedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </S.TimeValue>
          </S.TimeInfoItem>
          <S.TimeInfoItem>
            <S.TimeLabel>측정 유지 시간</S.TimeLabel>
            <S.TimeValue>{session.sessionStat.sessionDuration}분</S.TimeValue>
          </S.TimeInfoItem>
          <S.TimeInfoItem>
            <S.TimeLabel>측정 종료 시간</S.TimeLabel>
            <S.TimeValue>
              {new Date(session.endedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </S.TimeValue>
          </S.TimeInfoItem>
        </S.TimeInfoGrid>
      </S.TimeInfoCard>

      <S.GraphContainer>
        <S.GraphItem>
          <S.SemiTitle>부위 별 자세 경고 횟수</S.SemiTitle>
          <S.BodyPartList>
            {BODY_PARTS.map(({ key, label, image }) => (
              <S.BodyPart key={key}>
                <S.BodyPartImage src={image} alt={label} />
                <S.BodyPartAlertCount
                  $count={session.detectionStat.counts[key]}
                >
                  {session.detectionStat.counts[key] ?? 0}
                </S.BodyPartAlertCount>
              </S.BodyPart>
            ))}
          </S.BodyPartList>
        </S.GraphItem>
        <S.GraphItem>
          <S.SemiTitle>자세 분석</S.SemiTitle>
          <DoughnutGraph
            totalDuration={session.sessionStat.sessionDuration}
            properPoseDuration={session.sessionStat.properPoseDuration}
          />
        </S.GraphItem>
      </S.GraphContainer>

      <S.AlertHistoryCard>
        <S.SemiTitle>자세 경고 내역</S.SemiTitle>
        {detectionVideos.map((detection) => (
          <S.DetectionItem key={detection.id}>
            <S.DetectionTime>
              {new Date(detection.startedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </S.DetectionTime>
            <S.DetectionParts>
              {detection.neckDetected && <span>목</span>}
              {detection.leftShoulderDetected && <span>왼쪽 어깨</span>}
              {detection.rightShoulderDetected && <span>오른쪽 어깨</span>}
              {detection.backDetected && <span>등</span>}
            </S.DetectionParts>
            <S.VideoButton onClick={() => setSelectedDetectionId(detection.id)}>
              영상 보기
            </S.VideoButton>
          </S.DetectionItem>
        ))}
      </S.AlertHistoryCard>

      <S.VideoModalWrapper>
        <VideoModal />
      </S.VideoModalWrapper>
    </S.SessionReportContainer>
  );
};
export default SessionReportPage;
