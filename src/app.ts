import helmet from "helmet";
import cors from "cors";
import express, {type Application,type Request,type Response} from "express";
import CookieParser from "cookie-parser";
import config from "./config";
import { globalErrorHandler, notFound } from "./middleware/globalErrorHandeler";
import { routes } from "./routes";
import { paymentController } from "./modules/payment/payment.controller";




const app: Application = express();


app.use(helmet());
app.use(cors({origin: config.app_url,credentials : true,}),);
app.post("/api/payments/confirm",express.raw({ type: "application/json" }),paymentController.handleStripeWebhook);
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
app.use('/api',routes);

//Global midleware
app.use(notFound);
app.use(globalErrorHandler);


export default app;