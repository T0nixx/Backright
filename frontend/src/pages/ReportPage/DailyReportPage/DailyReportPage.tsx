import { useEffect, useState } from "react";

import PostureWarningSummary from "../../../components/common/PostureWarningSummary/PostureWarningSummary";
import DailyCalendar from "../../../components/common/Calendar/DailyCalendar";
import DailyStatistic from "../../../components/DailyStatistic/DailyStatistic";
import SessionLogList from "../../../components/SessionLogList/SessionLogList";

import { DailyReportType } from "../../../types/reportType";
import { getDailyReport } from "../../../apis/api";
import { convertDateToString } from "../../../utils/timeFormatUtils";

import * as S from "./DailyReportPageStyle";

const DailyReportPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyReport, setDailyReport] = useState<DailyReportType | null>(null);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
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
    <S.DailyReportPageContainer>
      <PostureWarningSummary
        detectionCountStat={dailyReport?.dailyStat.detectionCountStat}
      />
      <DailyCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateSelect}
      />
      <DailyStatistic dailyReport={dailyReport} />
      <SessionLogList sessions={dailyReport?.sessions} />
    </S.DailyReportPageContainer>
  );
};

export default DailyReportPage;
