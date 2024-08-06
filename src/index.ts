import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import userRouter from './routes/userRoute'
import taskRouter from './routes/taskRoute'
import devRoute from './routes/devRoutes'
import cors from 'cors';


const app = express();
const port = process.env.PORT || 4000;

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   next();
// });

app.use(cors())
app.use(express.json())

app.use('/user',userRouter)
app.use('/task', taskRouter)
app.use('/dev', devRoute)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
