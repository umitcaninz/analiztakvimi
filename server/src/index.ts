import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/analiztakvimi';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123!';

await mongoose.connect(MONGO_URI);

type Category = 'analizler' | 'etkinlikler' | 'haberler';

const eventSchema = new mongoose.Schema({
  category: { type: String, enum: ['analizler', 'etkinlikler', 'haberler'], required: true },
  date: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  is_new: { type: Boolean, required: true },
  link: { type: String }
}, { timestamps: true });

const EventModel = mongoose.model('Event', eventSchema);

function auth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    if (!payload?.sub) throw new Error('invalid');
    next();
  } catch {
    res.status(401).json({ error: 'unauthorized' });
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ sub: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'invalid_credentials' });
  }
});

app.get('/events', async (_req, res) => {
  const docs = await EventModel.find({}).lean();
  const out: Record<Category, Record<string, any>> = {
    analizler: {}, etkinlikler: {}, haberler: {}
  } as any;
  for (const d of docs) {
    out[d.category as Category][d.date] = {
      category: d.category,
      date: d.date,
      description: d.description,
      is_new: d.is_new,
      link: d.link
    };
  }
  res.json(out);
});

app.post('/upsert', auth, async (req, res) => {
  const { category, event } = req.body as { category: Category, event: any };
  if (!category || !event?.date || !event?.description || typeof event?.is_new !== 'boolean') {
    res.status(400).json({ error: 'invalid_payload' });
    return;
  }
  await EventModel.findOneAndUpdate(
    { date: event.date },
    { ...event, category },
    { upsert: true, new: true }
  );
  res.json({ ok: true });
});

app.post('/delete', auth, async (req, res) => {
  const { category, date } = req.body as { category: Category, date: string };
  if (!category || !date) {
    res.status(400).json({ error: 'invalid_payload' });
    return;
  }
  await EventModel.deleteOne({ date });
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server on :${port}`));



