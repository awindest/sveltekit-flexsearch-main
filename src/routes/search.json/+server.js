import { json } from '@sveltejs/kit'
// import posts from './posts.json'
import data from './Componentsv801.json' // name of id

export async function GET() {
	return json(data)
}
