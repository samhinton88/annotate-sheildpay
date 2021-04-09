import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {runAnnotate } from './studybook/run-annotate'

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/annotate', async (req, res) => {
  const { code, funcToRun } = req.body;
  try {
    const result = runAnnotate(code, funcToRun);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

})

const port = 4646;
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
})