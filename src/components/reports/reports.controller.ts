import { Request, Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import SummeryModel from './summary/summary.model';

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
      .then((id) => response.status(200).json({ id: id }))
      .catch((err) => {
        response.status(500).json(err);
      });
  };

  private getCSVSummaryById = async (request: Request, response: Response) => {
    const id = request.params.id;
    this.summeryModel
      .summary(id)
      .then((summary) => response.status(200).json(summary))
      .catch((err) => {
        response.status(404).send(err);
      });
  };
}

export default ReportController;
