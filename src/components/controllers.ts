import ReportController from './reports/reports.controller';
import Controller from './../interfaces/controller.interface';

class Controllers {
    
  static all():Controller[] {
    return [
      new ReportController(),
    ];
  }
}

export default Controllers;