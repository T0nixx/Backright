import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styled from "styled-components";
import { convertSecondsToTimeString } from "../../../utils/timeFormatUtils";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutGraphProps {
  totalDuration: number;
  properPoseDuration: number;
}

const DoughnutGraphContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const DoughnutGraphWrapper = styled.div`
  position: relative;
  width: 12rem;
  height: 12rem;
`;

const CenterText = styled.div`
  color: var(--mint);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 700;
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

const Description = styled.p`
  color: var(--gray-300);

  span {
    color: var(--primary);
    font-weight: 700;
  }
`;

const DoughnutGraph = ({
  totalDuration,
  properPoseDuration,
}: DoughnutGraphProps) => {
  const percentage = Math.round((properPoseDuration / totalDuration) * 100);

  const data = {
    datasets: [
      {
        data: [properPoseDuration, totalDuration - properPoseDuration],
        backgroundColor: ["#76abae", "#c7c7c7"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <DoughnutGraphContainer>
      <DoughnutGraphWrapper>
        <Doughnut data={data} options={options} />
        <CenterText>{percentage}%</CenterText>
      </DoughnutGraphWrapper>

      <DescriptionContainer>
        <Description>
          {convertSecondsToTimeString(totalDuration)} 중
        </Description>
        <Description>
          <span>{convertSecondsToTimeString(properPoseDuration)}</span> 동안
          정자세를 유지했어요.
        </Description>
      </DescriptionContainer>
    </DoughnutGraphContainer>
  );
};

export default DoughnutGraph;
