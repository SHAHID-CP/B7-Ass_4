import helmet from "helmet";
import cors from "cors";
import express, {type Application,type Request,type Response} from "express";
import CookieParser from "cookie-parser";
import config from "./config";


const app: Application = express();

app.use(helmet());
app.use(cors({origin: config.app_url,credentials : true,}),);
app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));




app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success:true,
    message: "Wellcome to Rent Nest Server"
  });
});

//Api End poit
// app.use('/api/auth', authRoutes);
// app.use('/api/issues', issueRoutes);

//Global midleware
// app.use(notFound);
// app.use(globalErrorHandler);


export default app;