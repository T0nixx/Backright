import { convertISOToTimeRangeString } from "../../utils/timeFormatUtils";

import { SessionType } from "../../types/reportType";

import * as S from "./SessionLogStyle";

interface SessionLogProps {
  session: SessionType;
}

const SessionLog = ({ session }: SessionLogProps) => (
  <S.SessionLogContainer>
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
