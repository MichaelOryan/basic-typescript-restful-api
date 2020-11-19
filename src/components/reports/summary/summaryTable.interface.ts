import Summary from './summary.interface';
import ReportStatusCode from './summary-report-status-codes';

interface SummaryTable {
  [id: string]: { summery: Summary, status: ReportStatusCode };
}

export default SummaryTable;
