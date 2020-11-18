import { Request, Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import SummeryModel from './summary/summary.model';
import Result from './../../interfaces/post.result.interface';
import HtmlStatusCode from './../../util/htmlcodes';

class ReportController implements Controller {
  public path = '/sessions/reports';
  public router = Router();

  private summeryModel: SummeryModel = new SummeryModel();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.uploadCSVFile);
    this.router.get(`${this.path}/:id`, this.getCSVSummaryById);
  }

  private uploadCSVFile = async (request: Request, response: Response) => {
    this.summeryModel
      .addCsv(request.body.file)
      .then((result:Result) => {
        const {location, status, data} = result;
        if([HtmlStatusCode.ACCEPTED, HtmlStatusCode.CREATED].includes(status))
          response.status(status).set({'Location': location}).json(data);
        else
          throw new Error('CSV Resource was not accepted');
      })
      .catch((err) => {
        response.status(500).json(err);
      });
  };

  private getCSVSummaryById = async (request: Request, response: Response) => {
    const id = request.params.id;
    // TODO: will need other status for files being processed
    // 503, 404
    // need another one if the resource failed and will never be available
    // 500? 410? 403? 404?
    // Similar logic to the post? Return a typed object depending on the status of the sunmary
    this.summeryModel
      .summary(id)
      .then((summary) => response.status(200).json(summary))
      .catch((err) => {
        response.status(404).send(err);
      });
  };
}

export default ReportController;
