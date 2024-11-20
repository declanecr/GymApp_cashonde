import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart } from '@mui/x-charts';
import PropTypes from 'prop-types';
import React from 'react';

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)({
  '&:last-child': {
    paddingBottom: 16,
  },
});

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledChartCard = styled(StyledCard)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    '& .MuiLineChart-root': {
      height: 200, // Smaller height on mobile devices
    }
  }
}));

function SetsChart({ workouts, exercise }) {
  const prepareChartData = () => {
    const chartData = Object.values(workouts).map(sets => {
      const date = new Date(sets[0].date);
      const totalWeight = sets.reduce((sum, set) => {
        return sum + (set.weight * set.reps);
      }, 0);
      return { date, totalWeight };
    });
    
    // Sort by date
    return chartData.sort((a, b) => a.date - b.date);
  };

  return (
    <Root>
      <Title variant="h4">
        {exercise ? exercise.name : 'Loading...'} Progress Chart
      </Title>
      
      {Object.keys(workouts).length > 0 ? (
        <StyledChartCard>
          <StyledCardContent>
            <Typography variant="h6" gutterBottom>
              Total Weight Progress (Weight × Reps)
            </Typography>
            <LineChart
              height={300}
              series={[
                {
                  data: prepareChartData().map(item => item.totalWeight),
                  label: 'Total Weight (Weight × Reps)',
                  color: '#2196f3',
                  curve: 'linear',
                  showMark: true,
                }
              ]}
              xAxis={[{
                scaleType: 'time',
                data: prepareChartData().map(item => item.date),
                tickMinStep: 3600 * 1000 * 24, // 1 day
                valueFormatter: (date) => date.toLocaleDateString(),
              }]}
              margin={{ left: 50, right: 20, top: 20, bottom: 35 }}
              slotProps={{
                legend: {
                  direction: 'row',
                  position: { vertical: 'top', horizontal: 'middle' },
                  padding: 20,
                },
              }}
            />
          </StyledCardContent>
        </StyledChartCard>
      ) : (
        <Typography variant="body1">No workout data available</Typography>
      )}
    </Root>
  );
}

// Add PropTypes validation
SetsChart.propTypes = {
    workouts: PropTypes.objectOf(
      PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          weight: PropTypes.number.isRequired,
          reps: PropTypes.number.isRequired,
        })
      )
    ).isRequired,
    exercise: PropTypes.shape({
      name: PropTypes.string.isRequired,
      // add other exercise properties if needed
    }),
  };
  
  //Add default props if needed
SetsChart.defaultProps = {
    exercise: null
  };

export default SetsChart;
