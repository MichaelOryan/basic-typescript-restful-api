import { Request, Response, Router } from 'express';
import Controller from '../../interfaces/controller.interface';
import summaryModel from './summary/summary.model';
// import Result from '../../interfaces/post-result.interface';
import Result from '../../interfaces/summary-result.interface';
import HtmlStatusCode from '../../util/html-codes.enum';
import ReportStatusCode from './summary/status-codes.enum';
import Multer from 'multer';

class ReportController implements Controller {
  public path = '/sessions/reports';
  public router = Router();

  private summaryModel: summaryModel = new summaryModel();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const upload = Multer({ storage: Multer.memoryStorage() });
    // const upload = Multer({ dest: 'uploads/' });
    
    // Paths
    const basePath = () => this.path;
    const reportByIdPath = () => basePath() + '/:id';
    const reportStatusPath = () => reportByIdPath() + '/status';
    const averageDailyPageViewsPath = () => reportByIdPath() + '/average-daily-pageviews';
    const userToSessionRatioPath = () => reportByIdPath() + '/user-to-session-ratio';
    const weeklyMaximumSessionsPath = () => reportByIdPath() + '/weekly-maximum-sessions';

    this.router.post(basePath(), upload.single('file'), this.uploadCSVFile);
    this.router.get(reportByIdPath(), this.getCSVSummaryById);
    this.router.get(reportStatusPath(), this.reportStatus);
    this.router.get(averageDailyPageViewsPath(), this.averageDailyPageViews);
    this.router.get(userToSessionRatioPath(), this.userToSessionRatio);
    this.router.get(weeklyMaximumSessionsPath(), this.weeklyMaximumSessions);
  }

  public static reportStatusToHtmlStatusReply(reportStatus: ReportStatusCode, overrides: Map<ReportStatusCode, HtmlStatusCode> = new Map()):HtmlStatusCode {
    const map = {
      [ReportStatusCode.NOT_FOUND]: HtmlStatusCode.NOT_FOUND,
      [ReportStatusCode.GENERATION_FAILED]: HtmlStatusCode.INTERNAL_SERVER_ERROR,
      [ReportStatusCode.AVAILABLE]: HtmlStatusCode.OK,
      [ReportStatusCode.BUILDING]: HtmlStatusCode.SERVICE_UNAVAILABLE,
    };
    return overrides.get(reportStatus) || map[reportStatus];
  }

  private reportStatus = async (request: Request, response: Response) => {
    const id = request.params.id;
    this.summaryModel.reportStatus(id)
      .then((reportStatus:ReportStatusCode) => {
        const status = ReportController.reportStatusToHtmlStatusReply(reportStatus);
        response.status(status).send();
      }).catch((err) => {
        response.status(500).json(err);
      });

  };

  private averageDailyPageViews = async (request: Request, response: Response) => {
    const id = request.params.id;
    this.summaryModel.averageDailyPageViews(id)
      .then((result:Result) => {
        const {status, data} = result;
        const htmlStatusCode = ReportController.reportStatusToHtmlStatusReply(status);
        if(status === ReportStatusCode.AVAILABLE)
          response.status(HtmlStatusCode.OK).json(data);
        else
          response.status(htmlStatusCode).send();
      })

      .catch((err) => {
        response.status(500).json(err);
      });

    // response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

  private userToSessionRatio = async (request: Request, response: Response) => {
    response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

  private weeklyMaximumSessions = async (request: Request, response: Response) => {
    response.status(HtmlStatusCode.NOT_IMPLEMENTED).send();
  };

  private uploadCSVFile = async (request: Request, response: Response) => {
    this.summaryModel
      .addCsv(request.file.buffer.toString('utf8'))
      .then((result:Result) => {
        const {location, status, data} = result;

        const htmlStatusCodeMap: Map<ReportStatusCode, HtmlStatusCode> = new Map();
        htmlStatusCodeMap.set(ReportStatusCode.AVAILABLE,HtmlStatusCode.CREATED);
        htmlStatusCodeMap.set(ReportStatusCode.BUILDING,HtmlStatusCode.ACCEPTED);

        const htmlStatusCode = ReportController.reportStatusToHtmlStatusReply(status, htmlStatusCodeMap);

        if([HtmlStatusCode.ACCEPTED, HtmlStatusCode.CREATED].includes(htmlStatusCode))
          response.status(htmlStatusCode).set({'Location': location}).json(data);
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
    this.summaryModel
      .summary(id)
      .then((summary) => response.status(200).json(summary))
      .catch((err) => {
        response.status(404).send(err);
      });
  };
}

export default ReportController;
