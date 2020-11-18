import { Request, Response, NextFunction, Router } from 'express';
import Controller from '../../interfaces/controller.interface';

class ReportController implements Controller {
  public path = '/sessions/reports';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.uploadCSVFile);
    this.router.get(`${this.path}/:id`, this.getCSVSummaryById);

  }

  private uploadCSVFile = async (request: Request, response: Response) => {
    response.status(200).json({ id: 'some id' });
  }

  private getCSVSummaryById = async (request: Request, response: Response) => {
    response.status(200).json({});
  }

}

export default ReportController;