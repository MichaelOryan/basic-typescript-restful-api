import { Request, Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import SummeryModel from './summary/summary.model';
import Result from './../../interfaces/post.result.interface';
import HtmlStatusCode from './../../util/htmlcodes';
import ReportStatusCode from './summary/summary-report-status-codes';

class ReportController implements Controller {
  public path = '/sessions/reports';
  public router = Router();

  private summeryModel: SummeryModel = new SummeryModel();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    
    // Paths
    const basePath = () => this.path;
    const reportByIdPath = () => basePath() + '/:id';
    const reportStatusPath = () => reportByIdPath() + '/status';
    const averageDailyPageViewsPath = () => reportByIdPath() + '/average-daily-pageviews';
    const userToSessionRatioPath = () => reportByIdPath() + '/user-to-session-ratio';
    const weeklyMaximumSessionsPath = () => reportByIdPath() + '/weekly-maximum-sessions';

    this.router.post(basePath(), this.uploadCSVFile);
    this.router.get(reportByIdPath(), this.getCSVSummaryById);
    this.router.get(reportStatusPath(), this.reportStatus);
    this.router.get(averageDailyPageViewsPath(), this.averageDailyPageViews);
    this.router.get(userToSessionRatioPath(), this.userToSessionRatio);
    this.router.get(weeklyMaximumSessionsPath(), this.weeklyMaximumSessions);
  }

  public static reportStatusToHtmlStatusReply(reportStatus: ReportStatusCode):HtmlStatusCode {
    const map = {
      [ReportStatusCode.NOT_FOUND]: HtmlStatusCode.NOT_FOUND,
      [ReportStatusCode.GENERATION_FAILED]: HtmlStatusCode.INTERNAL_SERVER_ERROR,
      [ReportStatusCode.AVAILABLE]: HtmlStatusCode.OK,
      [ReportStatusCode.BUILDING]: HtmlStatusCode.SERVICE_UNAVAILABLE,
    };

    return map[reportStatus];
  }

  private reportStatus = async (request: Request, response: Response) => {
    const id = request.params.id;
    this.summeryModel.reportStatus(id)
      .then((reportStatus:ReportStatusCode) => {
        const status = ReportController.reportStatusToHtmlStatusReply(reportStatus);
        response.status(status).send();
      }).catch((err) => {
        response.status(500).json(err);
      });

  };

  private averageDailyPageViews = async (request: Request, response: Response) => {
    response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

  private userToSessionRatio = async (request: Request, response: Response) => {
    response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

  private weeklyMaximumSessions = async (request: Request, response: Response) => {
    response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

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

  // Marked for deletion
  // Use direct paths for specific queries
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
