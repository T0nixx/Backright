import { convertISOToTimeRangeString } from "../../utils/timeFormatUtils";
import { SessionType } from "../../types/reportType";
import * as S from "./SessionLogStyle";

interface SessionLogProps {
  session: SessionType;
  isSelected: boolean;
  onClick: () => void;
}

const SessionLog = ({ session, isSelected, onClick }: SessionLogProps) => (
  <S.SessionLogContainer $isSelected={isSelected} onClick={onClick}>
    <S.TimeCircle />
    <S.SessionDetail>
      <S.SessionTime>
        {convertISOToTimeRangeString(session.startedAt, session.endedAt)}
      </S.SessionTime>
      <S.AlertCount>경고 {session.detectionStat.totalDetection}회</S.AlertCount>
    </S.SessionDetail>
  </S.SessionLogContainer>
);

export default SessionLog;
