import { SessionType } from "../../types/reportType";
import Loading from "../common/Loading/Loading";
import SessionLog from "../SessionLog/SessionLog";

import * as S from "./SessionLogListStyle";

interface SessionLogProps {
  sessions?: SessionType[];
}

const SessionLogList = ({ sessions }: SessionLogProps) => (
  <S.SessionLogListContainer>
    {sessions?.length ? (
      <>
        <S.Title>세션 로그</S.Title>

        <S.SessionListContainer>
          <S.TimeLine />

          <S.SessionList>
            {sessions.map((session) => (
              <SessionLog key={session.startedAt} session={session} />
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
