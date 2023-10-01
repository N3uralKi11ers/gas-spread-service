import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routes/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					{routes.map(({ path, Element }, index) => (
						<Route path={path} element={<Element />} key={index} />
					))}
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	)
}

export default App
