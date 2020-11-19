import 'dotenv/config';
import App from './app';
import Controllers from './components/controllers';
// import validateEnv from './utils/validateEnv';

// validateEnv();

class Server {
  private _app: App;

  constructor() {
    this._app = new App(Controllers.all(), Server.envPort());
  }

  public expressApp():Express.Application {
    return this._app.app();
  }

  public start():Server {
    this._app.listen();
    return this;
  }

  public static envPort(defaultPort = 3000):number {
    return Number(process.env.PORT || defaultPort);
  }

}

export default Server;