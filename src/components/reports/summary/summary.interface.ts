// TODO: Further investigate what these values need to be for types

import ReportStatusCode from './status-codes.enum';

interface Summary {
  averagePageViewsPerDay: {[type:string]: number} ;
  userSessionRatio: number;
  weeklyMaximumSessions: number;
  status?: ReportStatusCode;
}

export default Summary;
