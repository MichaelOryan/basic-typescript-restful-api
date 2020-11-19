// TODO: Further investigate what these values need to be for types

import ReportStatusCode from './summary-report-status-codes';

interface Summary {
  averagePageViewsPerDay: number;
  userSessionRatio: number;
  weeklyMaximumSessions: number;
  status?: ReportStatusCode;
}

export default Summary;
