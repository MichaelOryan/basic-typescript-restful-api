import ReportController from './reports/reports.controller';

class Controllers {
    
    static all() {
        return [
            new ReportController(),
        ]
    }

}

export default Controllers