import Summary from './summary.interface';
import ReportStatusCode from './status-codes.enum';

interface SummaryTable {
  [id: string]: { summery: Summary, status: ReportStatusCode };
}

export default SummaryTable;
