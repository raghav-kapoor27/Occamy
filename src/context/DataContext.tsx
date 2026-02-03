import { createContext, useContext, useState, ReactNode } from 'react';
import { Meeting, SampleDistribution, Sale, DailyLog } from '../types';
import { mockMeetings, mockSamples, mockSales, mockDailyLogs } from '../data/mockData';

interface DataContextType {
  meetings: Meeting[];
  samples: SampleDistribution[];
  sales: Sale[];
  dailyLogs: DailyLog[];
  addMeeting: (meeting: Meeting) => void;
  addSample: (sample: SampleDistribution) => void;
  addSale: (sale: Sale) => void;
  startDay: (log: DailyLog) => void;
  endDay: (logId: string, endData: Partial<DailyLog>) => void;
  currentDayLog: DailyLog | null;
  setCurrentDayLog: (log: DailyLog | null) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [samples, setSamples] = useState<SampleDistribution[]>(mockSamples);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(mockDailyLogs);
  const [currentDayLog, setCurrentDayLog] = useState<DailyLog | null>(null);

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  };

  const addSample = (sample: SampleDistribution) => {
    setSamples(prev => [sample, ...prev]);
  };

  const addSale = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
  };

  const startDay = (log: DailyLog) => {
    setDailyLogs(prev => [log, ...prev]);
    setCurrentDayLog(log);
  };

  const endDay = (logId: string, endData: Partial<DailyLog>) => {
    setDailyLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, ...endData } : log
    ));
    setCurrentDayLog(null);
  };

  return (
    <DataContext.Provider value={{
      meetings,
      samples,
      sales,
      dailyLogs,
      addMeeting,
      addSample,
      addSale,
      startDay,
      endDay,
      currentDayLog,
      setCurrentDayLog,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
