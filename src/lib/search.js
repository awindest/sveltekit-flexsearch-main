import FlexSearch from 'flexsearch'


let componentsIndex
let components

export function createComponentsIndex(data) {
	componentsIndex = new FlexSearch.Index({ tokenize: 'forward' })

	data.forEach( (component, i) => {
		const item = `${component.component} ${component.description}`
		componentsIndex.add(i, item)
	})

	components = data
}

export function searchComponentsIndex(searchTerm) {
	const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const results = componentsIndex.search(match)

	return results
		.map((index) => components[index])
		.map(({ component, description }) => {
			return {
				component: replaceTextWithMarker(component, match),
				description: getMatches(description, match),
			}
		})
}

function replaceTextWithMarker(text, match) {
	const regex = new RegExp(match, 'gi')
	return text.replaceAll(regex, (match) => `<mark>${match}</mark>`)
}

function getMatches(text, searchTerm, limit = 1) {
	const regex = new RegExp(searchTerm, 'gi')
	const indexes = []
	let matches = 0
	let match

	while ((match = regex.exec(text)) !== null && matches < limit) {
		indexes.push(match.index)
		matches++
	}

	return indexes.map((index) => {
		const start = index - 20
		const end = index + 80
		const excerpt = text.substring(start, end).trim()
		return `...${replaceTextWithMarker(excerpt, searchTerm)}...`
	})
}
