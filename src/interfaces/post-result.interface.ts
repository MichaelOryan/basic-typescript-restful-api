import HtmlStatusCode from '../util/html-codes.enum';

interface Result {
  status: HtmlStatusCode;
  location: string;
  data: any;
}

export default Result;
