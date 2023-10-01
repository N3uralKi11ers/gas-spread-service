import { Box, Button, Link, Typography } from '@mui/material'
import { useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'

const drawMatrix = (ctx: CanvasRenderingContext2D, matrix: number[][]) => {
	const size = matrix[0].length > 100 ? 2 : 10
	const padding = matrix[0].length > 100 ? 1 : 5
	const rows = matrix.length
	const cols = matrix[0].length

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (matrix[i][j] === 1) {
				ctx.fillStyle = 'red'
				ctx.fillRect(j * (size + padding), i * (size + padding), size, size)
			} else {
				ctx.fillStyle = 'green'
				ctx.fillRect(j * (size + padding), i * (size + padding), size, size)
			}
		}
	}
}

const Result = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const matrixString = localStorage.getItem('imgData')
	const matrix: { ev_map: number[][] } = JSON.parse(
		matrixString ? matrixString : ''
	)
	console.log(matrix.ev_map)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// const matrixString = localStorage.getItem('imgData')

		if (matrixString) {
			// const matrix: { ev_map: number[][] } = JSON.parse(matrixString)
			drawMatrix(ctx, matrix.ev_map)
		}
	}, [matrix.ev_map, matrixString])

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				padding: '2rem',
				gap: '1rem',
			}}
		>
			<NavLink to='/'>
				<Link component='button'>
					<Typography sx={{ fontSize: '1.5rem' }}>На главную</Typography>
				</Link>
			</NavLink>
			<canvas
				ref={canvasRef}
				height={matrix.ev_map[0].length * 15}
				width={matrix.ev_map[0].length * 15}
			/>
			<Button variant='contained'>Запуск</Button>
		</Box>
	)
}

export default Result
