import { SessionType } from "../../types/reportType";
import Loading from "../common/Loading/Loading";
import SessionLog from "../SessionLog/SessionLog";

import * as S from "./SessionLogListStyle";

interface SessionLogListProps {
  sessions?: SessionType[];
  selectedSession: SessionType | null;
  onSessionSelect: (session: SessionType) => void;
}

const SessionLogList = ({
  sessions,
  selectedSession,
  onSessionSelect,
}: SessionLogListProps) => (
  <S.SessionLogListContainer>
    {sessions?.length ? (
      <>
        <S.Title>세션 로그</S.Title>
        <S.SessionListContainer>
          <S.TimeLine />
          <S.SessionList>
            {sessions.map((session) => (
              <SessionLog
                key={session.startedAt}
                session={session}
                isSelected={selectedSession?.startedAt === session.startedAt}
                onClick={() => onSessionSelect(session)}
              />
            ))}
          </S.SessionList>
        </S.SessionListContainer>
      </>
    ) : (
      <Loading backgroundColor="white">NO DATA</Loading>
    )}
  </S.SessionLogListContainer>
);

export default SessionLogList;
