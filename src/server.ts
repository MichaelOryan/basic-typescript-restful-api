import 'dotenv/config';
import App from './app';
import Controllers from './components/controllers';
// import validateEnv from './utils/validateEnv';

// validateEnv();

class Server {
  private _app: App;

  constructor() {
    this._app = new App(Controllers.all(), Server.envPort());
    return this;
  }

  public expressApp() {
    return this._app.app();
  }

  public start() {
    this._app.listen();
    return this;
  }

  public static envPort() {
    return Number(process.env.PORT || 3000);
  }

}

export default Server;