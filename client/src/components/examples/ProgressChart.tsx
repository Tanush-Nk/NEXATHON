import { ProgressChart } from "../ProgressChart";

const weeklyData = [
  { name: 'Mon', value: 120, accuracy: 85 },
  { name: 'Tue', value: 150, accuracy: 78 },
  { name: 'Wed', value: 180, accuracy: 92 },
  { name: 'Thu', value: 140, accuracy: 88 },
  { name: 'Fri', value: 200, accuracy: 95 },
  { name: 'Sat', value: 170, accuracy: 90 },
  { name: 'Sun', value: 220, accuracy: 87 },
];

const topicData = [
  { name: 'Math', value: 450 },
  { name: 'Science', value: 380 },
  { name: 'History', value: 220 },
  { name: 'English', value: 310 },
];

export default function ProgressChartExample() {
  return (
    <div className="p-8 space-y-8">
      <ProgressChart 
        title="Weekly Progress" 
        data={weeklyData} 
        type="line"
        showAccuracy={true}
      />
      <ProgressChart 
        title="XP by Topic" 
        data={topicData} 
        type="bar"
      />
    </div>
  );
}
