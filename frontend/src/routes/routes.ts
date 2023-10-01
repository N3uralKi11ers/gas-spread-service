import { FC } from 'react'
import Home from '../pages/Home'
import Result from '../pages/Result'

interface Routes {
	path: string
	Element: FC
}

export const routes: Routes[] = [
	{ path: '/', Element: Home },
	{ path: 'result', Element: Result },
]
