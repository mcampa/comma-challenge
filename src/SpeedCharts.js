import React, { useState, useContext, useEffect } from 'react';
import classnames from 'classnames';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AppContext } from './context';
import { getDistanceFromLatLonInKm } from './helpers';
import './SpeedCharts.css';

export default function SpeedCharts() {
  const [open, setOpen] = useState(true);
  const { data } = useContext(AppContext);
  const [chartData, setChartData] = useState(null);

  useEffect(
    () => {
      const cd = [];
      setChartData(null);

      for (let index = 1; index < data.length; index++) {
        const start = data[index - 1];
        const end = data[index];
        const speed = getDistanceFromLatLonInKm(start, end) * 60 * 60;

        cd.push({ speed, seconds: index });
      }

      setTimeout(() => setChartData(cd), 100);
    },
    [data],
  );

  return (
    <div className={classnames('SpeedCharts', open && 'open')}>
      <div className="SpeedCharts-window">
        <div className="SpeedCharts-windowBar" onClick={() => setOpen(!open)}>
          <svg
            className="SpeedCharts-windowBarButton"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 20 24"
          >
            <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
          </svg>
        </div>
        <div className="SpeedCharts-chart">
          {chartData && (
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <XAxis dataKey="seconds" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={v => v.toFixed(2) + 'KPH'} labelFormatter={s => ''} />
                <Area type="monotone" dataKey="speed" stroke="#82ca9d" strokeWidth={2} fill="#EEE" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
