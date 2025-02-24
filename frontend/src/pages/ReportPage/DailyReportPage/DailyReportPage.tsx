import { useEffect, useState } from "react";

import PostureWarningSummary from "../../../components/common/PostureWarningSummary/PostureWarningSummary";
import DailyCalendar from "../../../components/common/Calendar/DailyCalendar";
import DailyStatistic from "../../../components/DailyStatistic/DailyStatistic";
import SessionLogList from "../../../components/SessionLogList/SessionLogList";
import SessionReport from "../SessionReportPage/SessionReportPage";

import { DailyReportType, SessionType } from "../../../types/reportType";
import { getDailyReport } from "../../../apis/api";
import { convertDateToString } from "../../../utils/timeFormatUtils";

import * as S from "./DailyReportPageStyle";

const DailyReportPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyReport, setDailyReport] = useState<DailyReportType | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(
    null
  );

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSession(null);
  };

  const handleSessionSelect = (session: SessionType) => {
    setSelectedSession(session);
  };

  const requestDailyReport = async (date: Date) => {
    const formattedDate = convertDateToString(date);
    const reportData = await getDailyReport(formattedDate);
    setDailyReport(reportData);
  };

  useEffect(() => {
    requestDailyReport(selectedDate);
  }, [selectedDate]);

  return (
    <S.DailyReportPageContainer $hasSelectedSession={!!selectedSession}>
      {selectedSession ? (
        <SessionReport
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      ) : (
        <>
          <PostureWarningSummary
            detectionCountStat={dailyReport?.dailyStat.detectionCountStat}
          />
          <DailyStatistic dailyReport={dailyReport} />
        </>
      )}
      <DailyCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateSelect}
      />
      <SessionLogList
        sessions={dailyReport?.sessions}
        selectedSession={selectedSession}
        onSessionSelect={handleSessionSelect}
      />
    </S.DailyReportPageContainer>
  );
};

export default DailyReportPage;
