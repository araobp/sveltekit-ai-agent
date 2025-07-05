import { json } from '@sveltejs/kit';
import { tools } from '../../../lib/tools';

export async function GET() {
  return json(tools);
}
