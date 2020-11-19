import ResultCode from './../components/reports/summary/status-codes.enum';

interface Result {
  status: ResultCode;
  location: string;
  data: any;
}

export default Result;
