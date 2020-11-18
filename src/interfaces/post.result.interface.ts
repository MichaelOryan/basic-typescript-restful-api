import HtmlStatusCode from './../util/htmlcodes';

interface Result {
  status: HtmlStatusCode;
  location: string;
  data: any;
}

export default Result;
