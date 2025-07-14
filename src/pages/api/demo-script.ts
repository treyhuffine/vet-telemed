import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'DEMO_SCRIPT.md');
    const content = fs.readFileSync(filePath, 'utf-8');
    
    res.setHeader('Content-Type', 'text/markdown');
    res.status(200).send(content);
  } catch (error) {
    console.error('Error reading demo script:', error);
    res.status(404).json({ error: 'Demo script not found' });
  }
}